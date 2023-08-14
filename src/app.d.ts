// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	interface Window {
		hcaptcha: {
			execute: () => void;
		};
		onSubmit?: (token: string) => void;
		onError?: (error: Error) => void;
		onExpire?: () => void;
		onLoad?: () => void;
	}
}

export {};
