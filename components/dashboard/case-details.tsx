'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Case, LogEntry } from "@/lib/types"
import { formatDistance } from "date-fns"
import { Bot, User, Building2, FileText } from "lucide-react"

interface CaseDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case | null
  virtualDate: string
}

export function CaseDetailsDialog({ isOpen, onClose, caseData, virtualDate }: CaseDetailsDialogProps) {
  if (!caseData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center mr-8">
            <DialogTitle className="text-xl">{caseData.clientName}</DialogTitle>
            <Badge variant="outline">{caseData.policyNumber}</Badge>
          </div>
          <DialogDescription>
            Provider: <span className="font-semibold text-slate-700">{caseData.providerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Activity Timeline</h3>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {[...caseData.history].reverse().map((log) => (
              <TimelineItem key={log.id} log={log} virtualDate={virtualDate} />
            ))}
            
            <div className="flex gap-4 opacity-50">
              <div className="w-8 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
              </div>
              <div className="pb-4">
                <p className="text-sm text-slate-500">Case Created</p>
                <p className="text-xs text-slate-400">
                  {formatDistance(new Date(caseData.dateCreated), new Date(virtualDate))} ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TimelineItem({ log, virtualDate }: { log: LogEntry, virtualDate: string }) {
  const isAgent = log.actor === 'Agent';
  
  return (
    <div className="flex gap-4 group">
      <div className="w-8 flex flex-col items-center">
        <div className={`p-2 rounded-full ${isAgent ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {getIcon(log.actor)}
        </div>
        <div className="w-0.5 grow bg-slate-100 mt-2 group-last:hidden" />
      </div>

      <div className="pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-semibold ${isAgent ? 'text-indigo-700' : 'text-slate-900'}`}>
            {log.actor}
          </span>
          <span className="text-xs text-slate-400">
            {formatDistance(new Date(log.date), new Date(virtualDate))} ago
          </span>
        </div>
        <p className={`text-sm ${isAgent ? 'text-indigo-900 bg-indigo-50 p-2 rounded-md border border-indigo-100' : 'text-slate-600'}`}>
          {log.action}
        </p>
      </div>
    </div>
  )
}

function getIcon(actor: string) {
  switch (actor) {
    case 'Agent': return <Bot className="w-4 h-4" />
    case 'Client': return <User className="w-4 h-4" />
    case 'Provider': return <Building2 className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}