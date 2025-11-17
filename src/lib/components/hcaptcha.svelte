<script lang="ts" module>
	declare global {
		interface Window {
			hcaptcha: {
				execute: () => void;
			};
			onSubmit?: (token: string) => void;
			onError?: (error: Error) => void;
			onExpire?: () => void;
		}
	}

	export interface HCaptcha {
		execute: () => void;
	}

	export type HCaptchaTheme = 'light' | 'dark';

	export const hCaptcha: HCaptcha = {
		execute: () => window.hcaptcha.execute()
	};
</script>

<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		siteKey: string;
		theme?: HCaptchaTheme;
		onsubmit: (event: { token: string; form?: HTMLFormElement | null }) => void;
		onerror: (error: Error) => void;
		onexpire: () => void;
	}

	let { siteKey, theme = $bindable('light'), onsubmit, onerror, onexpire }: Props = $props();

	let hCaptchaDiv: HTMLDivElement | null = $state(null);

	const onSubmit = (token: string) => {
		const form = hCaptchaDiv?.closest('form');
		// dispatch('submit', { token, form });
		onsubmit({ token, form });
	};

	const onError = (error: Error) => onerror(error);
	const onExpire = () => onexpire();

	if (browser) {
		theme = (document.documentElement.getAttribute('data-theme') as HCaptchaTheme) ?? theme;
		window.onSubmit = onSubmit;
		window.onError = onError;
		window.onExpire = onExpire;
	}
</script>

<svelte:head>
	{#if browser}
		<script src="https://js.hcaptcha.com/1/api.js" async defer></script>
	{/if}
</svelte:head>

<div
	bind:this={hCaptchaDiv}
	id="hcaptcha"
	class="h-captcha"
	data-sitekey={siteKey}
	data-callback="onSubmit"
	data-error-callback="onError"
	data-expired-callback="onExpire"
	data-size="invisible"
	data-theme={theme}
></div>
