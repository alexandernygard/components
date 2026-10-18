// Custom component: shadcn-svelte has no Combobox yet. See combobox.svelte.
import Root from "./combobox.svelte";
import Input from "./combobox-input.svelte";
import Content from "./combobox-content.svelte";
import Item from "./combobox-item.svelte";
import Empty from "./combobox-empty.svelte";
import Group from "./combobox-group.svelte";
import Label from "./combobox-label.svelte";
import Separator from "./combobox-separator.svelte";

export {
	Root,
	Input,
	Content,
	Item,
	Empty,
	Group,
	Label,
	Separator,
	//
	Root as Combobox,
	Input as ComboboxInput,
	Content as ComboboxContent,
	Item as ComboboxItem,
	Empty as ComboboxEmpty,
	Group as ComboboxGroup,
	Label as ComboboxLabel,
	Separator as ComboboxSeparator,
};
