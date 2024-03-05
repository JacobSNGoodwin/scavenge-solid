import { createStore } from 'solid-js/store';

type Form = {
	title: string;
	description: string;
};

type ScavengerHuntFormProps = {
	onSubmit: (form: Form) => void;
	initialForm?: Form;
};

export default function ScavengerHuntForm(props: ScavengerHuntFormProps) {
	const [form, setForm] = createStore<Form>(
		props?.initialForm ?? {
			title: '',
			description: '',
		},
	);

	return (
		<>
			<div class="max-w-96 mx-auto my-4 flex flex-col">
				<label for="title">Title</label>
				<input
					name="title"
					value={form.title}
					onChange={(event) => setForm('title', event.target.value)}
					type="text"
					class="text-input focus:border-violet-500"
				/>
			</div>
			<div class="max-w-96 mx-auto my-4 flex flex-col">
				<label for="title">Description</label>
				<textarea
					name="title"
					rows="3"
					value={form.description}
					onChange={(event) => setForm('description', event.target.value)}
					class="text-input focus:border-violet-500"
				/>
			</div>

			<button
				type="button"
				class="btn bg-violet-500 text-white my-4 block mx-auto"
				onClick={() => props.onSubmit(form)}
			>
				Update
			</button>
		</>
	);
}
