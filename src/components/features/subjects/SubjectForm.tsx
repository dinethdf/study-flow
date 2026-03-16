'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createSubjectSchema } from '@/lib/validators/subjectSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#64748b', // slate
];

type SubjectFormValues = {
  name: string;
  color: string;
  icon: string;
};

interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<SubjectFormValues>;
  title: string;
}

export function SubjectForm({ open, onOpenChange, onSubmit, initialData, title }: SubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(createSubjectSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || COLORS[0],
      icon: initialData?.icon || 'BookOpen',
    },
  });

  const handleSubmit = async (values: SubjectFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mathematics, Physics..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent Color</FormLabel>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                          field.value === color 
                            ? 'border-foreground ring-2 ring-primary ring-offset-1' 
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Saving...' : 'Save Subject'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
