'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import { studentEmailSchema } from '@/lib/validators/emailSchema';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: studentEmailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    userType: z.enum(['SCHOOL', 'UNIVERSITY']),
    institution: z.string().min(2, 'Please enter your school or university name'),
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            userType: 'SCHOOL',
            institution: '',
        },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        console.log('Initiating registration via server API...', values.email);
        
        try {
            // We now call the server API DIRECTLY.
            // The server API uses an Admin Client to create the user and auto-confirm them,
            // bypassing the Supabase email rate limits that often block development.
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const result = await response.json();
            console.log('Server Registration Response:', result);

            if (!response.ok) {
                toast.error(result.error || 'Registration failed');
                return;
            }

            toast.success('Registration successful! You can now log in.');
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An unexpected error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your student account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@university.edu" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            University students must use an academic email (.edu, .ac.lk, etc.).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>I am a...</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select student type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SCHOOL">School Student</SelectItem>
                                                <SelectItem value="UNIVERSITY">University Student</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="institution"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution</FormLabel>
                                        <FormControl>
                                            <Input placeholder="University of Colombo / Royal College" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full pt-2" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Register'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-center gap-1">
                    <span className="text-sm text-muted-foreground">Already have an account?</span>
                    <Link href="/login" className="text-sm font-medium underline underline-offset-4">
                        Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
