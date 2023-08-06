<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../../scss/main.scss';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	$: ({ theme, currentYear } = data);
</script>

<noscript>
	<input type="checkbox" id="close-noscript" name="close-noscript" class="btn btn--invert" />
	<label for="close-noscript" class="btn btn--invert">X</label>
	<div>Enable JavaScript for the best experience while using this portfolio.</div>
</noscript>

<Navbar {theme} />

<main>
	<slot />
</main>

<Footer {currentYear} />

<style lang="scss">
	@use '../../scss/layout/portfolio';
</style>
