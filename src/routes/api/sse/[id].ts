import { APIEvent } from '@solidjs/start/server';
import { createEventStream } from 'h3';
import { nanoid } from 'nanoid';
import logger from '~/logger';

const log = logger.child({ namespace: 'hunts-SSE' });

export async function GET(event: APIEvent) {
	let count = 1;
	const eventStream = createEventStream(event.nativeEvent);
	// Send a message every second
	const interval = setInterval(async () => {
		await eventStream.push({
			id: nanoid(),
			event: 'super-event',
			data: JSON.stringify({ huntId: event.params.id, message: count }),
		});
		count++;
	}, 5000);

	// cleanup the interval and close the stream when the connection is terminated
	eventStream.onClosed(async () => {
		logger.debug('closing SSE...');
		clearInterval(interval);
		await eventStream.close();
	});

	return eventStream.send();
}
