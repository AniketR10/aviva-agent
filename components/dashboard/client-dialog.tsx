'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, FilePlus } from "lucide-react"
import { useState } from "react"
import { importNewClient } from "@/app/actions"
import { toast } from "sonner"

export function ImportClientDialog() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    
    const result = await importNewClient(formData);
    
    setUploading(false);
    
    if (result.success) {
      setOpen(false);
      toast.success("Client imported successfully");
    } else {
      alert("Failed to import client.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <FilePlus className="w-4 h-4 mr-2" />
          Import Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import New Client</DialogTitle>
          <DialogDescription>
            Upload the client file. The Agent will extract personal details, financial goals, and risk factors automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label htmlFor="client-file">Client File</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="client-file" 
              type="file" 
              accept=".txt" 
              onChange={handleUpload}
              disabled={uploading} 
            />
            {uploading && <Loader2 className="w-4 h-4 animate-spin text-slate-500" />}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Supported formats: .txt (Plain Text)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}