<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import InfoIcon from "@lucide/svelte/icons/info";
	import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
	import OctagonXIcon from "@lucide/svelte/icons/octagon-x";
	import ReceiptIcon from "@lucide/svelte/icons/receipt";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { Toaster, toast } from "$lib/components/ui/sonner/index.js";
	import { Spinner } from "$lib/components/ui/spinner/index.js";

	const { Story } = defineMeta({ title: "Components/Feedback" });
</script>

<Story name="Alerts">
	<div class="grid w-[28rem] gap-3">
		<Alert.Root>
			<InfoIcon />
			<Alert.Title>Statement ready</Alert.Title>
			<Alert.Description>Your September statement is ready to download.</Alert.Description>
		</Alert.Root>
		<Alert.Root variant="positive">
			<CircleCheckIcon />
			<Alert.Title>Goal reached</Alert.Title>
			<Alert.Description>You saved kr 50 000 for the summer trip.</Alert.Description>
		</Alert.Root>
		<Alert.Root variant="warning">
			<TriangleAlertIcon />
			<Alert.Title>Eating out is at 92%</Alert.Title>
			<Alert.Description>kr 160 left with 13 days to go.</Alert.Description>
		</Alert.Root>
		<Alert.Root variant="info">
			<InfoIcon />
			<Alert.Title>New categories</Alert.Title>
			<Alert.Description>Subscriptions now have their own category.</Alert.Description>
		</Alert.Root>
		<Alert.Root variant="destructive">
			<OctagonXIcon />
			<Alert.Title>Sync failed</Alert.Title>
			<Alert.Description>We couldn't reach your bank. Try again in a few minutes.</Alert.Description>
		</Alert.Root>
	</div>
</Story>

<Story name="Badges">
	<div class="flex flex-wrap gap-2">
		<Badge>Default</Badge>
		<Badge variant="secondary">Secondary</Badge>
		<Badge variant="outline">Outline</Badge>
		<Badge variant="positive">On track</Badge>
		<Badge variant="warning">Close to limit</Badge>
		<Badge variant="info">New</Badge>
		<Badge variant="destructive">Over budget</Badge>
	</div>
</Story>

<Story name="Progress and loading">
	<div class="grid w-80 gap-5">
		<div class="grid gap-2">
			<div class="flex justify-between text-sm"><span>Flat deposit</span><span class="tabular-nums">68%</span></div>
			<Progress value={68} />
		</div>
		<div class="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Syncing transactions</div>
		<div class="flex items-center gap-3">
			<Skeleton class="size-10 rounded-full" />
			<div class="grid flex-1 gap-2">
				<Skeleton class="h-4 w-3/4" />
				<Skeleton class="h-4 w-1/2" />
			</div>
		</div>
	</div>
</Story>

<Story name="Toast">
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" onclick={() => toast("Transaction added", { description: "kr 249 at Rema 1000" })}>
			Default
		</Button>
		<Button variant="outline" onclick={() => toast.success("Budget saved")}>Success</Button>
		<Button variant="outline" onclick={() => toast.error("Couldn't reach your bank")}>Error</Button>
		<Button
			variant="outline"
			onclick={() =>
				toast("Transaction hidden", { action: { label: "Undo", onClick: () => toast("Restored") } })}
		>
			With action
		</Button>
	</div>
	<Toaster />
</Story>

<Story name="Empty">
	<Empty.Root class="w-96 border">
		<Empty.Header>
			<Empty.Media variant="icon"><ReceiptIcon /></Empty.Media>
			<Empty.Title>No transactions yet</Empty.Title>
			<Empty.Description>Connect a bank account or import a CSV to get started.</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button>Connect bank</Button>
		</Empty.Content>
	</Empty.Root>
</Story>
