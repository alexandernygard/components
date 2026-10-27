export type ToolValueFormat =
	| "auto"
	| "json"
	| "keyvalue"
	| "table"
	| "code"
	| "terminal"
	| "markdown"
	| "diff"
	| "text"
	| "image";

export type PlainObject = Record<string, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		Object.getPrototypeOf(value) === Object.prototype
	);
}

export function isPrimitive(value: unknown) {
	return value === null || (typeof value !== "object" && typeof value !== "function");
}

export function stringify(value: unknown) {
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value, null, 2) ?? String(value);
	} catch {
		return String(value);
	}
}

export function formatPrimitive(value: unknown) {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "string") return value;
	return String(value);
}

// MCP tools answer with `{ content: [{ type: "text", text }] }`. The text is
// usually the real result, so it is unwrapped and shown on its own.
export function unwrapContent(value: unknown): unknown {
	const content = isPlainObject(value) && Array.isArray(value.content) ? value.content : value;

	if (
		Array.isArray(content) &&
		content.length > 0 &&
		content.every((item) => isPlainObject(item) && typeof item.type === "string")
	) {
		const items = content as PlainObject[];
		if (items.every((item) => item.type === "text" && typeof item.text === "string")) {
			return items.map((item) => item.text).join("\n\n");
		}
	}

	return value;
}

export function parseJsonString(value: string): unknown {
	const trimmed = value.trim();
	if (!/^[[{]/.test(trimmed)) return undefined;
	try {
		return JSON.parse(trimmed);
	} catch {
		return undefined;
	}
}

export function isTable(value: unknown): value is PlainObject[] {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((row) => isPlainObject(row) && Object.values(row).every(isPrimitive))
	);
}

function isImage(value: unknown) {
	return isPlainObject(value) && value.type === "image" && typeof value.data === "string";
}

const extensionLanguages: Record<string, string> = {
	ts: "typescript",
	mts: "typescript",
	cts: "typescript",
	tsx: "tsx",
	js: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	jsx: "jsx",
	json: "json",
	jsonc: "json",
	css: "css",
	html: "html",
	htm: "html",
	md: "markdown",
	mdx: "markdown",
	py: "python",
	sql: "sql",
	yml: "yaml",
	yaml: "yaml",
	sh: "bash",
	bash: "bash",
	zsh: "bash",
	diff: "diff",
	patch: "diff",
};

/**
 * Guesses the language to highlight from a file name, such as "src/model.ts".
 * Returns undefined for files the highlighter has no language for.
 */
export function languageFromPath(path: string | undefined) {
	const extension = path?.split(/[\\/]/).pop()?.split(".").slice(1).pop()?.toLowerCase();
	return extension ? extensionLanguages[extension] : undefined;
}

/** The file a tool works on, from the names file tools give it. */
export function pathOf(value: unknown) {
	if (!isPlainObject(value)) return undefined;
	const path = value.path ?? value.file_path ?? value.filePath ?? value.filename;
	return typeof path === "string" ? path : undefined;
}

/** Picks a viewer from the shape of the value. */
export function detectFormat(value: unknown): Exclude<ToolValueFormat, "auto"> {
	if (typeof value === "string") {
		if (/^(diff --git|--- |@@ )/.test(value)) return "diff";
		return "text";
	}
	if (isImage(value)) return "image";
	if (isTable(value)) return "table";
	if (
		isPlainObject(value) &&
		Object.keys(value).length > 0 &&
		Object.keys(value).length <= 12 &&
		Object.values(value).every((v) => isPrimitive(v) && (typeof v !== "string" || !v.includes("\n")))
	) {
		return "keyvalue";
	}
	if (isPrimitive(value)) return "text";
	return "json";
}

export type DiffLine = { kind: "added" | "removed" | "context" | "hunk"; text: string };

export function diffLines(before: string, after: string): DiffLine[] {
	const a = before.split("\n");
	const b = after.split("\n");

	// Longest common subsequence. Very large inputs skip it and show the whole
	// old text removed and the new text added.
	if (a.length * b.length > 4_000_000) {
		return [
			...a.map((text) => ({ kind: "removed" as const, text })),
			...b.map((text) => ({ kind: "added" as const, text })),
		];
	}

	const table = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
	for (let i = a.length - 1; i >= 0; i--) {
		for (let j = b.length - 1; j >= 0; j--) {
			table[i][j] =
				a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
		}
	}

	const lines: DiffLine[] = [];
	let i = 0;
	let j = 0;
	while (i < a.length || j < b.length) {
		if (i < a.length && j < b.length && a[i] === b[j]) {
			lines.push({ kind: "context", text: a[i] });
			i++;
			j++;
		} else if (i < a.length && (j === b.length || table[i + 1][j] >= table[i][j + 1])) {
			lines.push({ kind: "removed", text: a[i] });
			i++;
		} else {
			lines.push({ kind: "added", text: b[j] });
			j++;
		}
	}
	return lines;
}

export function parsePatch(patch: string): DiffLine[] {
	return patch
		.replace(/\n$/, "")
		.split("\n")
		.filter((line) => !/^(diff --git|index |--- |\+\+\+ )/.test(line))
		.map((line) => {
			if (line.startsWith("@@")) return { kind: "hunk", text: line };
			if (line.startsWith("+")) return { kind: "added", text: line.slice(1) };
			if (line.startsWith("-")) return { kind: "removed", text: line.slice(1) };
			return { kind: "context", text: line.slice(1) };
		});
}

// Reads the before and after text from the shapes edit tools use.
export function diffSides(value: unknown): [string, string] | undefined {
	if (!isPlainObject(value)) return undefined;

	const pairs = [
		["before", "after"],
		["old_string", "new_string"],
		["oldText", "newText"],
		["original", "modified"],
	];
	for (const [from, to] of pairs) {
		if (typeof value[from] === "string" && typeof value[to] === "string") {
			return [value[from] as string, value[to] as string];
		}
	}
	return undefined;
}

export function imageSource(value: unknown): string | undefined {
	let src: string | undefined;
	if (typeof value === "string") {
		src = value;
	} else if (isPlainObject(value) && typeof value.data === "string") {
		const type = value.mimeType ?? value.mediaType ?? "image/png";
		src = value.data.startsWith("data:") ? value.data : `data:${type};base64,${value.data}`;
	} else if (isPlainObject(value) && typeof value.url === "string") {
		src = value.url;
	}
	return src && /^(https?:|data:image\/|blob:|\/)/.test(src) ? src : undefined;
}
