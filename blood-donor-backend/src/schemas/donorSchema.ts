// src/schemas/donorSchema.ts
import { z } from 'zod';

export const donorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bloodType: z.string().min(1, 'Blood type is required'),
    contact: z.string().min(1, 'Contact number is required'),
    city: z.string().min(1, 'City is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    age: z.number().min(18, 'Age must be at least 18').max(65, 'Age must be no more than 65'),
    lastDonation: z.string().optional(),
    available: z.boolean().default(true),
});
