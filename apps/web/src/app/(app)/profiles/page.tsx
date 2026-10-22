"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Profile = {
  id: string;
  name: string;
  employer: string | null;
  role_title: string | null;
  job_description: string | null;
  resume_text: string | null;
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [employer, setEmployer] = useState("");
  const [role, setRole] = useState("");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("interview_profiles").select("*").order("updated_at", { ascending: false });
    setProfiles(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createProfile() {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { error } = await supabase.from("interview_profiles").insert({
      user_id: user.user.id,
      name,
      employer: employer || null,
      role_title: role || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Profile created");
      setName("");
      setEmployer("");
      setRole("");
      void load();
    }
  }

  async function save(p: Profile) {
    const supabase = createClient();
    const { error } = await supabase
      .from("interview_profiles")
      .update({
        name: p.name,
        employer: p.employer,
        role_title: p.role_title,
        job_description: p.job_description,
        resume_text: p.resume_text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interview profiles</h1>
        <p className="text-muted-foreground">Separate employers, roles, resumes, and job descriptions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Profile name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Employer" value={employer} onChange={(e) => setEmployer(e.target.value)} />
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button className="sm:col-span-3" disabled={!name} onClick={() => void createProfile()}>
            Create
          </Button>
        </CardContent>
      </Card>

      {profiles.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="text-base">{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Employer</Label>
                <Input
                  value={p.employer ?? ""}
                  onChange={(e) => setProfiles((all) => all.map((x) => (x.id === p.id ? { ...x, employer: e.target.value } : x)))}
                />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Input
                  value={p.role_title ?? ""}
                  onChange={(e) => setProfiles((all) => all.map((x) => (x.id === p.id ? { ...x, role_title: e.target.value } : x)))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Job description</Label>
              <Textarea
                rows={4}
                value={p.job_description ?? ""}
                onChange={(e) =>
                  setProfiles((all) => all.map((x) => (x.id === p.id ? { ...x, job_description: e.target.value } : x)))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Resume text</Label>
              <Textarea
                rows={4}
                value={p.resume_text ?? ""}
                onChange={(e) =>
                  setProfiles((all) => all.map((x) => (x.id === p.id ? { ...x, resume_text: e.target.value } : x)))
                }
              />
            </div>
            <Button variant="secondary" onClick={() => void save(p)}>Save profile</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
