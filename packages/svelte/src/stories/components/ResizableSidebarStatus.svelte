<script lang="ts">
	import { useResizableSidebar } from "$lib/components/ui/resizable/index.js";

	const chat = useResizableSidebar("chat");
</script>

<span class="text-xs text-muted-foreground">Chat {chat.open ? "open" : "closed"}</span>
