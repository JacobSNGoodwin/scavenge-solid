import { action, cache, redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import logger from '~/logger';
import {
	createScavengerHunt,
	getScavengerHuntById,
	getScavengerHuntsByUserId,
} from '../database/queries';
import { nanoid } from 'nanoid';

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

	if (scavengerHunt.created_by !== userId) {
		log.warn(
			{ scavengerHunt, userId },
			'attempted to retrieve scavenger hunt not owned by user',
		);
		throw new Error('Not found');
	}

	return scavengerHunt;
}, 'scavengerHunt');

export const createNewScavengerHunt = action(
	async (title: string, description: string) => {
		'use server';
		const request = getRequestEvent();
		const userId = request?.locals.user?.id;

		if (!userId) {
			throw redirect('/login');
		}

		const id = nanoid();

		logger.info(
			{
				id,
				title,
				description,
				created_by: userId,
			},
			'creating new scavenger hunt',
		);

		const createdHunt = await createScavengerHunt({
			id,
			title,
			description,
			created_by: userId,
		});

		throw redirect(`/manage/${createdHunt.id}`);
	},
);
