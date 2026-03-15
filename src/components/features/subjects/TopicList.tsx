'use client';

import { Topic } from '@prisma/client';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { useTopics } from '@/hooks/useSubjects';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TopicListProps {
  subjectId: string;
  topics: Topic[];
  subjectColor: string;
}

export function TopicList({ subjectId, topics, subjectColor }: TopicListProps) {
  const { updateTopic, deleteTopic } = useTopics(subjectId);
  const [localProgress, setLocalProgress] = useState<Record<string, number>>(
    topics.reduce((acc, t) => ({ ...acc, [t.id]: t.completionPct }), {})
  );

  const handleUpdateProgress = async (topicId: string, value: number) => {
    setLocalProgress(prev => ({ ...prev, [topicId]: value }));
    try {
      await updateTopic.mutateAsync({
        topicId,
        data: { completionPct: value }
      });
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleDelete = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
      await deleteTopic.mutateAsync(topicId);
      toast.success('Topic deleted');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-accent/10 rounded-xl border border-dashed border-muted/60">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm font-medium text-muted-foreground">No topics added yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Add topics to start tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div 
          key={topic.id} 
          className="group flex flex-col p-4 rounded-xl border border-muted/60 bg-card transition-all hover:border-primary/20 hover:shadow-sm animate-in fade-in slide-in-from-right-2 duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <h3 className={cn(
                  "text-sm font-semibold transition-colors",
                  topic.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {topic.name}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(topic.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Progress</span>
              <span className={cn(
                "font-bold",
                topic.completionPct === 100 ? "text-green-500" : ""
              )}>
                {localProgress[topic.id] ?? topic.completionPct}%
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Slider
                value={[localProgress[topic.id] ?? topic.completionPct]}
                max={100}
                step={5}
                className="flex-1"
                style={{ "--slider-primary": subjectColor } as any}
                onValueChange={(vals) => setLocalProgress(prev => ({ ...prev, [topic.id]: vals[0] }))}
                onValueCommit={(vals) => handleUpdateProgress(topic.id, vals[0])}
              />
              
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-300 transform",
                topic.isCompleted 
                  ? "bg-green-100 text-green-600 scale-110" 
                  : "bg-muted text-muted-foreground scale-100"
              )}>
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
