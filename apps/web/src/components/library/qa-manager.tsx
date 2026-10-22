"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type QaRow = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_preferred: boolean;
};

export function QaManager({ profileId }: { profileId: string | null }) {
  const [rows, setRows] = useState<QaRow[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [preferred, setPreferred] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const supabase = createClient();
    let q = supabase.from("prepared_qa").select("*").order("updated_at", { ascending: false });
    if (profileId) q = q.eq("profile_id", profileId);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setRows(data ?? []);
  }

  useEffect(() => {
    void load();
  }, [profileId]);

  async function create() {
    setLoading(true);
    const res = await fetch("/api/prepared-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId,
        question,
        answer,
        category: category || undefined,
        isPreferred: preferred,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error((await res.json()).error ?? "Failed");
      return;
    }
    toast.success("Saved and indexed");
    setQuestion("");
    setAnswer("");
    setCategory("");
    setPreferred(false);
    void load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/prepared-qa/${id}`, { method: "DELETE" });
    if (!res.ok) toast.error("Delete failed");
    else void load();
  }

  const filtered = rows.filter((r) => {
    const s = search.toLowerCase();
    if (!s) return true;
    return r.question.toLowerCase().includes(s) || r.answer.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border p-4">
          <h3 className="font-medium">Add prepared Q&amp;A</h3>
          <div className="space-y-2">
            <Label>Question</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="How do you prioritize…" />
          </div>
          <div className="space-y-2">
            <Label>Answer (authoritative)</Label>
            <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Behavioral, PM, …" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={preferred} onCheckedChange={setPreferred} id="pref" />
            <Label htmlFor="pref">Preferred / boost in matching</Label>
          </div>
          <Button disabled={loading || !question || !answer} onClick={() => void create()}>
            Save &amp; embed
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Search library</Label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions and answers" />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="max-w-md truncate">{r.question}</TableCell>
              <TableCell>{r.category ?? "—"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => void remove(r.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
