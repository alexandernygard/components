<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";

	const { Story } = defineMeta({ title: "Foundations/Tokens", parameters: { layout: "padded" } });

	// Same tokens as the React library: both read them from @alexandernygard/tokens.
	const groups = [
		{ name: "Surfaces", note: "The page, raised surfaces and quiet fills.", tokens: ["background", "card", "popover", "muted", "secondary", "accent"] },
		{ name: "Ink", note: "Text and primary actions.", tokens: ["foreground", "muted-foreground", "primary", "primary-foreground"] },
		{ name: "Lines", note: "Borders, input outlines and the focus ring.", tokens: ["border", "input", "ring"] },
		{ name: "Cloudberry", note: "The only accent. Reserved for on and selected states.", tokens: ["highlight", "highlight-edge", "highlight-foreground"] },
		{ name: "Status", note: "For messages and figures that carry meaning.", tokens: ["destructive", "positive", "warning", "info"] },
		{ name: "Charts", note: "A categorical palette that holds up in both themes.", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
	];
	const radii = [
		["rounded-sm", "Checkbox", "size-10"],
		["rounded-lg", "Button, input", "h-10 w-24"],
		["rounded-xl", "Card", "h-24 w-32"],
		["rounded-2xl", "Dialog", "h-32 w-40"],
		["rounded-full", "Badge, switch", "h-8 w-20"],
	];
</script>

<Story name="Colors">
	<div class="flex max-w-4xl flex-col gap-10">
		{#each groups as group (group.name)}
			<section class="grid gap-4 md:grid-cols-[14rem_1fr]">
				<div>
					<h2 class="font-heading text-xl">{group.name}</h2>
					<p class="mt-1 text-sm text-muted-foreground">{group.note}</p>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each group.tokens as token (token)}
						<div class="flex items-center gap-3">
							<div class="size-11 shrink-0 rounded-lg ring-1 ring-foreground/10" style:background={`var(--${token})`}></div>
							<div class="min-w-0">
								<div class="text-sm font-medium">{token}</div>
								<code class="text-xs text-muted-foreground">--{token}</code>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</Story>

<Story name="Typography">
	<div class="flex max-w-3xl flex-col gap-12">
		<section class="flex flex-col gap-3">
			<p class="text-sm text-muted-foreground">Libron, for titles and long reading</p>
			<p class="font-heading text-6xl leading-[1.05]">Some days left in October</p>
			<p class="max-w-[62ch] font-serif text-lg leading-relaxed">
				A serif with open counters and a calm rhythm. It sets card, dialog and sheet titles, and any prose long
				enough to be read rather than scanned.
			</p>
		</section>
		<section class="flex flex-col gap-3">
			<p class="text-sm text-muted-foreground">Schibsted Grotesk, for the interface</p>
			<p class="text-4xl font-semibold tracking-tight">Track the work day</p>
			<p class="max-w-[65ch] text-base leading-relaxed">
				A grotesk drawn for a Norwegian newsroom, so it stays clear at small sizes and in dense layouts.
			</p>
			<p class="text-3xl font-medium tabular-nums">kr 42 318,50</p>
		</section>
	</div>
</Story>

<Story name="Radius and elevation">
	<div class="flex max-w-3xl flex-col gap-12">
		<div class="flex flex-wrap items-end gap-6">
			{#each radii as [cls, label, size] (cls)}
				<div class="flex flex-col gap-2">
					<div class={`${cls} ${size} border-2 border-foreground/70 bg-card`}></div>
					<span class="text-xs text-muted-foreground">{label}</span>
				</div>
			{/each}
		</div>
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-5">
			{#each ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"] as s (s)}
				<div class="flex flex-col gap-2">
					<div class={`h-20 rounded-xl bg-card ${s}`}></div>
					<code class="text-xs text-muted-foreground">{s}</code>
				</div>
			{/each}
		</div>
	</div>
</Story>
