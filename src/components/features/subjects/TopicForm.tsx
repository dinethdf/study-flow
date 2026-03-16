'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createTopicSchema } from '@/lib/validators/topicSchema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
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

// Explicitly define form values to avoid mismatch with Zod's inferred type (including defaults)
type TopicFormValues = {
  name: string;
  description: string;
  completionPct: number;
  orderIndex: number;
  notes: string;
};

interface TopicFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
}

export function TopicForm({ open, onOpenChange, onSubmit, title }: TopicFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(createTopicSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      completionPct: 0,
      orderIndex: 0,
      notes: '',
    },
  });

  const handleSubmit = async (values: TopicFormValues) => {
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
          <DialogDescription>
            Add a study topic to break down this subject.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Calculus I, Photosynthesis, Ancient Rome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Adding...' : 'Add Topic'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
