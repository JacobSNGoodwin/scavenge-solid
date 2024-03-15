import { Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { z } from 'zod';
import logger from '~/logger';
import { scavengerHuntSchema } from '~/validators';

type ScavengerHuntFormFields = z.infer<typeof scavengerHuntSchema>;
type ScavengerHuntFormFieldsErrors = {
	title?: string;
	description?: string;
};

type ScavengerHuntFormProps = {
	initialForm?: ScavengerHuntFormFields;
	initialErrors?: ScavengerHuntFormFieldsErrors;
	onSubmit: (form: ScavengerHuntFormFields) => void;
	disabled: boolean;
};

export default function ScavengerHuntForm(props: ScavengerHuntFormProps) {
	let titleRef: HTMLInputElement | undefined;
	let descriptionRef: HTMLTextAreaElement | undefined;
	const [formErrors, setFormErrors] =
		createStore<ScavengerHuntFormFieldsErrors>({});

	const validateAndSubmit = () => {
		const formFields = {
			title: titleRef?.value ?? '',
			description: descriptionRef?.value ?? '',
		};
		const formState = scavengerHuntSchema.safeParse(formFields);

		logger.debug(formState, 'the form state');

		if (!formState.success) {
			logger.debug(formState.error.formErrors.fieldErrors, 'form errors');
			setFormErrors({
				title:
					formState.error.formErrors.fieldErrors.title?.[0] ?? formErrors.title,
				description:
					formState.error.formErrors.fieldErrors.description?.[0] ??
					formErrors.description,
			});
			return;
		}

		setFormErrors({ title: '', description: '' });
		props.onSubmit({
			title: titleRef?.value ?? '',
			description: descriptionRef?.value ?? '',
		});
	};

	return (
		<>
			<div class="max-w-96 mx-auto my-4 flex flex-col">
				<label for="title">Title</label>
				<input
					ref={titleRef}
					name="title"
					value={props?.initialForm?.title ?? ''}
					type="text"
					class="text-input focus:border-violet-500"
					disabled={props.disabled}
				/>
				<Show when={formErrors.title}>
					<p class="text-red">{formErrors.title}</p>
				</Show>
			</div>
			<div class="max-w-96 mx-auto my-4 flex flex-col">
				<label for="title">Description</label>
				<textarea
					ref={descriptionRef}
					name="description"
					rows="3"
					class="text-input focus:border-violet-500"
					disabled={props.disabled}
				>
					{props?.initialForm?.description ?? ''}
				</textarea>
			</div>
			<button
				type="submit"
				onClick={validateAndSubmit}
				class="btn bg-violet-500 text-white my-4 block mx-auto"
				disabled={props.disabled}
			>
				<Show when={props.initialForm} fallback="Submit">
					Update
				</Show>
			</button>
		</>
	);
}
