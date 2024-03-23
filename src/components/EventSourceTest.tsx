import { onMount, onCleanup } from 'solid-js';

type EventSourceTestProps = {
	id: string;
};

export default function EventSourceTest({ id }: EventSourceTestProps) {
	onMount(() => {
		console.debug('componentDidMount on client');
	});

	onCleanup(() => {
		console.debug('cleanup on client');
	});
	return (
		<>
			<h3 class="text-xl text-center">Event Source Test Client Only: {id}</h3>
		</>
	);
}
