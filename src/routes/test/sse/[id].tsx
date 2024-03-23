import { useParams } from '@solidjs/router';
import { createSignal, onCleanup, onMount } from 'solid-js';
import logger from '~/logger';

export default function TestSSE() {
	const params = useParams();
	let eventSource: EventSource | null = null;
	const [messages, setMessages] = createSignal<string[]>([]);
	onMount(() => {
		logger.debug('in onMount');
		eventSource = new EventSource(`/api/sse/${params.id}`);
		// Have to use addEventListener for customer event types

		// for custom event types
		eventSource.addEventListener('super-event', (event) => {
			const data = JSON.parse(event.data);
			console.debug('Received "super-event" message', data.message);
			setMessages((prev) => [...prev, data.message]);
		});
	});

	onCleanup(() => {
		logger.info('in onCleanup');

		eventSource?.close();
	});

	return (
		<>
			<h1 class="text-3xl text-center my-4">Test SSE - {params.id}</h1>
			<pre>{JSON.stringify(messages())}</pre>
		</>
	);
}
