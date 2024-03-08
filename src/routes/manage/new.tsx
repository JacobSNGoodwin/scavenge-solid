import { Title } from '@solidjs/meta';
import ScavengerHuntForm from '~/components/ScavengerHuntForm';
import logger from '~/logger';

export default function NewScavengerHunt() {
	return (
		<div class="max-w-screen-md mx-auto my-4 mt-6">
			<Title>New Hunt</Title>
			<a href="/manage">Go Back</a>
			<h2 class="text-xl text-center">New Scavenger Hunt</h2>
			<div class="mx-auto px-8">
				<ScavengerHuntForm onSubmit={logger.debug} />
			</div>
		</div>
	);
}
