<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
</script>

<svelte:head>
	<title>Spimy's Portfolio - Home</title>
</svelte:head>

<section class="hero">
	<div class="hero__avatar"><Avatar /></div>
	<div class="hero__info">
		<h1>Hi there!</h1>
		<h2>I'm Spimy</h2>
		<p>
			At least that's the username that I've grown quite fond of. My name is actually William and I
			am 20 years old. Coding since 2016 (~7 years of experience) and I got into programming for
			trying to code a <a href="https://spigotmc.org" rel="external" target="_blank"
				>Spigot plugin</a
			>
			for
			<a href="https://minecraft.net" rel="external" target="_blank">Minecraft</a>; making Java my
			first programming language.
		</p>
	</div>
</section>

<style lang="scss">
	@use '../scss/pages/home';
</style>
