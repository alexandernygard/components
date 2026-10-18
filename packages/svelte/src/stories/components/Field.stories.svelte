<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";

	const { Story } = defineMeta({ title: "Components/Field" });
</script>

<Story name="Form">
	<form class="w-96" onsubmit={(e) => e.preventDefault()}>
		<Field.Set>
			<Field.Legend>New savings goal</Field.Legend>
			<Field.Description>We'll suggest a monthly amount from the target and date.</Field.Description>
			<Field.Group>
				<Field.Field>
					<Field.Label for="goal-name">Name</Field.Label>
					<Input id="goal-name" placeholder="Flat deposit" />
				</Field.Field>
				<Field.Field data-invalid="true">
					<Field.Label for="goal-amount">Target</Field.Label>
					<Input id="goal-amount" value="-50 000" aria-invalid="true" />
					<Field.Error>The target has to be more than kr 0.</Field.Error>
				</Field.Field>
				<Field.Separator />
				<Field.Field orientation="horizontal">
					<Checkbox id="goal-round" checked />
					<Field.Label for="goal-round">Round up card purchases</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Label for="goal-remind">Monthly reminder</Field.Label>
						<Field.Description>On the 25th, after payday.</Field.Description>
					</Field.Content>
					<Switch id="goal-remind" />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Button type="submit">Create goal</Button>
					<Button variant="outline" type="button">Cancel</Button>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</form>
</Story>
