<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import * as Accordion from "$lib/components/ui/accordion/index.js";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	const { Story } = defineMeta({ title: "Components/Navigation" });
</script>

<Story name="Tabs">
	<div class="grid w-96 gap-8">
		<Tabs.Root value="month">
			<Tabs.List>
				<Tabs.Trigger value="week">Week</Tabs.Trigger>
				<Tabs.Trigger value="month">Month</Tabs.Trigger>
				<Tabs.Trigger value="year">Year</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="week" class="text-sm text-muted-foreground">kr 2 140 spent this week.</Tabs.Content>
			<Tabs.Content value="month" class="text-sm text-muted-foreground">kr 9 860 spent this month.</Tabs.Content>
			<Tabs.Content value="year" class="text-sm text-muted-foreground">kr 104 300 spent this year.</Tabs.Content>
		</Tabs.Root>
		<Tabs.Root value="overview">
			<Tabs.List variant="line">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
				<Tabs.Trigger value="goals">Goals</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
</Story>

<Story name="Breadcrumb">
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item><Breadcrumb.Link href="#/">Home</Breadcrumb.Link></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Link href="#/goals">Goals</Breadcrumb.Link></Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item><Breadcrumb.Page>Flat deposit</Breadcrumb.Page></Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</Story>

<Story name="Pagination">
	<Pagination.Root count={120} perPage={10}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item><Pagination.PrevButton /></Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>{page.value}</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item><Pagination.NextButton /></Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</Story>

<Story name="Navigation menu">
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Money</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-80 gap-1 p-1">
						{#each [["Accounts", "Balances and cards"], ["Budgets", "Monthly limits by category"], ["Goals", "What you're saving for"]] as [title, text] (title)}
							<li>
								<NavigationMenu.Link href="#/">
									<div class="text-sm font-medium">{title}</div>
									<div class="text-sm text-muted-foreground">{text}</div>
								</NavigationMenu.Link>
							</li>
						{/each}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Link href="#/" class={buttonVariants({ variant: "ghost" })}>Reports</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</Story>

<Story name="Accordion">
	<Accordion.Root type="single" class="w-96" value="buffer">
		<Accordion.Item value="buffer">
			<Accordion.Trigger>How big should my buffer be?</Accordion.Trigger>
			<Accordion.Content>Three months of fixed costs is a common starting point.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="bsu">
			<Accordion.Trigger>What is BSU?</Accordion.Trigger>
			<Accordion.Content>A housing savings account for people under 34, with a tax deduction.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="sync">
			<Accordion.Trigger>How often do transactions sync?</Accordion.Trigger>
			<Accordion.Content>Every few hours, and whenever you open the app.</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</Story>

<Story name="Collapsible">
	<Collapsible.Root class="w-80">
		<div class="flex items-center justify-between">
			<p class="text-sm font-medium">3 recurring payments</p>
			<Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "icon-sm" })} aria-label="Toggle">
				<ChevronsUpDownIcon />
			</Collapsible.Trigger>
		</div>
		<div class="mt-2 rounded-lg border px-3 py-2 text-sm">Rent, kr 14 500</div>
		<Collapsible.Content class="mt-2 grid gap-2">
			<div class="rounded-lg border px-3 py-2 text-sm">Electricity, about kr 900</div>
			<div class="rounded-lg border px-3 py-2 text-sm">Spotify, kr 129</div>
		</Collapsible.Content>
	</Collapsible.Root>
</Story>
