<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Theme } from '$lib/types/theme';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let currentTheme: Theme | undefined;

	let nextTheme: Theme;
	$: nextTheme = !currentTheme || currentTheme === 'light' ? 'dark' : 'light';
	$: path = $page.url.pathname;
	$: searchParams = $page.url.searchParams.toString().split('&');

	let scrollX: number = 0;
	let scrollY: number = 0;

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
		on:click={() => {
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
