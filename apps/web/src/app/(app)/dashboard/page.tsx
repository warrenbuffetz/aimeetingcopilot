import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: qa }, { count: stories }, { count: profiles }, { data: profileRows }] = await Promise.all([
    supabase.from("prepared_qa").select("*", { count: "exact", head: true }),
    supabase.from("experience_stories").select("*", { count: "exact", head: true }),
    supabase.from("interview_profiles").select("*", { count: "exact", head: true }),
    supabase.from("interview_profiles").select("id, name, employer, role_title, updated_at").order("updated_at", { ascending: false }),
  ]);

  const profileQaCounts: { id: string; name: string; count: number }[] = [];
  if (profileRows?.length) {
    for (const p of profileRows) {
      const { count } = await supabase
        .from("prepared_qa")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", p.id);
      profileQaCounts.push({ id: p.id, name: p.name, count: count ?? 0 });
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Build your library before going live.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/live" />}>Start live session</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prepared Q&amp;A</CardDescription>
            <CardTitle className="text-3xl">{qa ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Experience stories</CardDescription>
            <CardTitle className="text-3xl">{stories ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interview profiles</CardDescription>
            <CardTitle className="text-3xl">{profiles ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {profileQaCounts.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Library by profile</CardTitle>
            <CardDescription>Prepared Q&amp;A scoped per interview context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {profileQaCounts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <Badge variant="secondary">{p.count} Q&amp;A</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How retrieval works</CardTitle>
          <CardDescription>
            Spoken questions are embedded and matched against your library. Strong matches return
            verbatim prepared answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">PREPARED — verbatim</Badge>
          <Badge variant="secondary">ADAPTED — your story</Badge>
          <Badge variant="outline">GENERATED — grounded guidance</Badge>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" nativeButton={false} render={<Link href="/library" />}>
          Manage answer library
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/profiles" />}>
          Interview profiles
        </Button>
      </div>
    </div>
  );
}
