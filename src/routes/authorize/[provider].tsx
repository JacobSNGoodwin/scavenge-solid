import {
	RouteDefinition,
	RouteSectionProps,
	createAsync,
} from '@solidjs/router';
import { Suspense } from 'solid-js/web';
import { getAuthUrl } from '~/api/auth';

export const route = {
	load: ({ params }) => {
		getAuthUrl(params.provider);
	},
} satisfies RouteDefinition;

// TODO - how to handle errors here?
const ProviderLogin = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	createAsync(() => getAuthUrl(provider()));
	return (
		<Suspense fallback="Loading...">
			<h1 class="text-xl">Provider Login</h1>
		</Suspense>
	);
};

export default ProviderLogin;
