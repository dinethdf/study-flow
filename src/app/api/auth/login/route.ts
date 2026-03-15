import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
}
