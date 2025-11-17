<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import type { Theme } from '$lib/types/theme';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		currentTheme: Theme | undefined;
	}

	let { currentTheme }: Props = $props();

	let nextTheme: Theme = $derived(!currentTheme || currentTheme === 'light' ? 'dark' : 'light');
	
	let path = $derived(page.url.pathname);
	let searchParams = $derived(page.url.searchParams.toString().split('&'));

	let scrollX: number = $state(0);
	let scrollY: number = $state(0);

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme') as Theme;
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};

	afterNavigate(() => scrollTo(scrollX, scrollY));
</script>

<form method="POST" use:enhance={submitUpdateTheme}>
	<button
		aria-label="Toggle theme"
		class="theme-toggler"
		type="submit"
		formaction="/?/setTheme&theme={nextTheme}&redirectTo={path}&searchParams={searchParams}"
		onclick={() => {
			scrollX = window.scrollX;
			scrollY = window.scrollY;
		}}
	>
		<img
			aria-hidden="true"
			class="theme-toggler__icon"
			src="/icons/theme-toggle/to-{nextTheme}.svg"
			alt="theme-toggler-icon"
		/>
	</button>
</form>

<style lang="scss">
	@use '../../scss/components/theme-toggler';
</style>
