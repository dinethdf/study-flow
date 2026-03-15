import { z } from 'zod';

const ACADEMIC_DOMAINS = ['.edu', '.ac.lk', '.ac.uk', '.ac.in', '.edu.au', '.ac.nz'];
const DISPOSABLE_DOMAINS = ['mailinator.com', 'tempmail.com', 'throwaway.email'];

export const studentEmailSchema = z.string()
    .email({ message: 'Please enter a valid email address.' })
    .refine(
        (email) => !DISPOSABLE_DOMAINS.some(d => email.endsWith(d)),
        { message: 'Disposable email addresses are not allowed.' }
    );

export const universityEmailSchema = studentEmailSchema.refine(
    (email) => ACADEMIC_DOMAINS.some(domain => email.endsWith(domain)),
    { message: 'University students must use an academic email address (.edu, .ac.lk, etc.).' }
);
