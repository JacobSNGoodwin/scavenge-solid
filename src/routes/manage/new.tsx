import { Title } from '@solidjs/meta';
import { useAction, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { createNewScavengerHunt } from '~/api/scavengerHunts';
import ScavengerHuntForm from '~/components/ScavengerHuntForm';

export default function NewScavengerHunt() {
	const submitNew = useAction(createNewScavengerHunt);
	const newSubmission = useSubmission(createNewScavengerHunt);

	return (
		<div class="max-w-screen-md mx-auto my-4 mt-6 px-2">
			<Title>New Hunt</Title>
			<a href="/manage">Go Back</a>
			<h2 class="text-xl text-center">New Scavenger Hunt</h2>
			<div class="mx-auto px-8">
				<ScavengerHuntForm
					initialErrors={newSubmission.result}
					disabled={newSubmission.pending}
					onSubmit={(fields) => submitNew(fields)}
				/>
			</div>
			<Show when={newSubmission.pending}>
				<div class="mx-auto text-6xl i-svg-spinners:3-dots-move bg-violet-500" />
			</Show>
		</div>
	);
}
