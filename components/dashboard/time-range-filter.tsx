"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimeRange = "today" | "week" | "month" | "quarter" | "year" | "all"

const timeRanges = [
  { value: "today" as TimeRange, label: "اليوم" },
  { value: "week" as TimeRange, label: "هذا الأسبوع" },
  { value: "month" as TimeRange, label: "هذا الشهر" },
  { value: "quarter" as TimeRange, label: "آخر 3 أشهر" },
  { value: "year" as TimeRange, label: "العام الحالي" },
  { value: "all" as TimeRange, label: "كل الوقت" },
]

interface TimeRangeFilterProps {
  onChange?: (range: TimeRange) => void
}

export function TimeRangeFilter({ onChange }: TimeRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("month")

  const handleChange = (value: TimeRange) => {
    setSelectedRange(value)
    onChange?.(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedRange}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="اختر النطاق الزمني" />
        </SelectTrigger>
        <SelectContent>
          {timeRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
