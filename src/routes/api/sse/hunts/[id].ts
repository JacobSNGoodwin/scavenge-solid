import { APIEvent } from '@solidjs/start/server';
import { createEventStream } from 'h3';
import logger from '~/logger';

const log = logger.child({ namespace: 'hunts-SSE' });

export function GET(event: APIEvent) {
	const eventStream = createEventStream(event.nativeEvent);

	// Send a message every second
	const interval = setInterval(async () => {
		await eventStream.push('Hello world');
	}, 1000);

	// cleanup the interval and close the stream when the connection is terminated
	eventStream.onClosed(async () => {
		console.log('closing SSE...');
		clearInterval(interval);
		await eventStream.close();
	});

	return eventStream.send();
}
