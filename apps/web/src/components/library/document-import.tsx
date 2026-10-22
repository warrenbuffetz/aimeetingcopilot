"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function DocumentImport({ profileId }: { profileId: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("prep");
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    if (profileId) form.append("profileId", profileId);
    form.append("docType", docType);
    const res = await fetch("/api/documents/import", { method: "POST", body: form });
    setLoading(false);
    if (!res.ok) {
      toast.error((await res.json()).error ?? "Import failed");
      return;
    }
    const data = await res.json();
    toast.success(`Imported ${data.chunks} chunks`);
    setFile(null);
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <h3 className="font-medium">Import documents</h3>
      <p className="text-sm text-muted-foreground">TXT, Markdown, or PDF — chunked and embedded for semantic search.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Document type</Label>
          <Select value={docType} onValueChange={(v) => v && setDocType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prep">Prep notes</SelectItem>
              <SelectItem value="resume">Resume</SelectItem>
              <SelectItem value="job_description">Job description</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>File</Label>
          <Input
            type="file"
            accept=".txt,.md,.markdown,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      <Button disabled={!file || loading} onClick={() => void upload()}>Upload &amp; index</Button>
    </div>
  );
}
