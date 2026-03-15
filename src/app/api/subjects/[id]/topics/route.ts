import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { SubjectService } from '@/lib/services/SubjectService';
import { createTopicSchema } from '@/lib/validators/topicSchema';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify subject ownership
    const subject = await prisma.subject.findFirst({
      where: { id: params.id, userId: user.id }
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createTopicSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const subjectService = new SubjectService(prisma);
    const topic = await subjectService.createTopic(params.id, parsed.data);

    return NextResponse.json({ data: topic }, { status: 201 });
  } catch (error) {
    console.error('[TOPICS_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
