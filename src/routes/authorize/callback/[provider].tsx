import { ErrorBoundary, Suspense } from 'solid-js';
import {
	createAsync,
	RouteDefinition,
	RouteSectionProps,
} from '@solidjs/router';
import { verifyAuth } from '~/api/auth';

export const route = {
	load: async ({ params }) => {
		verifyAuth(params.provider);
	},
} satisfies RouteDefinition;

const ProviderCallback = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	createAsync(() => verifyAuth(provider()), { deferStream: true });

	return (
		<Suspense fallback="Loading...">
			<ErrorBoundary fallback={<div>Big time error</div>}>
				<h1 class="text-xl">
					Verifying {provider().toUpperCase()} Authorization
				</h1>
			</ErrorBoundary>
		</Suspense>
	);
};

export default ProviderCallback;
