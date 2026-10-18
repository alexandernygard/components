<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import HomeIcon from "@lucide/svelte/icons/house";
	import PiggyBankIcon from "@lucide/svelte/icons/piggy-bank";
	import ReceiptIcon from "@lucide/svelte/icons/receipt";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import WalletIcon from "@lucide/svelte/icons/wallet";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	const { Story } = defineMeta({ title: "Patterns/App shell", parameters: { layout: "fullscreen" } });

	const nav = [
		{ title: "Overview", icon: HomeIcon },
		{ title: "Accounts", icon: WalletIcon },
		{ title: "Transactions", icon: ReceiptIcon },
		{ title: "Goals", icon: PiggyBankIcon },
	];
	const goals = [
		{ name: "Flat deposit", saved: 412000, target: 600000 },
		{ name: "Summer in Lofoten", saved: 38000, target: 50000 },
		{ name: "Buffer", saved: 61000, target: 60000 },
	];
	const kr = (n: number) => new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n);
</script>

<script lang="ts">
	let active = $state("Overview");
</script>

<Story name="Sidebar dashboard">
	<Sidebar.Provider>
		<Sidebar.Root collapsible="icon">
			<Sidebar.Header>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg">
							<div class="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-primary-foreground">l</div>
							<span class="font-heading text-lg">lommebok</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Money</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each nav as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton isActive={active === item.title} tooltipContent={item.title} onclick={() => (active = item.title)}>
										<item.icon />
										<span>{item.title}</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							<SettingsIcon />
							<span>Settings</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton size="lg">
							<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<span>Alexander Nygård</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Footer>
			<Sidebar.Rail />
		</Sidebar.Root>
		<Sidebar.Inset>
			<header class="flex h-14 items-center gap-2 border-b px-4">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 h-4!" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item><Breadcrumb.Page>{active}</Breadcrumb.Page></Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			<main class="grid gap-4 p-6 md:grid-cols-3">
				{#each goals as goal (goal.name)}
					<Card.Root>
						<Card.Header>
							<Card.Title>{goal.name}</Card.Title>
							<Card.Description>{kr(goal.saved)} of {kr(goal.target)}</Card.Description>
							<Card.Action>
								{#if goal.saved >= goal.target}
									<Badge variant="positive">Done</Badge>
								{/if}
							</Card.Action>
						</Card.Header>
						<Card.Content>
							<Progress value={Math.min(100, (goal.saved / goal.target) * 100)} />
						</Card.Content>
					</Card.Root>
				{/each}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
</Story>
