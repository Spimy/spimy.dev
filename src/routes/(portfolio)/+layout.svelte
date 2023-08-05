<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../../scss/main.scss';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	$: ({ theme, currentYear } = data);
</script>

<Navbar {theme} />

<main>
	<slot />
</main>

<Footer {currentYear} />

<style lang="scss">
	@use '../../scss/abstracts/mixins' as *;

	main {
		padding-inline: var(--content-padding);
		padding-top: 8rem;
		padding-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 6rem;

		@include mq(small) {
			padding-top: 12rem;
			gap: 12rem;
		}
	}
</style>
