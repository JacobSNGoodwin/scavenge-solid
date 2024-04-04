import { Show, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import logger from '~/logger';
import {
	ScavengerHuntItemFormErrors,
	ScavengerHuntItemFormFields,
	scavengerHuntItemSchema,
} from '~/validators';

type NewHuntItemProps = {
	initialForm?: ScavengerHuntItemFormFields;
	initialErrors?: ScavengerHuntItemFormErrors;
	onSubmit: (form: ScavengerHuntItemFormFields) => void;
	onCancel: () => void;
};

export default function NewHuntItem(props: NewHuntItemProps) {
	const [value, setValue] = createSignal(1);
	const [formErrors, setFormErrors] = createStore<ScavengerHuntItemFormErrors>(
		{},
	);
	let titleRef: HTMLInputElement | undefined;

	const handleIncrementValue = (increment: number) => {
		const nextValue = value() + increment;

		if (nextValue > 10 || nextValue < 1) return;

		setValue(value() + increment);
	};

	const validateAndSubmit = () => {
		const formFields = {
			title: titleRef?.value ?? '',
			value: value(),
		};
		const formState = scavengerHuntItemSchema.safeParse(formFields);

		logger.debug(formState, 'NewHuntItems form state');

		if (!formState.success) {
			logger.debug(formState.error.formErrors.fieldErrors, 'form errors');
			setFormErrors(formState.error.formErrors.fieldErrors);
			return;
		}

		props.onSubmit(formState.data);
	};

	return (
		<div class="px-4 my-4">
			<div class="mx-auto my-2 flex items-center h-8 text-xl">
				<input
					ref={titleRef}
					name="title"
					value=""
					placeholder="Title"
					type="text"
					class="text-input focus:border-violet-500 grow"
					disabled={false}
				/>
				<div class="pl-2 w-10 text-right">{value()}</div>
				<div class="pl-2 flex flex-col justify-between gap-y-4">
					<button
						type="button"
						onClick={() => handleIncrementValue(1)}
						class="cursor-pointer i-tabler:square-rounded-chevron-up-filled text-stone-500 font-bold hover:text-violet-500 focus:text-violet-500 text-3xl"
					/>
					<button
						type="button"
						onClick={() => handleIncrementValue(-1)}
						class="cursor-pointer i-tabler:square-rounded-chevron-down-filled text-stone-500 font-bold hover:text-violet-500 focus:text-violet-500 text-3xl"
					/>
				</div>
			</div>
			<div class="h-8">
				<Show when={props.initialErrors?.title ?? formErrors.title}>
					<p class="text-red">
						{props.initialErrors?.title ?? formErrors.title?.[0]}
					</p>
				</Show>
			</div>
			<div class="flex justify-center mb-2 gap-x-4">
				<button
					type="button"
					class="btn w-32 bg-gray-500 text-white text-md block"
					onClick={() => {
						props.onCancel();
					}}
				>
					<span class="align-middle mr-2">Cancel</span>
					<span class="i-tabler:square-rounded-x-filled inline-block align-middle" />
				</button>
				<button
					type="button"
					class="btn w-32 bg-violet-500 text-white text-md block"
					onClick={validateAndSubmit}
				>
					<span class="align-middle mr-2">Add</span>
					<span class="i-tabler:square-rounded-chevron-right-filled inline-block align-middle" />
				</button>
			</div>
		</div>
	);
}
