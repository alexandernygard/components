import type { Meta, StoryObj } from "@storybook/react-vite"
import { AtSignIcon, EyeOffIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Switch } from "@/components/ui/switch"

const meta = {
  title: "Components/Field",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Fields: Story = {
  render: () => (
    <FieldSet className="max-w-md">
      <FieldLegend>Profile</FieldLegend>
      <FieldDescription>Shown on invoices and shared budgets.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="f-name">Full name</FieldLabel>
          <Input id="f-name" defaultValue="Alexander Nygård" />
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="f-email">Email</FieldLabel>
          <Input id="f-email" defaultValue="alex@" aria-invalid />
          <FieldError>Enter a full email address, like name@example.com.</FieldError>
        </Field>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Checkbox id="f-weekly" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="f-weekly">Weekly summary</FieldLabel>
            <FieldDescription>An email every Monday with last week's spending.</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Round amounts</FieldTitle>
            <FieldDescription>Show whole kroner in lists and charts.</FieldDescription>
          </FieldContent>
          <Switch defaultChecked aria-label="Round amounts" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const InputGroups: Story = {
  name: "Input group",
  render: () => (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="ig-search">Search</FieldLabel>
        <InputGroup>
          <InputGroupInput id="ig-search" placeholder="Payee, category or note" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>312 results</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="ig-handle">GitHub username</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <AtSignIcon />
          </InputGroupAddon>
          <InputGroupInput id="ig-handle" defaultValue="alexandernygard" />
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="ig-token">Access token</FieldLabel>
        <InputGroup>
          <InputGroupInput id="ig-token" type="password" defaultValue="placeholder-value" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Show token">
              <EyeOffIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="ig-amount">Amount</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>kr</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-amount" defaultValue="9 500" inputMode="numeric" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>per month</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="ig-ask">Ask about your spending</FieldLabel>
        <InputGroup>
          <InputGroupTextarea id="ig-ask" placeholder="How much did I spend on coffee in September?" />
          <InputGroupAddon align="block-end">
            <InputGroupText>Answers use your last 12 months</InputGroupText>
            <InputGroupButton variant="default" size="sm" className="ml-auto">
              Ask
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  ),
}

export const ButtonGroups: Story = {
  name: "Button group",
  render: () => (
    <div className="grid gap-4">
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>Export</ButtonGroupText>
        <Button variant="outline">CSV</Button>
        <Button variant="outline">PDF</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Merge pull request</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More merge options">
          ⌄
        </Button>
      </ButtonGroup>
    </div>
  ),
}

export const OneTimeCode: Story = {
  name: "One-time code",
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="otp">Verification code</FieldLabel>
      <InputOTP id="otp" maxLength={6} defaultValue="4821">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <FieldDescription>We sent it to alex@nyggis.com.</FieldDescription>
    </Field>
  ),
}
