import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubjectService } from '@/lib/services/SubjectService';
import { createSubjectSchema } from '@/lib/validators/subjectSchema';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjectService = new SubjectService(prisma);
    const subjects = await subjectService.getSubjects(user.id);

    return NextResponse.json({ data: subjects });
  } catch (error) {
    console.error('[SUBJECTS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSubjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const subjectService = new SubjectService(prisma);
    const subject = await subjectService.createSubject(user.id, parsed.data);

    return NextResponse.json({ data: subject }, { status: 201 });
  } catch (error) {
    console.error('[SUBJECTS_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
