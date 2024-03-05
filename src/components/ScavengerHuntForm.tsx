type ScavengerHuntFormProps = {
	onSubmit: () => void;
};

export default function ScavengerHuntForm(props: ScavengerHuntFormProps) {
	return (
		<div>
			<h2 class="text-xl text-center">Hunt Form will go here!</h2>
			<div class="text-center mx-auto">
				<button type="button" onClick={() => props.onSubmit()}>
					Update
				</button>
			</div>
		</div>
	);
}
