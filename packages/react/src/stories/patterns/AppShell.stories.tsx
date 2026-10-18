import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  PiggyBankIcon,
  PlusIcon,
  ReceiptIcon,
  SettingsIcon,
  SparklesIcon,
  WalletIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meta = {
  title: "Patterns/App shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const nav = [
  { label: "Overview", icon: HomeIcon, active: true },
  { label: "Transactions", icon: ReceiptIcon, badge: "12" },
  { label: "Budgets", icon: WalletIcon },
  { label: "Savings plan", icon: PiggyBankIcon },
  { label: "Assistant", icon: SparklesIcon },
]

const budgets = [
  { name: "Groceries", spent: 4300, limit: 6000 },
  { name: "Transport", spent: 900, limit: 1200 },
  { name: "Eating out", spent: 1380, limit: 1500 },
]

const weekly = [
  { week: "W38", spent: 3100 },
  { week: "W39", spent: 2400 },
  { week: "W40", spent: 3900 },
  { week: "W41", spent: 2100 },
  { week: "W42", spent: 2700 },
]

const chartConfig = { spent: { label: "Spent", color: "var(--chart-1)" } } satisfies ChartConfig
const kr = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 })

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-base text-primary-foreground">
                l
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="font-medium">Lommebok</span>
                <span className="text-xs text-muted-foreground">Household</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add account">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {["Everyday", "Savings", "Credit card"].map((a) => (
                <SidebarMenuItem key={a}>
                  <SidebarMenuButton>
                    <span>{a}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar size="sm">
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="font-medium">Alexander</span>
                <span className="text-xs text-muted-foreground">alex@nyggis.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export const Dashboard: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4!" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex gap-2">
            <Tabs defaultValue="month">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              Add transaction
            </Button>
          </div>
        </header>
        <main className="grid gap-6 p-6">
          <div>
            <h1 className="font-heading text-3xl">October</h1>
            <p className="text-sm text-muted-foreground">13 days left. You're kr 2 140 under budget.</p>
          </div>
          <div className="grid divide-y rounded-xl border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["Income", "kr 42 319", "+2.1%", true],
              ["Spent", "kr 23 478", "−6.4%", true],
              ["Saved", "kr 18 841", "+12%", true],
            ].map(([label, value, delta]) => (
              <div key={label as string} className="grid gap-1 p-4">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-2xl font-medium tabular-nums">{value}</span>
                <span className="flex items-center gap-1 text-xs text-positive">
                  {(delta as string).startsWith("−") ? (
                    <ArrowDownRightIcon className="size-3.5" />
                  ) : (
                    <ArrowUpRightIcon className="size-3.5" />
                  )}
                  {delta} from September
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <Card>
              <CardHeader>
                <CardTitle>Weekly spending</CardTitle>
                <CardDescription>Last five weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-52 w-full">
                  <BarChart data={weekly} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="spent" fill="var(--color-spent)" radius={6} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Budgets</CardTitle>
                <CardDescription>This month</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-5">
                {budgets.map((b) => {
                  const pct = Math.round((b.spent / b.limit) * 100)
                  return (
                    <div key={b.name} className="grid gap-2">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium">{b.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {kr.format(b.spent)} of {kr.format(b.limit)}
                        </span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent transactions</CardTitle>
              <CardAction>
                <Button variant="outline" size="sm">
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {[
                    ["Rema 1000", "Groceries", -412.5, "Today"],
                    ["Ruter", "Transport", -899, "Yesterday"],
                    ["Salary, Nyggis AS", "Income", 42318.5, "12 Oct"],
                  ].map(([payee, cat, amt, when]) => (
                    <TableRow key={payee as string}>
                      <TableCell className="font-medium">{payee}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{cat}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{when}</TableCell>
                      <TableCell
                        className={`text-right tabular-nums ${(amt as number) > 0 ? "text-positive" : ""}`}
                      >
                        {kr.format(amt as number)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
}
