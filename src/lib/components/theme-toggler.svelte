<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let currentTheme: Theme | undefined;
	export let path: string;

	let nextTheme: Theme;
	$: nextTheme = !currentTheme || currentTheme === 'light' ? 'dark' : 'light';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme') as Theme;
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};
</script>

<form method="POST" use:enhance={submitUpdateTheme}>
	<button
		aria-label="Toggle theme"
		class="theme-toggler"
		type="submit"
		formaction="/?/setTheme&theme={nextTheme}&redirectTo={path}"
	>
		<img
			aria-hidden="true"
			class="theme-toggler__icon"
			src="/icons/theme-toggle/to-{nextTheme}.svg"
			alt="theme-toggler-icon"
		/>
	</button>
</form>
