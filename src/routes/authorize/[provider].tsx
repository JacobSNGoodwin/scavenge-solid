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

const ProviderLogin = (props: RouteSectionProps) => {
	const provider = () => props.params.provider;
	const url = createAsync(() => getAuthUrl(provider()), { deferStream: true });
	return (
		<Suspense
			fallback={
				<div class="h-svh text-3xl flex flex-col justify-center items-center">
					<div class="i-svg-spinners:3-dots-move bg-violet-500" />
				</div>
			}
		>
			<div class="invisible">{url()?.url}</div>
		</Suspense>
	);
};

export default ProviderLogin;
