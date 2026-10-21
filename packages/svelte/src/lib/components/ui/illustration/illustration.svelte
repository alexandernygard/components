<script lang="ts" module>
	import type { Spec, ThemeName } from "@alexandernygard/illustrations";

	const specKeys = [
		"title", "tagline", "byline", "motif", "accent", "accent2", "seed", "size",
		"layout", "position", "fade", "background", "texture", "subject",
	] as const satisfies readonly (keyof Spec)[];

	export type IllustrationSpec = Pick<Spec, (typeof specKeys)[number]>;
	export type IllustrationProps = IllustrationSpec & {
		/** A fixed theme. By default it follows dark mode: mist when light, ink when dark. */
		theme?: ThemeName;
		/** Describes the image for screen readers. Without it the illustration is decorative. */
		alt?: string;
	};
</script>

<script lang="ts">
	import { compose } from "@alexandernygard/illustrations";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	// Generative art from @alexandernygard/illustrations, sized to its container. The SVG is built
	// from the props alone, so it renders the same on the server and in the browser.
	let {
		ref = $bindable(null),
		class: className,
		theme,
		alt,
		...props
	}: WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, keyof IllustrationSpec | "children">> &
		IllustrationProps = $props();

	const split = $derived.by(() => {
		const spec: Spec = {};
		const rest: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(props)) {
			if ((specKeys as readonly string[]).includes(key)) (spec as Record<string, unknown>)[key] = value;
			else rest[key] = value;
		}
		return { spec, rest };
	});

	const render = (spec: Spec) =>
		compose({ size: "480x360", background: "none", texture: false, ...spec }).svg;
	const light = $derived(render({ ...split.spec, theme: theme ?? "mist" }));
	const dark = $derived(theme ? "" : render({ ...split.spec, theme: "ink" }));
	const svg = "[&_svg]:block [&_svg]:h-auto [&_svg]:w-full";
</script>

<div
	bind:this={ref}
	data-slot="illustration"
	role={alt ? "img" : undefined}
	aria-label={alt}
	aria-hidden={alt ? undefined : true}
	class={cn("w-full", className)}
	{...split.rest}
>
	<div class={cn(svg, !theme && "dark:hidden")}>{@html light}</div>
	{#if dark}
		<div class={cn(svg, "hidden dark:block")}>{@html dark}</div>
	{/if}
</div>
