import { Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import logger from '~/logger';
import {
	scavengerHuntSchema,
	ScavengerHuntFormFields,
	ScavengerHuntFormErrors,
} from '~/validators';

type ScavengerHuntFormProps = {
	initialForm?: ScavengerHuntFormFields;
	initialErrors?: ScavengerHuntFormErrors;
	onSubmit: (form: ScavengerHuntFormFields) => void;
	disabled?: boolean;
};

export default function ScavengerHuntForm(props: ScavengerHuntFormProps) {
	let titleRef: HTMLInputElement | undefined;
	let descriptionRef: HTMLTextAreaElement | undefined;
	const [formErrors, setFormErrors] = createStore<ScavengerHuntFormErrors>({});

	const validateAndSubmit = () => {
		const formFields = {
			title: titleRef?.value ?? '',
			description: descriptionRef?.value ?? '',
		};
		const formState = scavengerHuntSchema.safeParse(formFields);

		logger.debug(formState, 'the form state');

		if (!formState.success) {
			logger.debug(formState.error.formErrors.fieldErrors, 'form errors');
			setFormErrors(formState.error.formErrors.fieldErrors);
			return;
		}

		props.onSubmit({
			title: titleRef?.value ?? '',
			description: descriptionRef?.value ?? '',
		});
	};

	return (
		<>
			<div class="max-w-96 mx-auto my-2 flex flex-col">
				<label for="title">Title</label>
				<input
					ref={titleRef}
					name="title"
					value={props?.initialForm?.title ?? ''}
					type="text"
					class="text-input focus:border-violet-500"
					disabled={props.disabled}
				/>
				<div class="h-8">
					<Show when={props.initialErrors?.title ?? formErrors.title}>
						<p class="text-red">
							{props.initialErrors?.title ?? formErrors.title?.[0]}
						</p>
					</Show>
				</div>
			</div>
			<div class="max-w-96 mx-auto my-2 flex flex-col">
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
