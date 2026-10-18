<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import FileIcon from "@lucide/svelte/icons/file";
	import GlobeIcon from "@lucide/svelte/icons/globe";
	import SearchIcon from "@lucide/svelte/icons/search";
	import TerminalIcon from "@lucide/svelte/icons/terminal";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as CodeBlock from "$lib/components/ui/code-block/index.js";
	import * as Questionnaire from "$lib/components/ui/questionnaire/index.js";
	import { Toaster, toast } from "$lib/components/ui/sonner/index.js";
	import * as Trace from "$lib/components/ui/trace/index.js";

	const { Story } = defineMeta({ title: "Components/Trace and questionnaire" });

	const items = [
		{ name: "goal", required: true, choices: [{ value: "buy" }, { value: "rent" }, { value: "unsure" }] },
		{ name: "costs", choices: [{ value: "fees" }, { value: "maintenance" }, { value: "insurance" }] },
		{ name: "horizon", required: true, choices: [{ value: "2" }, { value: "5" }, { value: "10" }] },
	];

	function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		toast.success("Answers saved", {
			description: `Goal: ${data.get("goal")}, horizon: ${data.get("horizon")} years`,
		});
	}
</script>

<Story name="Trace">
	<Trace.Root class="w-[28rem]">
		<Trace.Line>
			<Trace.Icon><SearchIcon /></Trace.Icon>
			<Trace.Title>Searched transactions for "Mathallen"</Trace.Title>
			<Trace.Description>11 results</Trace.Description>
		</Trace.Line>
		<Trace.Collapsible open>
			<Trace.CollapsibleTrigger>
				<Trace.Line>
					<Trace.Icon><TerminalIcon /></Trace.Icon>
					<Trace.Title>Ran pnpm typecheck</Trace.Title>
				</Trace.Line>
			</Trace.CollapsibleTrigger>
			<Trace.CollapsibleContent>
				<CodeBlock.Root size="sm"><CodeBlock.Content wrap code={"$ pnpm typecheck\nDone in 4.2s"} /></CodeBlock.Root>
			</Trace.CollapsibleContent>
		</Trace.Collapsible>
		<Trace.Collapsible>
			<Trace.CollapsibleTrigger>
				<Trace.Line>
					<Trace.Icon><GlobeIcon /></Trace.Icon>
					<Trace.Title>Searched the web for Oslo rent index 2026</Trace.Title>
				</Trace.Line>
			</Trace.CollapsibleTrigger>
			<Trace.CollapsibleContent class="flex flex-wrap gap-1.5">
				<Badge variant="secondary">ssb.no/rent-index</Badge>
				<Badge variant="secondary">obos.no/market</Badge>
			</Trace.CollapsibleContent>
		</Trace.Collapsible>
		<Trace.Line>
			<Trace.Icon><FileIcon /></Trace.Icon>
			<Trace.Title>Read src/shared/finance/model.ts</Trace.Title>
		</Trace.Line>
		<Trace.Line status="running">
			<Trace.Icon><SearchIcon /></Trace.Icon>
			<Trace.Title class="shimmer">Comparing rent and mortgage scenarios</Trace.Title>
		</Trace.Line>
	</Trace.Root>
</Story>

<Story name="Questionnaire">
	<Questionnaire.Root class="mx-auto w-[32rem]" defaultItem="goal" {items} shortcuts="letters" onsubmit={handleSubmit}>
		<Questionnaire.Progress />
		<Questionnaire.Item name="goal" required>
			<Questionnaire.Title>What are you planning for?</Questionnaire.Title>
			<Questionnaire.Description>Pick one, or describe it in your own words.</Questionnaire.Description>
			<Questionnaire.Choices>
				<Questionnaire.Choice value="buy">
					<span class="font-medium">Buying a flat</span>
					<Questionnaire.ChoiceDescription>Model a deposit, mortgage and monthly costs.</Questionnaire.ChoiceDescription>
				</Questionnaire.Choice>
				<Questionnaire.Choice value="rent">
					<span class="font-medium">Renting for now</span>
					<Questionnaire.ChoiceDescription>Track rent and build savings on the side.</Questionnaire.ChoiceDescription>
				</Questionnaire.Choice>
				<Questionnaire.Choice value="unsure">
					<span class="font-medium">Not sure yet</span>
					<Questionnaire.ChoiceDescription>Compare both side by side.</Questionnaire.ChoiceDescription>
				</Questionnaire.Choice>
				<Questionnaire.Input aria-label="Something else" placeholder="Something else…" />
			</Questionnaire.Choices>
			<Questionnaire.Error />
		</Questionnaire.Item>
		<Questionnaire.Item name="costs" multiple>
			<Questionnaire.Title>Which costs should the plan include?</Questionnaire.Title>
			<Questionnaire.Description>Pick any, or skip this question.</Questionnaire.Description>
			<Questionnaire.Choices>
				<Questionnaire.Choice value="fees">Shared costs (felleskostnader)</Questionnaire.Choice>
				<Questionnaire.Choice value="maintenance">Maintenance</Questionnaire.Choice>
				<Questionnaire.Choice value="insurance">Insurance</Questionnaire.Choice>
			</Questionnaire.Choices>
			<Questionnaire.Error />
		</Questionnaire.Item>
		<Questionnaire.Item name="horizon" required>
			<Questionnaire.Title>How far ahead should we plan?</Questionnaire.Title>
			<Questionnaire.Choices>
				<Questionnaire.Choice value="2">2 years</Questionnaire.Choice>
				<Questionnaire.Choice value="5">5 years</Questionnaire.Choice>
				<Questionnaire.Choice value="10">10 years</Questionnaire.Choice>
			</Questionnaire.Choices>
			<Questionnaire.Error />
		</Questionnaire.Item>
		<Questionnaire.Actions class="w-full">
			<Questionnaire.Previous />
			<Questionnaire.Skip />
			<Questionnaire.Next>Next</Questionnaire.Next>
			<Questionnaire.Submit>Build plan</Questionnaire.Submit>
		</Questionnaire.Actions>
	</Questionnaire.Root>
	<Toaster />
</Story>
