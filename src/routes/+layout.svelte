<script lang="ts">
	import '../scss/main.scss';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}

<style lang="scss">
	@use '../scss/layout';
</style>
