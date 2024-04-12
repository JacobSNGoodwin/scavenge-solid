type ConfirmationProps = {
	onConfirm: () => void;
	onCancel: () => void;
	confirmationMessage: string;
	confirmButtonText: string;
	cancelButtonText: string;
};

export default function Confirmation(props: ConfirmationProps) {
	return (
		<div class="z-50 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
			<div class="bg-white p-6 rounded-xl drop-shadow-md h-fit w-11/12 xs:w-5/6 sm:w-1/2 md:w-1/3">
				<h1 class="text-xl">{props.confirmationMessage}</h1>
				<div class="mt-8 mb-4 flex justify-end gap-4">
					<button
						type="button"
						class="btn bg-stone-500 text-white"
						onClick={() => props.onCancel()}
					>
						{props.cancelButtonText}
					</button>
					<button
						type="button"
						class="btn bg-violet-500 text-white"
						onClick={() => props.onConfirm()}
					>
						{props.confirmButtonText}
					</button>
				</div>
			</div>
		</div>
	);
}
