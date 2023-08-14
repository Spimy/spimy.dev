<script lang="ts" context="module">
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

	export interface HCaptchaEvent {
		submit: { token: string; form: HTMLFormElement | null };
		error: { error: Error };
		expire: void;
	}

	export type HCaptchaTheme = 'light' | 'dark';

	export const hCaptcha: HCaptcha = {
		execute: () => window.hcaptcha.execute()
	};
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let siteKey: string;
	export let theme: HCaptchaTheme = 'light';

	let hCaptchaDiv: HTMLDivElement;

	const dispatch = createEventDispatcher<HCaptchaEvent>();

	const onSubmit = (token: string) => {
		const form = hCaptchaDiv.closest('form');
		dispatch('submit', { token, form });
	};

	const onError = (error: Error) => dispatch('error', { error });
	const onExpire = () => dispatch('expire');

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
/>
