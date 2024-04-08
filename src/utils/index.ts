export const isNotNullish = <T>(argument: T | null): argument is T => {
	return argument !== null && argument !== undefined;
};
