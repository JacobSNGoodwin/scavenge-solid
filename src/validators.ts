import { z } from 'zod';

export const scavengerHuntSchema = z.object({
	title: z.string().trim().min(1, { message: 'Title cannot be empty' }),
	description: z.string().trim(),
});

export type ScavengerHuntFormFields = z.infer<typeof scavengerHuntSchema>;
export type ScavengerHuntFormErrors = z.inferFlattenedErrors<
	typeof scavengerHuntSchema
>['fieldErrors'];
