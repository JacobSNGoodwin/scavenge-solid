import { cache, createAsync } from '@solidjs/router';
import { ErrorBoundary, Suspense } from 'solid-js/web';

const loadData = cache(async () => {
	'use server';
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (Math.random() > 0.5) {
		throw new Error('Test Error');
	}

	return 'Bill';
}, 'user');

export const route = {
	load: () => loadData(),
};
export default function ErrorPage() {
	const name = createAsync(() => loadData());

	return (
		<main class="max-w-screen-md mx-auto my-4">
			<h1 class="text-3xl text-center">Test Errors</h1>
			<ErrorBoundary
				fallback={<p class="text-center text-red">Error boundary</p>}
			>
				<Suspense fallback={<p class="text-center text-green">Loading...</p>}>
					<p class="text-center text-xl font-extrabold">{name()}</p>
				</Suspense>
			</ErrorBoundary>
		</main>
	);
}
