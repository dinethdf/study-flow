import { createClient } from '@/lib/supabase/server';
import { studentEmailSchema } from '@/lib/validators/emailSchema';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/services/AuthService';
import { UserType } from '@prisma/client';

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

        // Use standard signUp — for this to work WITHOUT email confirmation,
        // go to Supabase Dashboard → Authentication → Providers → Email
        // and disable "Confirm email"
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    user_type: userType,
                    institution: institution,
                },
            },
        });

        if (authError) {
            console.error('[REGISTER_ERROR]', authError.message);
            return Response.json({ error: authError.message }, { status: 400 });
        }

        // Sync user to Prisma database
        if (authData.user) {
            try {
                const authService = new AuthService(prisma, supabase);
                await authService.syncUser(
                    authData.user.id,
                    email,
                    name,
                    userType as UserType,
                    institution
                );
                console.log('[REGISTER] User synced to DB:', authData.user.id);
            } catch (dbError) {
                console.error('[REGISTER_DB_SYNC_ERROR]', dbError);
                // Don't fail registration if DB sync fails — user is at least in Supabase
            }
        }

        return Response.json({ success: true, userId: authData.user?.id });
    } catch (error) {
        console.error('[REGISTER_ERROR]', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
