import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { date: "14 Oct", payee: "Rema 1000", category: "Groceries", amount: -412.5, status: "Cleared" },
  { date: "13 Oct", payee: "Ruter", category: "Transport", amount: -899, status: "Cleared" },
  { date: "12 Oct", payee: "Salary, Nyggis AS", category: "Income", amount: 42318.5, status: "Cleared" },
  { date: "11 Oct", payee: "Tim Wendelboe", category: "Eating out", amount: -96, status: "Pending" },
  { date: "10 Oct", payee: "Obos", category: "Housing", amount: -16500, status: "Cleared" },
]

const kr = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK" })

export const Transactions: Story = {
  render: () => (
    <div className="max-w-3xl rounded-xl border bg-card">
      <Table>
        <TableCaption>Transactions from the last five days.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payee</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.payee} data-state={r.payee === "Ruter" ? "selected" : undefined}>
              <TableCell>
                <Checkbox aria-label={`Select ${r.payee}`} defaultChecked={r.payee === "Ruter"} />
              </TableCell>
              <TableCell className="text-muted-foreground">{r.date}</TableCell>
              <TableCell className="font-medium">{r.payee}</TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>
                <Badge variant={r.status === "Pending" ? "warning" : "secondary"}>{r.status}</Badge>
              </TableCell>
              <TableCell
                className={`text-right tabular-nums ${r.amount > 0 ? "text-positive" : ""}`}
              >
                {kr.format(r.amount)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon-xs" aria-label="More">
                  <MoreHorizontalIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Net</TableCell>
            <TableCell className="text-right tabular-nums">
              {kr.format(rows.reduce((s, r) => s + r.amount, 0))}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}
