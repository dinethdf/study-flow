import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubjectWithTopics } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';
import { useEffect } from 'react';

export function useSubjects() {
  const queryClient = useQueryClient();
  const setSubjects = useSubjectStore((state) => state.setSubjects);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await fetch('/api/subjects');
      const json = await res.json();
      return json.data as SubjectWithTopics[];
    },
  });

  useEffect(() => {
    if (subjects) {
      setSubjects(subjects);
    }
  }, [subjects, setSubjects]);

  const createSubject = useMutation({
    mutationFn: async (data: { name: string; color: string; icon?: string }) => {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  return {
    subjects,
    isLoading,
    createSubject,
    deleteSubject,
  };
}

export function useTopics(subjectId: string) {
  const queryClient = useQueryClient();
  const optimisticUpdateTopic = useSubjectStore((state) => state.optimisticUpdateTopic);

  const createTopic = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/subjects/${subjectId}/topics`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const updateTopic = useMutation({
    mutationFn: async ({ topicId, data }: { topicId: string; data: any }) => {
      // Optimistic update
      if (typeof data.completionPct === 'number') {
        optimisticUpdateTopic(subjectId, topicId, data.completionPct);
      }

      const res = await fetch(`/api/subjects/${subjectId}/topics/${topicId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const deleteTopic = useMutation({
    mutationFn: async (topicId: string) => {
      await fetch(`/api/subjects/${subjectId}/topics/${topicId}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  return {
    createTopic,
    updateTopic,
    deleteTopic,
  };
}
