import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const groups: { name: string; note: string; tokens: string[] }[] = [
  {
    name: "Surfaces",
    note: "The page, raised surfaces and quiet fills.",
    tokens: ["background", "card", "popover", "muted", "secondary", "accent"],
  },
  {
    name: "Ink",
    note: "Text and primary actions.",
    tokens: ["foreground", "muted-foreground", "primary", "primary-foreground"],
  },
  {
    name: "Lines",
    note: "Borders, input outlines and the focus ring.",
    tokens: ["border", "input", "ring"],
  },
  {
    name: "Cloudberry",
    note: "The only accent. Reserved for on and selected states.",
    tokens: ["highlight", "highlight-edge", "highlight-foreground"],
  },
  {
    name: "Status",
    note: "For messages and figures that carry meaning.",
    tokens: ["destructive", "positive", "warning", "info"],
  },
  {
    name: "Charts",
    note: "A categorical palette that holds up in both themes.",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
]

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-11 shrink-0 rounded-lg ring-1 ring-foreground/10"
        style={{ background: `var(--${token})` }}
      />
      <div className="min-w-0">
        <div className="text-sm font-medium">{token}</div>
        <code className="text-xs text-muted-foreground">--{token}</code>
      </div>
    </div>
  )
}

export const Colors: Story = {
  render: () => (
    <div className="flex max-w-4xl flex-col gap-10">
      {groups.map((group) => (
        <section key={group.name} className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <div>
            <h2 className="font-heading text-xl">{group.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{group.note}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-12">
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Libron, for titles</p>
        <p className="font-heading text-6xl leading-[1.05]">Some days left in October</p>
        <p className="font-heading text-3xl leading-tight">
          Rent, savings and the flat in Grünerløkka
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Libron, for the interface and reading</p>
        <p className="text-xl font-bold">Pull requests waiting on you</p>
        <p className="max-w-[62ch] text-base leading-relaxed">
          A serif with open counters and a calm rhythm, from @alexandernygard/libron. It sets
          everything: buttons, labels, menus, tables, body copy and long reading. It comes in
          regular, italic, bold and bold italic, so medium and semibold weights round to the
          nearest of those.
        </p>
        <p className="text-sm text-muted-foreground">
          Muted text for supporting detail, kept above 4.5:1 contrast in both themes.
        </p>
        <p className="text-3xl tabular-nums">kr 42 318,50</p>
      </section>
      <section className="grid gap-2">
        <p className="text-sm text-muted-foreground">Scale</p>
        {(
          [
            ["text-xs", "12px"],
            ["text-sm", "14px"],
            ["text-base", "16px"],
            ["text-lg", "18px"],
            ["text-xl", "20px"],
            ["text-2xl", "24px"],
            ["text-3xl", "30px"],
            ["text-4xl", "36px"],
          ] as const
        ).map(([cls, px]) => (
          <div key={cls} className="flex items-baseline gap-6 border-b py-1.5 last:border-0">
            <code className="w-20 shrink-0 text-xs text-muted-foreground">{px}</code>
            <span className={cls}>The quick brown fox</span>
          </div>
        ))}
      </section>
    </div>
  ),
}

export const RadiusAndElevation: Story = {
  name: "Radius and elevation",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-12">
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-xl">Radius grows with size</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Small things get tight corners and big surfaces get soft ones.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-6">
          {(
            [
              ["rounded-sm", "Checkbox", "size-10"],
              ["rounded-lg", "Button, input", "h-10 w-24"],
              ["rounded-xl", "Card", "h-24 w-32"],
              ["rounded-2xl", "Dialog", "h-32 w-40"],
              ["rounded-full", "Badge, switch", "h-8 w-20"],
            ] as const
          ).map(([cls, label, size]) => (
            <div key={cls} className="flex flex-col gap-2">
              <div className={`${cls} ${size} border-2 border-foreground/70 bg-card`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-xl">Elevation</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Shadows are tinted with the ink colour and layered, so raised surfaces read as lifted
            rather than smudged.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"].map((s) => (
            <div key={s} className="flex flex-col gap-2">
              <div className={`h-20 rounded-xl bg-card ${s}`} />
              <code className="text-xs text-muted-foreground">{s}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
