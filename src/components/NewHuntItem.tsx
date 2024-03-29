import { Show, createSignal } from 'solid-js';

export default function NewHuntItem() {
	const [value, setValue] = createSignal(1);

	let titleRef: HTMLInputElement | undefined;

	const handleIncrementValue = (increment: number) => {
		const nextValue = value() + increment;

		if (nextValue > 10 || nextValue < 1) return;

		setValue(value() + increment);
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
				<div class="pl-2 flex flex-col justify-between">
					<div
						onClick={() => handleIncrementValue(1)}
						onKeyUp={() => handleIncrementValue(1)}
						class="cursor-pointer i-tabler:chevron-up text-violet-500 font-bold hover:opacity-80 text-3xl"
					/>
					<div
						onClick={() => handleIncrementValue(-1)}
						onKeyUp={() => handleIncrementValue(-1)}
						class="cursor-pointer i-tabler:chevron-down text-violet-500 font-bold hover:opacity-80 text-3xl"
					/>
				</div>
			</div>
			<div class="h-8">
				<Show when={false}>
					<p class="text-red">
						Sample Error Message
						{/* {props.initialErrors?.title ?? formErrors.title?.[0]} */}
					</p>
				</Show>
			</div>
		</div>
	);
}
