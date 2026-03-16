'use client';

import { SubjectWithTopics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, MoreVertical, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  subject: SubjectWithTopics;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function SubjectCard({ subject, onClick, onDelete, onEdit }: SubjectCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden border-muted/60 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
      onClick={onClick}
    >
      <div 
        className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2" 
        style={{ backgroundColor: subject.color }} 
      />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div 
            className="p-2 rounded-md bg-accent/50 text-accent-foreground"
            style={{ color: subject.color }}
          >
            <BookOpen size={18} />
          </div>
          <CardTitle className="text-lg font-bold truncate max-w-[180px]">
            {subject.name}
          </CardTitle>
        </div>
        
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger 
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={onEdit} className="gap-2">
                <Edit2 size={14} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{subject.topics?.length || 0} topics</span>
            <span className="font-medium text-foreground">{subject.completionPct}%</span>
          </div>
          
          <div className="relative pt-1">
            <Progress 
              value={subject.completionPct} 
              className="h-2"
              indicatorClassName={cn("transition-all duration-500")}
              style={{ "--progress-foreground": subject.color } as any}
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
             <div className="flex -space-x-1.5 overflow-hidden">
                {/* Visual indicator for topics could go here */}
             </div>
             <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 pr-1 group-hover:text-primary transition-colors">
               Manage <ChevronRight size={14} />
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
