import { cache, redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import {
	getScavengerHuntById,
	getScavengerHuntsByUserId,
} from '../database/queries';
import logger from '~/logger';

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
