import { z } from 'zod';

export const scavengerHuntSchema = z.object({
	title: z.string().trim().min(1, { message: 'Title cannot be empty' }),
	description: z.string().trim(),
});
export type ScavengerHuntFormFields = z.infer<typeof scavengerHuntSchema>;
export type ScavengerHuntFormErrors = z.inferFlattenedErrors<
	typeof scavengerHuntSchema
>['fieldErrors'];

export const scavengerHuntItemSchema = z.object({
	title: z.string().trim().min(1, { message: 'Title cannot be empty' }),
	value: z
		.number()
		.int()
		.min(1, { message: 'Value must be at least 1' })
		.max(10, { message: "C'mon! That's a huge number" }),
});
export type ScavengerHuntItemFormFields = z.infer<
	typeof scavengerHuntItemSchema
>;
export type ScavengerHuntItemFormErrors = z.inferFlattenedErrors<
	typeof scavengerHuntItemSchema
>['fieldErrors'];
