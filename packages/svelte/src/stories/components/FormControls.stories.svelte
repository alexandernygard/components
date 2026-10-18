<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as NativeSelect from "$lib/components/ui/native-select/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";

	const { Story } = defineMeta({ title: "Components/Form controls" });
</script>

<Story name="Text inputs">
	<div class="grid w-80 gap-4">
		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input id="email" type="email" placeholder="you@example.com" />
		</div>
		<div class="grid gap-2">
			<Label for="amount">Amount</Label>
			<Input id="amount" inputmode="decimal" value="4 250" aria-invalid="true" />
		</div>
		<div class="grid gap-2">
			<Label for="note">Note</Label>
			<Textarea id="note" placeholder="What was it for?" />
		</div>
		<div class="grid gap-2">
			<Label for="disabled">Disabled</Label>
			<Input id="disabled" disabled value="Can't edit this" />
		</div>
	</div>
</Story>

<Story name="Choices">
	<div class="grid w-80 gap-6">
		<div class="flex items-center gap-2">
			<Checkbox id="terms" checked />
			<Label for="terms">Round up purchases into savings</Label>
		</div>
		<RadioGroup.Root value="monthly">
			{#each [["weekly", "Weekly"], ["monthly", "Monthly"], ["yearly", "Yearly"]] as [value, label] (value)}
				<div class="flex items-center gap-2">
					<RadioGroup.Item {value} id={`period-${value}`} />
					<Label for={`period-${value}`}>{label}</Label>
				</div>
			{/each}
		</RadioGroup.Root>
		<div class="flex items-center justify-between">
			<Label for="notify">Notify me when a bill is due</Label>
			<Switch id="notify" checked />
		</div>
	</div>
</Story>

<Story name="Slider">
	<div class="grid w-80 gap-4">
		<Label>Monthly savings goal</Label>
		<Slider type="single" value={60} max={100} step={5} />
	</div>
</Story>

<Story name="One-time code">
	<InputOTP.Root maxlength={6}>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells.slice(0, 3) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				{#each cells.slice(3, 6) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</Story>

<Story name="Native select">
	<NativeSelect.Root class="w-60" aria-label="Account">
		<NativeSelect.Option value="">Choose an account</NativeSelect.Option>
		<NativeSelect.OptGroup label="Spending">
			<NativeSelect.Option value="daily">Everyday</NativeSelect.Option>
			<NativeSelect.Option value="bills">Bills</NativeSelect.Option>
		</NativeSelect.OptGroup>
		<NativeSelect.OptGroup label="Saving">
			<NativeSelect.Option value="buffer">Buffer</NativeSelect.Option>
			<NativeSelect.Option value="bsu">BSU</NativeSelect.Option>
		</NativeSelect.OptGroup>
	</NativeSelect.Root>
</Story>
