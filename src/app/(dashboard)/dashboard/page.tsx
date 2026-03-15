import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch basic stats from Prisma
  const subjectsCount = await prisma.subject.count({
    where: { userId: user.id }
  });

  const examsCount = await prisma.examDate.count({
    where: { userId: user.id, isCompleted: false }
  });

  const recentSessions = await prisma.scheduleSession.findMany({
    where: {
      schedule: { userId: user.id },
      isCompleted: false,
    },
    take: 3,
    orderBy: { date: 'asc' },
    include: { subject: true }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your academic progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Subjects', value: subjectsCount, icon: BookOpen, color: 'text-blue-500' },
          { title: 'Upcoming Exams', value: examsCount, icon: CalendarCheck, color: 'text-orange-500' },
          { title: 'Topics Completed', value: '12', icon: CheckCircle2, color: 'text-green-500' },
          { title: 'Study Time Today', value: '2h 15m', icon: Clock, color: 'text-purple-500' },
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
            {/* Logic for subjects would go here, using static placeholder for now if no subjects */}
            {subjectsCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">No subjects added yet</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/subjects">Add your first subject</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dynamically render subjects when available */}
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
            <div className="space-y-4">
              {recentSessions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No sessions scheduled</p>
                  <Button asChild variant="link" size="sm" className="mt-2">
                    <Link href="/schedule">Generate a plan</Link>
                  </Button>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-muted/40">
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: session.subject.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{session.subject.name}</p>
                      <p className="text-xs text-muted-foreground">{session.startTime} • {session.durationMinutes} mins</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function locally since utils.ts might not be available yet in some contexts
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
