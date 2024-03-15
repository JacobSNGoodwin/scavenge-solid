import { FetchEvent } from '@solidjs/start/server';
import pino from 'pino';

const logger = pino({
	name: 'scavenge',
	level: import.meta.env.DEV ? 'debug' : 'info',
	transport: {
		targets: [
			{
				target: 'pino-pretty',
				level: import.meta.env.DEV ? 'debug' : 'info',
				options: { colorize: true, translateTime: true },
			},
		],
	},
});

const log = logger.child({ namespace: 'event-logger' });

export const eventLoggerMiddleware = async (event: FetchEvent) => {
	log.info(
		{
			request: {
				method: event.request.method,
				url: event.request.url,
				host: event.clientAddress,
				headers: Object.fromEntries(event.request.headers),
			},
			response: {
				status: event.response.status,
				statusText: event.response.statusText,
				headers: Object.fromEntries(event.response.headers),
			},
		},
		'FetchEvent data',
	);
};

export default logger;
