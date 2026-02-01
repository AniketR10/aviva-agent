'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Case, LogEntry } from "@/lib/types" 
import { formatDistance } from "date-fns"
import { 
  Bot, User, Building2, FileText, PhoneCall, Sparkles, Copy, 
  UploadCloud, Loader2, AlertTriangle, Target, Wallet 
} from "lucide-react"
import { useState } from "react"
import { generateCallScript, uploadProviderDocument } from "@/app/actions"

interface CaseDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  caseData: Case | null
  virtualDate: string
}

export function CaseDetailsDialog({ isOpen, onClose, caseData, virtualDate }: CaseDetailsDialogProps) {
  const [script, setScript] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!caseData && script) setScript(null)

  const handleGenerateScript = async () => {
    if (!caseData) return;
    setLoading(true);
    const result = await generateCallScript(caseData.id);
    setScript(result);
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !caseData) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('caseId', caseData.id);
    formData.append('file', e.target.files[0]);
    const result = await uploadProviderDocument(formData);
    setUploading(false);
    if (result.success && result.script) setScript(result.script);
  };

  if (!caseData) return null

  const hasContext = caseData.clientContext && (
    caseData.clientContext.risks?.length || 
    caseData.clientContext.goals?.length || 
    caseData.clientContext.netWorth
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) setScript(null);
      onClose();
    }}>
      <DialogContent className="max-w-[95vw]! w-[95vw] h-[92vh] flex flex-col overflow-hidden font-sans p-0 gap-0 outline-none">
        
        <div className="p-6 border-b border-slate-100 bg-white shrink-0 pr-16">
            <DialogHeader className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                <DialogTitle className="text-2xl uppercase tracking-tight font-bold text-slate-900">
                    {caseData.clientName}
                </DialogTitle>
                <Badge variant="outline" className="font-mono text-sm px-2.5 py-0.5 bg-slate-50 border-slate-200 text-slate-600">
                    {caseData.policyNumber}
                </Badge>
                </div>
                {caseData.urgency === 'high' && (
                <Badge variant="destructive" className="uppercase tracking-widest text-xs px-3 py-1 shadow-sm">
                    High Urgency
                </Badge>
                )}
            </div>
            <DialogDescription className="text-slate-500 text-base flex items-center gap-2">
                Provider: <span className="font-semibold text-slate-700">{caseData.providerName}</span>
            </DialogDescription>
            </DialogHeader>
        </div>

        <div className="grid grid-cols-12 flex-1 overflow-hidden min-h-0 bg-slate-50/50">
          
          <div className="col-span-3 overflow-y-auto border-r border-slate-200 h-full bg-white custom-scrollbar flex flex-col">
            <div className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 sticky top-0 bg-white z-10">
                Activity Timeline
                </h3>
                <div className="space-y-8 pb-4">
                {[...caseData.history].reverse().map((log) => (
                    <TimelineItem key={log.id} log={log} virtualDate={virtualDate} />
                ))}
                
                <div className="flex gap-4 opacity-50 px-1">
                    <div className="w-8 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                    </div>
                    <div>
                    <p className="text-sm text-slate-500">Case Created</p>
                    <p className="text-xs text-slate-400">
                        {formatDistance(new Date(caseData.dateCreated), new Date(virtualDate))} ago
                    </p>
                    </div>
                </div>
                </div>
            </div>
          </div>

          <div className="col-span-9 flex flex-col h-full overflow-hidden p-6 gap-4"> 
            
            {hasContext && (
              <div className="bg-white rounded-xl p-5 border border-slate-200 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Client Intelligence
                </h3>
                
                <div className="grid grid-cols-3 gap-6">
                  {caseData.clientContext?.risks && caseData.clientContext.risks.length > 0 && (
                    <div className="bg-red-50/40 p-4 rounded-lg border border-red-100/50 h-full">
                      <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5" /> Identified Risks
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-800 space-y-2">
                        {caseData.clientContext.risks.map((risk, i) => (
                          <li key={i} className="leading-snug">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {caseData.clientContext?.goals && (
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 h-full">
                      <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                        <Target className="w-3.5 h-3.5" /> Goals
                      </p>
                      <ul className="text-sm text-slate-700 space-y-2">
                        {caseData.clientContext.goals.slice(0,4).map((g, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-slate-300 shrink-0">•</span> 
                            <span className="leading-snug">{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {caseData.clientContext?.netWorth && (
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 h-full">
                      <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                        <Wallet className="w-3.5 h-3.5" /> Financial Summary
                      </p>
                      <div className="space-y-4">
                         <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Net Worth</p>
                            <p className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                              {caseData.clientContext.netWorth}
                            </p>
                         </div>
                         {caseData.clientContext.incomeSummary && (
                            <div>
                               <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Household Inc</p>
                               <p className="text-sm font-medium text-slate-700 leading-none">
                                 {caseData.clientContext.incomeSummary}
                               </p>
                            </div>
                         )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-6 flex-1 min-h-0">
               
               <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Agent Recommended Actions
                    </h3>
                    {script && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigator.clipboard.writeText(script)}>
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Copy
                        </Button>
                    )}
                  </div>
                  
                  {script ? (
                    <div className="flex-1 min-h-0 p-6 text-sm whitespace-pre-wrap font-mono overflow-y-auto custom-scrollbar text-slate-800 bg-indigo-50/10 leading-relaxed">
                      {script}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                        <Bot className="w-5 h-5 text-indigo-600" />
                      </div>
                      <p className="text-sm text-slate-900 mb-1 font-medium">
                        {caseData.urgency === 'high' ? 'High Urgency Action Plan' : 'Routine Check Recommended'}
                      </p>
                      <p className="text-xs text-slate-500 mb-4 max-w-sm leading-relaxed px-4">
                        {hasContext 
                          ? "Agent has analyzed client goals and risks to tailor the chase script." 
                          : "Generate a chase script based on timeline delays."}
                      </p>
                      <Button onClick={handleGenerateScript} disabled={loading} size="default" className="bg-indigo-600 hover:bg-indigo-700 w-full max-w-xs shadow-md shadow-indigo-100/50">
                        {loading ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <PhoneCall className="w-4 h-4 mr-2" />}
                        Generate Smart Script
                      </Button>
                    </div>
                  )}
               </div>

               <div className="w-80 shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 shrink-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Input Data
                    </h3>
                  </div>
                  <div className="flex-1 p-4">
                    <Label htmlFor="doc-upload" className="cursor-pointer block w-full h-full">
                        <div className="h-full border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center text-center p-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> : <UploadCloud className="w-5 h-5 text-indigo-600" />}
                            </div>
                            <span className="font-semibold text-sm text-slate-900 block mb-1">
                                {uploading ? "Analyzing..." : "Upload Response"}
                            </span>
                            <span className="text-xs text-slate-400 block px-2 leading-relaxed">
                                Drag provider letters or emails here.
                            </span>
                            <Input 
                                id="doc-upload" 
                                type="file" 
                                className="hidden" 
                                accept=".txt,.pdf,.docx" 
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </div>
                    </Label>
                  </div>
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
      <div className="w-8 flex flex-col items-center shrink-0">
        <div className={`p-2 rounded-full ${isAgent ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-50' : 'bg-slate-100 text-slate-500'}`}>
          {getIcon(log.actor)}
        </div>
        <div className="w-0.5 grow bg-slate-200 mt-2 group-last:hidden min-h-5" />
      </div>
      <div className="pb-2 w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-semibold ${isAgent ? 'text-indigo-700' : 'text-slate-900'}`}>
            {log.actor}
          </span>
          <span className="text-xs text-slate-400">
            {formatDistance(new Date(log.date), new Date(virtualDate))} ago
          </span>
        </div>
        <div className={`text-sm leading-relaxed ${isAgent ? 'text-indigo-900 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100' : 'text-slate-600'}`}>
          {log.action}
        </div>
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