"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { QaManager } from "@/components/library/qa-manager";
import { DocumentImport } from "@/components/library/document-import";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function LibraryPage() {
  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("interview_profiles").select("id, name").order("name");
      setProfiles(data ?? []);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Answer library</h1>
        <p className="text-muted-foreground">Prepared answers are returned verbatim when matched.</p>
      </div>

      <div className="max-w-sm space-y-2">
        <Label>Scope to profile (optional)</Label>
        <Select
          value={profileId ?? "all"}
          onValueChange={(v) => setProfileId(v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All profiles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All profiles</SelectItem>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DocumentImport profileId={profileId} />
      <QaManager profileId={profileId} />
    </div>
  );
}
