import { action, cache, redirect, revalidate } from '@solidjs/router';
import { nanoid } from 'nanoid';
import { getRequestEvent } from 'solid-js/web';
import type { z } from 'zod';
import type { NewScavengerHuntItem } from '~/database/schema';
import logger from '~/logger';
import {
	type ScavengerHuntItemFormFields,
	scavengerHuntSchema,
} from '~/validators';
import {
	addItemToScavengerHunt,
	createScavengerHunt,
	deleteItemFromScavengerHunt,
	getScavengerHuntById,
	getScavengerHuntItemsById,
	getScavengerHuntsByUserId,
	updateScavengerHunt,
} from '../database/queries';
import { isNotNullish } from '~/utils';

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

	const scavengerHuntWithItems = await getScavengerHuntItemsById(
		huntId,
		userId,
	);

	if (!scavengerHuntWithItems.length) {
		log.warn(
			{ scavengerHuntWithItems, userId },
			'Scavenger Hunt does not belong to user',
		);
		throw new Error('Not found');
	}

	const details = scavengerHuntWithItems[0].scavenger_hunts;
	const huntItems = scavengerHuntWithItems.map(
		(item) => item.scavenger_hunt_items,
	);

	const items = huntItems.filter(isNotNullish);

	return {
		...details,
		items,
	};
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

		revalidate(getScavengerHuntDetails.keyFor(updatedId));
	},
);

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

		const added = await addItemToScavengerHunt(newItem);

		log.info({ added }, 'Succesfully addded new scavenger hunt item');

		revalidate(getScavengerHuntDetails.keyFor(huntId));
	},
);

export const deleteScavengerHuntItem = action(
	async (huntId: string, itemId: string) => {
		'use server';
		const request = getRequestEvent();
		const userId = request?.locals.user?.id;

		if (!userId) {
			throw redirect('/login');
		}

		const scavengerHunt = await getScavengerHuntById(huntId);

		if (scavengerHunt?.createdBy !== userId) {
			// TODO - handle this
			throw new Error('Not authorized');
		}

		log.info(
			{
				huntId,
				itemId,
			},
			'deleting existing scavenger hunt item',
		);

		const deleted = await deleteItemFromScavengerHunt(itemId);

		log.debug({ deleted }, 'deleted item from scavenger hunt');
		revalidate(getScavengerHuntDetails.keyFor(huntId));
	},
);
