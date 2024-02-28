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

export const eventLoggerMiddleware = ({
	nativeEvent,
	request,
	response,
	locals,
	clientAddress,
}: FetchEvent) => {
	log.info(
		{ nativeEvent, request, response, locals, clientAddress },
		'FetchEvent data',
	);
};

export default logger;
