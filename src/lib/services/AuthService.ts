import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

export class AuthService {
    private prisma: PrismaClient;
    private supabase: SupabaseClient;

    constructor(prisma: PrismaClient, supabase: SupabaseClient) {
        this.prisma = prisma;
        this.supabase = supabase;
    }

    async syncUser(userId: string, email: string, name?: string) {
        return await this.prisma.user.upsert({
            where: { id: userId },
            update: { email, name },
            create: {
                id: userId,
                email,
                name,
            },
        });
    }

    async getUser(userId: string) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subjects: true,
            },
        });
    }
}
