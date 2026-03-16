import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubjectService } from '@/lib/services/SubjectService';
import { updateTopicSchema } from '@/lib/validators/topicSchema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, topicId: string }> }
) {
  try {
    const { id, topicId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify subject ownership
    const subject = await prisma.subject.findFirst({
      where: { id: id, userId: user.id }
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateTopicSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const subjectService = new SubjectService(prisma);
    const topic = await subjectService.updateTopic(topicId, id, parsed.data);

    return NextResponse.json({ data: topic });
  } catch (error) {
    console.error('[TOPIC_PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, topicId: string }> }
) {
  try {
    const { id, topicId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify subject ownership
    const subject = await prisma.subject.findFirst({
      where: { id: id, userId: user.id }
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const subjectService = new SubjectService(prisma);
    await subjectService.deleteTopic(topicId, id);

    return NextResponse.json({ data: null }, { status: 204 });
  } catch (error) {
    console.error('[TOPIC_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
