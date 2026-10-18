<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";

	const { Story } = defineMeta({ title: "Components/Button" });
</script>

<Story name="Variants">
	<div class="flex flex-wrap items-center gap-3">
		<Button>Save changes</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="destructive">Delete</Button>
		<Button variant="link">Link</Button>
	</div>
</Story>

<Story name="Sizes">
	<div class="flex flex-wrap items-center gap-3">
		<Button size="sm">Small</Button>
		<Button>Default</Button>
		<Button size="lg">Large</Button>
		<Button size="icon" aria-label="Add"><PlusIcon /></Button>
	</div>
</Story>

<Story name="With icons">
	<div class="flex flex-wrap items-center gap-3">
		<Button>Continue <ArrowRightIcon /></Button>
		<Button variant="outline" disabled><Spinner /> Saving</Button>
		<Button href="https://github.com/alexandernygard/components" variant="outline">As a link</Button>
	</div>
</Story>
