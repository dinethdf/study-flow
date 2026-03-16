import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch stats with error handling for DB connection issues
  let subjectsCount = 0;
  let examsCount = 0;
  let dbConnected = true;

  try {
    subjectsCount = await prisma.subject.count({
      where: { userId: user.id }
    });

    examsCount = await prisma.examDate.count({
      where: { userId: user.id, isCompleted: false }
    });
  } catch (error) {
    console.error('[DASHBOARD_DB_ERROR]', error);
    dbConnected = false;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.user_metadata?.full_name || 'Student'}! Here&apos;s an overview of your academic progress.
        </p>
      </div>

      {!dbConnected && (
        <div className="p-4 rounded-lg border border-orange-300 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
          <p className="text-sm font-medium">⚠️ Database connection issue — some stats may be unavailable. Your Supabase database may be paused or unreachable.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Subjects', value: subjectsCount, icon: BookOpen, color: 'text-blue-500' },
          { title: 'Upcoming Exams', value: examsCount, icon: CalendarCheck, color: 'text-orange-500' },
          { title: 'Topics Completed', value: '—', icon: CheckCircle2, color: 'text-green-500' },
          { title: 'Study Time Today', value: '—', icon: Clock, color: 'text-purple-500' },
        ].map((stat) => (
          <Card key={stat.title} className="shadow-sm border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn('h-4 w-4', stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-muted/60">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your current completion percentage per subject</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjectsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">No subjects added yet</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/subjects">Add your first subject</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Subjects progress will render dynamically */}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-muted/60">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your next scheduled study blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No sessions scheduled</p>
              <Button asChild variant="link" size="sm" className="mt-2">
                <Link href="/schedule">Generate a plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
