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
	<div>
		<p>Enable JavaScript for the best experience while using this portfolio.</p>
		<p>
			JavaScript <b><u><em>must</em></u></b> be enabled to use the contact form on the contact page.
		</p>
	</div>
</noscript>

<Navbar {theme} />

<main>
	<slot />
</main>

<Footer {currentYear} />

<style lang="scss">
	@use '../../scss/layout/portfolio';
</style>
