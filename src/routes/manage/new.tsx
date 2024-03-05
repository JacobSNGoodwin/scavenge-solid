import ScavengerHuntForm from '~/components/ScavengerHuntForm';

export default function NewScavengerHunt() {
	return (
		<div class="mt-6">
			<h2 class="text-xl text-center">New Scavenger Hunt</h2>
			<div class="mx-auto px-8">
				<ScavengerHuntForm
					onSubmit={(form) => {
						console.log(form);
					}}
					initialForm={{
						title: 'Cool Hunt',
						description: 'This is a cool hunt',
					}}
				/>
			</div>
		</div>
	);
}
