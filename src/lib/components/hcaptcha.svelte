<script lang="ts">
	import { browser } from '$app/environment';

	export let siteKey: string;
	export let theme: Theme = 'light';
	export let submitButton: HTMLButtonElement;

	const onLoad = () => {
		submitButton.onclick = (event: MouseEvent) => {
			event.preventDefault();
			window.hcaptcha.execute();
		};
	};

	const onSubmit = () => {
		const form = submitButton.form;
		form?.requestSubmit();
	};

	const onError = (error: Error) => {
		// TODO: Handle error
		console.error(`Error submitting hCaptcha: ${error}`);
	};

	const onExpire = () => {
		// TODO: Handle expire
		console.log('hCaptcha expired');
	};

	if (browser) {
		theme = (document.documentElement.getAttribute('data-theme') as Theme) ?? theme;
		window.onSubmit = onSubmit;
		window.onError = onError;
		window.onExpire = onExpire;
		window.onLoad = onLoad;
	}
</script>

<svelte:head>
	{#if browser}
		<script src="https://js.hcaptcha.com/1/api.js?onload=onLoad" async defer></script>
	{/if}
</svelte:head>

<div
	id="hcaptcha"
	class="h-captcha"
	data-sitekey={siteKey}
	data-callback="onSubmit"
	data-error-callback="onError"
	data-expired-callback="onExpire"
	data-size="invisible"
	data-theme={theme}
/>
