// @refresh reload
import { createSignal } from 'solid-js';

export default function App() {
	const [count, setCount] = createSignal(0);

	return (
		<main>
			<h1>Hello world!</h1>
			<button
				type="button"
				class="increment"
				onClick={() => setCount(count() + 5)}
			>
				Clicks: {count()}
			</button>
			<p>
				Visit{' '}
				<a href="https://start.solidjs.com" target="_blank" rel="noreferrer">
					start.solidjs.com
				</a>{' '}
				<span class="text-red-600">to learn how to build SolidStart app.</span>
			</p>
		</main>
	);
}
