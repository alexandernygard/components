import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { Toaster, toast } from "@/components/ui/sonner"

const meta = {
  title: "Components/Questionnaire",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { name: "goal", required: true, choices: [{ value: "buy" }, { value: "rent" }, { value: "unsure" }] },
  { name: "costs", choices: [{ value: "fees" }, { value: "maintenance" }, { value: "insurance" }] },
  { name: "horizon", required: true, choices: [{ value: "2" }, { value: "5" }, { value: "10" }] },
] as const

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  toast.success("Answers saved", { description: `Goal: ${data.get("goal")}, horizon: ${data.get("horizon")} years` })
}

export const Planning: Story = {
  render: () => (
    <>
      <Questionnaire
        className="mx-auto max-w-lg"
        defaultItem="goal"
        items={items}
        shortcuts="letters"
        onSubmit={handleSubmit}
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="goal" required>
          <QuestionnaireTitle>What are you planning for?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick one, or describe it in your own words.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="buy">
              <span className="font-medium">Buying a flat</span>
              <QuestionnaireChoiceDescription>Model a deposit, mortgage and monthly costs.</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="rent">
              <span className="font-medium">Renting for now</span>
              <QuestionnaireChoiceDescription>Track rent and build savings on the side.</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="unsure">
              <span className="font-medium">Not sure yet</span>
              <QuestionnaireChoiceDescription>Compare both side by side.</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireInput aria-label="Something else" placeholder="Something else…" />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="costs" multiple>
          <QuestionnaireTitle>Which costs should the plan include?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick any, or skip this question.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="fees">Shared costs (felleskostnader)</QuestionnaireChoice>
            <QuestionnaireChoice value="maintenance">Maintenance</QuestionnaireChoice>
            <QuestionnaireChoice value="insurance">Insurance</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="horizon" required>
          <QuestionnaireTitle>How far ahead should we plan?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="2">2 years</QuestionnaireChoice>
            <QuestionnaireChoice value="5">5 years</QuestionnaireChoice>
            <QuestionnaireChoice value="10">10 years</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions className="w-full">
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext>Next</QuestionnaireNext>
          <QuestionnaireSubmit>Build plan</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
      <Toaster />
    </>
  ),
}
