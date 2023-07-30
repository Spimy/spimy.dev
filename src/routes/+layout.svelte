<script lang="ts">
	import '../scss/main.scss';
	import type { LayoutServerData } from './$types';
	import Navbar from '$lib/components/navbar.svelte';

	export let data: LayoutServerData;
</script>

<Navbar {data} />
<slot />
