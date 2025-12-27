"use client"

import { Badge } from "@/components/ui/badge"
import { FileText, LogIn, LogOut, Edit, Trash, Plus } from "lucide-react"
import { useHydration } from "@/hooks/use-hydration"

type ActivityLog = {
  id: number
  user_id: string
  user_name: string | null
  user_email: string
  action: string
  resource_type: string | null
  resource_id: string | null
  details: string | null
  created_at: Date
}

function getActionIcon(action: string) {
  switch (action) {
    case "CREATE":
      return <Plus className="h-4 w-4 text-green-600" />
    case "UPDATE":
      return <Edit className="h-4 w-4 text-blue-600" />
    case "DELETE":
      return <Trash className="h-4 w-4 text-red-600" />
    case "LOGIN":
      return <LogIn className="h-4 w-4 text-primary" />
    case "LOGOUT":
      return <LogOut className="h-4 w-4 text-muted-foreground" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "CREATE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "UPDATE":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "DELETE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "LOGIN":
      return "bg-primary/10 text-primary"
    case "LOGOUT":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

export function ActivityLogsList({ logs }: { logs: ActivityLog[] }) {
  const isClient = useHydration()

  if (!logs || logs.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No activity logs yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
          <div className="mt-1">{getActionIcon(log.action)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getActionColor(log.action)}>
                {log.action}
              </Badge>
              {log.resource_type && <span className="text-xs text-muted-foreground">{log.resource_type}</span>}
            </div>
            <div className="text-sm">
              <span className="font-medium">{log.user_name || log.user_email}</span>
              {log.details && <span className="text-muted-foreground"> - {log.details}</span>}
            </div>
            <div className="text-xs text-muted-foreground">
              {isClient && new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
