import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">Welcome to StudyFlow</h1>
            <p className="mt-4 text-xl text-muted-foreground">
                Hello, {user.email}! You have successfully authenticated.
            </p>
            <div className="mt-8">
                <p>Phase 2 (Auth) is now ready for testing.</p>
            </div>
        </div>
    );
}
