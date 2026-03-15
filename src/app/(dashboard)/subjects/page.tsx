'use client';

import { useState } from 'react';
import { useSubjects, useTopics } from '@/hooks/useSubjects';
import { SubjectCard } from '@/components/features/subjects/SubjectCard';
import { SubjectForm } from '@/components/features/subjects/SubjectForm';
import { TopicList } from '@/components/features/subjects/TopicList';
import { TopicForm } from '@/components/features/subjects/TopicForm';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, ChevronLeft, LayoutGrid } from 'lucide-react';
import { SubjectWithTopics } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SubjectsPage() {
  const { subjects, isLoading, createSubject, deleteSubject } = useSubjects();
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithTopics | null>(null);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);

  const handleCreateSubject = async (data: any) => {
    try {
      await createSubject.mutateAsync(data);
      toast.success('Subject created successfully');
    } catch (error) {
      toast.error('Failed to create subject');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure? This will delete all topics for this subject.')) return;
    try {
      await deleteSubject.mutateAsync(id);
      if (selectedSubject?.id === id) setSelectedSubject(null);
      toast.success('Subject deleted');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  // Sync selected subject with newest data from Query
  const activeSubject = selectedSubject 
    ? subjects?.find(s => s.id === selectedSubject.id) 
    : null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           {selectedSubject && (
             <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedSubject(null)}
              className="mr-2"
             >
               <ChevronLeft className="h-5 w-5" />
             </Button>
           )}
           <div>
             <h1 className="text-3xl font-bold tracking-tight">
               {selectedSubject ? activeSubject?.name : 'Subjects'}
             </h1>
             <p className="text-muted-foreground">
               {selectedSubject 
                ? `Manage topics and track progress for ${activeSubject?.name}`
                : 'Organize your academic workload and track topic completion.'}
             </p>
           </div>
        </div>

        {!selectedSubject && (
          <Button onClick={() => setIsAddSubjectOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> Add Subject
          </Button>
        )}
        
        {selectedSubject && (
           <Button onClick={() => setIsAddTopicOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> Add Topic
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !selectedSubject ? (
        /* Main Grid View */
        subjects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-accent/5 rounded-3xl border border-dashed border-muted/60">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-semibold">No subjects yet</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Start by adding your first subject, like Mathematics or History.
            </p>
            <Button onClick={() => setIsAddSubjectOpen(true)} className="mt-8 gap-2">
              <Plus size={18} /> Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects?.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => setSelectedSubject(subject)}
                onDelete={() => handleDeleteSubject(subject.id)}
              />
            ))}
          </div>
        )
      ) : (
        /* Topic Detail View */
        <div className="grid gap-8 lg:grid-cols-12 max-w-5xl mx-auto">
          <div className="lg:col-span-8">
             <TopicList 
               subjectId={selectedSubject.id} 
               topics={activeSubject?.topics || []} 
               subjectColor={activeSubject?.color || '#3b82f6'}
             />
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border bg-card/50 space-y-4 sticky top-24">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Subject Progress</h4>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black">{activeSubject?.completionPct}%</span>
                <span className="text-xs font-semibold py-1 px-2 rounded-full bg-primary/10 text-primary uppercase">
                  {activeSubject?.completionPct === 100 ? 'Mastered' : 'In Progress'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                 <div 
                   className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                   style={{ 
                     width: `${activeSubject?.completionPct}%`,
                     backgroundColor: activeSubject?.color || '#3b82f6'
                   }}
                 />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                This is the average progress of all {activeSubject?.topics?.length || 0} topics in this subject.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      <SubjectForm
        open={isAddSubjectOpen}
        onOpenChange={setIsAddSubjectOpen}
        onSubmit={handleCreateSubject}
        title="Add New Subject"
      />

      {activeSubject && (
        <TopicForm
          open={isAddTopicOpen}
          onOpenChange={setIsAddTopicOpen}
          onSubmit={async (data) => {
            const topicService = useTopics(activeSubject.id);
            await topicService.createTopic.mutateAsync(data);
            toast.success('Topic added');
          }}
          title={`Add Topic to ${activeSubject.name}`}
        />
      )}
    </div>
  );
}
