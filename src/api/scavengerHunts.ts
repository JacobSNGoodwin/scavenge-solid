import { action, cache, redirect, revalidate } from '@solidjs/router';
import { nanoid } from 'nanoid';
import { getRequestEvent } from 'solid-js/web';
import type { z } from 'zod';
import logger from '~/logger';
import {
	scavengerHuntSchema,
	type ScavengerHuntItemFormFields,
} from '~/validators';
import {
	addItemToScavengerHunt,
	createScavengerHunt,
	getItemsByScavengerHuntId,
	getScavengerHuntById,
	getScavengerHuntsByUserId,
	updateScavengerHunt,
} from '../database/queries';
import type { NewScavengerHuntItem } from '~/database/schema';

const log = logger.child({ module: 'api/scavengerHunts' });

export const getUserScavengerHunts = cache(async () => {
	'use server';
	const request = getRequestEvent();
	const userId = request?.locals.user?.id;

	// could also throw an error message and catch in an error boundary
	if (!userId) {
		throw redirect('/login');
	}

	log.debug({ userId }, 'getting scavenger hunts for user');

	return getScavengerHuntsByUserId(userId);
}, 'userScavengerHunts');

export const getScavengerHuntDetails = cache(async (huntId: string) => {
	'use server';
	const request = getRequestEvent();
	const userId = request?.locals.user?.id;

	if (!userId) {
		throw redirect('/login');
	}

	const scavengerHunt = await getScavengerHuntById(huntId);

	if (scavengerHunt.createdBy !== userId) {
		log.warn(
			{ scavengerHunt, userId },
			'Scavenger Hunt does not belong to user',
		);
		throw new Error('Not found');
	}

	return scavengerHunt;
}, 'scavengerHunt');

export const createNewScavengerHunt = action(
	async (fields: z.infer<typeof scavengerHuntSchema>) => {
		'use server';

		const request = getRequestEvent();
		const userId = request?.locals.user?.id;

		if (!userId) {
			throw redirect('/login');
		}

		const result = scavengerHuntSchema.safeParse(fields);

		if (!result.success) {
			log.warn({ error: result.error }, 'invalid scavenger hunt fields');
			return result.error.formErrors.fieldErrors;
		}

		const { title, description } = result.data;

		const id = nanoid();

		log.info(
			{
				id,
				title,
				description,
				created_by: userId,
			},
			'creating new scavenger hunt',
		);

		const date = new Date();

		const createdHunt = await createScavengerHunt({
			id,
			title,
			description,
			createdBy: userId,
			createdAt: date,
			updatedAt: date,
		});

		throw redirect(`/manage/${createdHunt.id}`);
	},
);

export const updateExistingScavengerHunt = action(
	async (id: string, fields: z.infer<typeof scavengerHuntSchema>) => {
		'use server';

		const request = getRequestEvent();
		const userId = request?.locals.user?.id;

		if (!userId) {
			throw redirect('/login');
		}

		const result = scavengerHuntSchema.safeParse(fields);

		if (!result.success) {
			log.warn({ error: result.error }, 'invalid scavenger hunt fields');
			return result.error.formErrors.fieldErrors;
		}

		const { title, description } = result.data;

		log.info(
			{
				id,
				title,
				description,
			},
			'updating scavenger hunt',
		);

		const date = new Date();

		const { id: updatedId } = await updateScavengerHunt(id, {
			title,
			description,
			updatedAt: date,
		});

		return revalidate(getScavengerHuntDetails.keyFor(updatedId));
	},
);

// hunt items
export const getScavengerHuntItems = cache(async (huntId: string) => {
	'use server';
	const request = getRequestEvent();
	const userId = request?.locals.user?.id;

	if (!userId) {
		throw redirect('/login');
	}

	return getItemsByScavengerHuntId(huntId);
}, 'scavengerHuntItems');

export const createScavengerHuntItem = action(
	async (huntId: string, fields: ScavengerHuntItemFormFields) => {
		'use server';
		const request = getRequestEvent();
		const userId = request?.locals.user?.id;

		if (!userId) {
			throw redirect('/login');
		}

		const date = new Date();

		const newItem: NewScavengerHuntItem = {
			id: nanoid(),
			huntId,
			title: fields.title,
			value: fields.value,
			createdAt: date,
			updatedAt: date,
		};

		log.info(
			{
				newItem,
			},
			'creating new scavenger hunt item',
		);

		await addItemToScavengerHunt(newItem);

		revalidate(getScavengerHuntItems.keyFor(huntId));
	},
);
