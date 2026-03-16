import { PrismaClient } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

export class AuthService {
    private prisma: PrismaClient;
    private supabase: SupabaseClient;

    constructor(prisma: PrismaClient, supabase: SupabaseClient) {
        this.prisma = prisma;
        this.supabase = supabase;
    }

    async syncUser(userId: string, email: string, name?: string, userType?: 'SCHOOL' | 'UNIVERSITY', institution?: string) {
        return await this.prisma.user.upsert({
            where: { id: userId },
            update: { email, name, userType, institution },
            create: {
                id: userId,
                email,
                name,
                userType,
                institution,
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
