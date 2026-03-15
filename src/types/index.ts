import { Subject, Topic, ExamDate, Schedule, ScheduleSession } from '@prisma/client';

export type SubjectWithTopics = Subject & {
    topics: Topic[];
};

export type TopicWithSubject = Topic & {
    subject: Subject;
};

export type ExamWithSubject = ExamDate & {
    subject: Subject;
};

export type ScheduleWithSessions = Schedule & {
    sessions: ScheduleSessionWithRelations[];
};

export type ScheduleSessionWithRelations = ScheduleSession & {
    subject: Subject;
    topic: Topic | null;
};

export type SessionType = 'NEW_MATERIAL' | 'REVIEW' | 'EXAM_PREP' | 'PRACTICE';
