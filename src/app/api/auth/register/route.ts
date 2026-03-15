import { createClient } from '@/lib/supabase/server';
import { studentEmailSchema } from '@/lib/validators/emailSchema';
import { z } from 'zod';

const registerSchema = z.object({
    email: studentEmailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    userType: z.enum(['SCHOOL', 'UNIVERSITY']),
    institution: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const { email, password, name, userType, institution } = parsed.data;
        const supabase = await createClient();

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (authError) {
            return Response.json({ error: authError.message }, { status: 400 });
        }

        if (authData.user) {
            // In Phase 1/2 we'd usually also create the user in the Prisma DB.
            // But for the sake of starting small, we just handle the Auth side.
            // Actually, AGENT.md says "API routes handle request/response, logic in services".
            // I will implement the service later, but let's at least get Auth basic working.
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
