import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const meta = {
  title: "Components/Select",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SelectStory: Story = {
  name: "Select",
  render: () => (
    <Field className="w-64">
      <FieldLabel>Category</FieldLabel>
      <Select defaultValue="groceries">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pick a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Spending</SelectLabel>
            <SelectItem value="groceries">Groceries</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="eating-out">Eating out</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Fixed</SelectLabel>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  ),
}

const cities = ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Kristiansand", "Bodø", "Ålesund"]

export const ComboboxStory: Story = {
  name: "Combobox",
  render: () => (
    <Field className="w-64">
      <FieldLabel>City</FieldLabel>
      <Combobox items={cities}>
        <ComboboxInput placeholder="Search cities" />
        <ComboboxContent>
          <ComboboxEmpty>No city by that name.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Used for rent comparisons.</FieldDescription>
    </Field>
  ),
}

export const NativeSelectStory: Story = {
  name: "Native select",
  render: () => (
    <Field className="w-64">
      <FieldLabel htmlFor="currency">Currency</FieldLabel>
      <NativeSelect id="currency" defaultValue="nok">
        <NativeSelectOption value="nok">Norwegian krone (NOK)</NativeSelectOption>
        <NativeSelectOption value="sek">Swedish krona (SEK)</NativeSelectOption>
        <NativeSelectOption value="eur">Euro (EUR)</NativeSelectOption>
      </NativeSelect>
    </Field>
  ),
}
