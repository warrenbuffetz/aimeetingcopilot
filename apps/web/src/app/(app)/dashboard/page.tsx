import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: qa }, { count: stories }, { count: profiles }] = await Promise.all([
    supabase.from("prepared_qa").select("*", { count: "exact", head: true }),
    supabase.from("experience_stories").select("*", { count: "exact", head: true }),
    supabase.from("interview_profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Build your library before going live.</p>
        </div>
        <Button render={<Link href="/live" />}>Start live session</Button>
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
        <Button variant="outline" render={<Link href="/library" />}>Manage answer library</Button>
        <Button variant="outline" render={<Link href="/profiles" />}>Interview profiles</Button>
      </div>
    </div>
  );
}
