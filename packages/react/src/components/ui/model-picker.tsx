"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Picks the model (and anything else that shapes the reply, such as effort)
// from a menu. The trigger is a quiet text button, so it sits in a composer
// footer or the bar under it.
function ModelPicker(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="model-picker" {...props} />
}

function ModelPickerTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <DropdownMenuTrigger asChild>
      <button
        data-slot="model-picker-trigger"
        type="button"
        className={cn(
          "group/model-picker-trigger inline-flex h-8 min-w-0 shrink items-center gap-1 rounded-lg px-2 text-sm whitespace-nowrap text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-muted aria-expanded:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="opacity-60 transition-transform group-aria-expanded/model-picker-trigger:rotate-180" />
      </button>
    </DropdownMenuTrigger>
  )
}

// The model name in the trigger, with an optional quieter detail such as the
// effort level.
function ModelPickerValue({
  detail,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { detail?: React.ReactNode }) {
  return (
    <span
      data-slot="model-picker-value"
      className={cn("flex min-w-0 items-baseline gap-1.5", className)}
      {...props}
    >
      <span className="truncate text-foreground/90">{children}</span>
      {detail && <span className="truncate text-muted-foreground">{detail}</span>}
    </span>
  )
}

function ModelPickerContent({
  className,
  align = "end",
  side = "top",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="model-picker-content"
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn("w-72 rounded-xl p-1.5", className)}
      {...props}
    />
  )
}

function ModelPickerGroup(props: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="model-picker-group" {...props} />
}

function ModelPickerLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel className={cn("px-2 pt-1.5", className)} {...props} />
}

function ModelPickerSeparator(props: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} />
}

// One choice: a title, an optional line under it and an optional badge such
// as "New" or "Max plan". A check marks the picked one.
function ModelPickerItem({
  title,
  description,
  badge,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  title?: React.ReactNode
  description?: React.ReactNode
  badge?: React.ReactNode
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="model-picker-item"
      className={cn(
        "relative flex cursor-default items-start gap-2 rounded-lg py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{title ?? children}</span>
          {badge && (
            <span className="shrink-0 rounded-full bg-muted px-1.5 py-px text-[0.6875rem] font-medium text-muted-foreground">
              {badge}
            </span>
          )}
        </span>
        {description && (
          <span className="text-xs leading-snug text-muted-foreground">{description}</span>
        )}
      </span>
      <span className="pointer-events-none absolute top-2 right-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  )
}

// A row of options inside the menu, such as effort: low, medium, high.
// Picking one keeps the menu open.
function ModelPickerSegments({
  value,
  onValueChange,
  options,
  label,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: React.ReactNode }[]
  label: string
}) {
  return (
    <div
      data-slot="model-picker-segments"
      role="radiogroup"
      aria-label={label}
      className={cn("flex gap-0.5 rounded-lg bg-muted p-0.5", className)}
      {...props}
    >
      {options.map((option) => (
        <DropdownMenuPrimitive.Item
          key={option.value}
          role="radio"
          aria-checked={option.value === value}
          data-checked={option.value === value || undefined}
          className="flex h-7 flex-1 cursor-default items-center justify-center rounded-md px-2 text-xs font-medium text-muted-foreground outline-hidden transition-colors select-none focus:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-checked:bg-background data-checked:text-foreground data-checked:shadow-xs"
          onSelect={(event) => {
            event.preventDefault()
            onValueChange(option.value)
          }}
        >
          {option.label}
        </DropdownMenuPrimitive.Item>
      ))}
    </div>
  )
}

export {
  ModelPicker,
  ModelPickerTrigger,
  ModelPickerValue,
  ModelPickerContent,
  ModelPickerGroup,
  ModelPickerLabel,
  ModelPickerSeparator,
  ModelPickerItem,
  ModelPickerSegments,
}
