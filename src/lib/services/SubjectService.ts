import { PrismaClient } from '@prisma/client';

export class SubjectService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getSubjects(userId: string) {
    return await this.prisma.subject.findMany({
      where: { userId },
      include: {
        _count: {
          select: { topics: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSubjectWithTopics(userId: string, subjectId: string) {
    return await this.prisma.subject.findFirst({
      where: { id: subjectId, userId },
      include: {
        topics: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async createSubject(userId: string, data: { name: string, color: string, icon?: string }) {
    return await this.prisma.subject.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async updateSubject(userId: string, subjectId: string, data: any) {
    return await this.prisma.subject.update({
      where: { id: subjectId, userId },
      data
    });
  }

  async deleteSubject(userId: string, subjectId: string) {
    return await this.prisma.subject.delete({
      where: { id: subjectId, userId }
    });
  }

  async updateSubjectCompletion(subjectId: string) {
    const topics = await this.prisma.topic.findMany({
      where: { subjectId }
    });

    if (topics.length === 0) return;

    const totalProgress = topics.reduce((sum, topic) => sum + topic.completionPct, 0);
    const avgProgress = Math.round(totalProgress / topics.length);

    await this.prisma.subject.update({
      where: { id: subjectId },
      data: { completionPct: avgProgress }
    });
  }

  // Topic Methods
  async createTopic(subjectId: string, data: any) {
    const topic = await this.prisma.topic.create({
      data: {
        ...data,
        subjectId
      }
    });
    
    await this.updateSubjectCompletion(subjectId);
    return topic;
  }

  async updateTopic(topicId: string, subjectId: string, data: any) {
    const topic = await this.prisma.topic.update({
      where: { id: topicId, subjectId },
      data: {
        ...data,
        isCompleted: data.completionPct === 100
      }
    });

    await this.updateSubjectCompletion(subjectId);
    return topic;
  }

  async deleteTopic(topicId: string, subjectId: string) {
    await this.prisma.topic.delete({
      where: { id: topicId, subjectId }
    });

    await this.updateSubjectCompletion(subjectId);
  }
}
