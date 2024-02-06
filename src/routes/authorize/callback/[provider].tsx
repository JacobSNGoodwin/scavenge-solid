import { Suspense } from 'solid-js';
import { RouteDefinition, RouteSectionProps, cache } from '@solidjs/router';

const verifyAuth = cache(async () => {}, 'verify-provider');

export const route = {
	load: ({ params }) => {},
} satisfies RouteDefinition;

const ProviderCallback = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	// createAsync(() => getAuthUrl(provider()));
	return (
		<Suspense fallback="Loading...">
			<h1 class="text-xl">
				Verifying {provider().toUpperCase()} Authorization
			</h1>
		</Suspense>
	);
};

export default ProviderCallback;
