import ScavengerHuntForm from '~/components/ScavengerHuntForm';

export default function NewScavengerHunt() {
	return (
		<div>
			<h2 class="text-xl text-center">Create New ONe</h2>
			<div class="text-center mx-auto">
				<ScavengerHuntForm
					onSubmit={() => {
						console.log('clickaroo');
					}}
				/>
			</div>
		</div>
	);
}
