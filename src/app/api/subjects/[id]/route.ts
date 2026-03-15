import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubjectService } from '@/lib/services/SubjectService';
import { updateSubjectSchema } from '@/lib/validators/subjectSchema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSubjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const subjectService = new SubjectService(prisma);
    const subject = await subjectService.updateSubject(user.id, params.id, parsed.data);

    return NextResponse.json({ data: subject });
  } catch (error) {
    console.error('[SUBJECT_PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjectService = new SubjectService(prisma);
    await subjectService.deleteSubject(user.id, params.id);

    return NextResponse.json({ data: null }, { status: 204 });
  } catch (error) {
    console.error('[SUBJECT_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
