import { create } from 'zustand';
import { SubjectWithTopics } from '@/types';

interface SubjectState {
  subjects: SubjectWithTopics[];
  setSubjects: (subjects: SubjectWithTopics[]) => void;
  optimisticUpdateTopic: (subjectId: string, topicId: string, completionPct: number) => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  setSubjects: (subjects) => set({ subjects }),
  optimisticUpdateTopic: (subjectId, topicId, completionPct) =>
    set((state) => ({
      subjects: state.subjects.map((s) => {
        if (s.id !== subjectId) return s;
        
        const updatedTopics = s.topics.map((t) =>
          t.id === topicId ? { ...t, completionPct, isCompleted: completionPct === 100 } : t
        );
        
        const avgProgress = Math.round(
          updatedTopics.reduce((sum, t) => sum + t.completionPct, 0) / updatedTopics.length
        );

        return { ...s, topics: updatedTopics, completionPct: avgProgress };
      }),
    })),
}));
