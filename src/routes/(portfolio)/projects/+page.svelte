<script lang="ts">
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import ProjectDisplay from '$lib/components/project-display.svelte';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fly } from 'svelte/transition';
	import type { PageServerData } from './$types';

	const animationConstant = 200;
	let inX: number;
	let outX: number;
	let checked: boolean = false; // Filter selection box toggle

	beforeNavigate(({ from, to }) => {
		const initialPage = Number(from?.url.searchParams.get('page') ?? 1);
		const newPage = Number(to?.url.searchParams.get('page') ?? 1);

		if (initialPage > newPage) {
			inX = -animationConstant;
			outX = animationConstant;
		} else {
			inX = animationConstant;
			outX = -animationConstant;
		}

		checked = false;
	});

	export let data: PageServerData;
	$: ({ projects, paginator, technologies } = data);
	$: technologiesQuery = $page.url.searchParams.get('technologies');
	$: technologiesParam = technologiesQuery ? `&technologies=${technologiesQuery}` : '';
</script>

<svelte:head>
	<title>Spimy's Portfolio - Projects</title>
</svelte:head>

<section class="projects">
	<h1>Projects</h1>
	<form
		method="POST"
		action="?/filterProjects"
		use:enhance={() => {
			checked = false; // Close the selection box on form submission
		}}
	>
		<input type="checkbox" name="technologies-toggle" id="technologies-toggle" bind:checked />
		<label for="technologies-toggle">
			{#if technologiesQuery}
				Filter: {technologiesQuery.split(',').join(', ')}
			{:else}
				Filter Technologies
			{/if}
		</label>
		<select name="technologies" id="technologies" size={technologies.length} multiple>
			{#each technologies as technology}
				<option
					value={technology.name}
					selected={technologiesQuery?.split(',').includes(technology.name) ?? false}
				>
					<img src={technology.icon} alt="{technology.name}'s logo" />
					{technology.name}
				</option>
			{/each}
		</select>
		<button type="submit" class="btn btn--invert">Filter</button>
	</form>

	{#if projects.length === 0}
		<h2>No projects found with the filters provided.</h2>
	{:else}
		{#key $page.url}
			<div class="projects__info">
				<div
					class="projects__info__grid"
					in:fly={{ x: inX, duration: 300, delay: 300 }}
					out:fly={{ x: outX, duration: 300 }}
				>
					{#each projects as project}
						<ProjectDisplay {project} />
					{/each}
				</div>
				{#if paginator.pageCount > 1}
					<div class="projects__info__paginator">
						{#if paginator.currentPage === 1}
							<button aria-disabled="true" class="projects__info__paginator__item" disabled>
								<i><Fa icon={faAngleLeft} /></i>
							</button>
						{:else}
							<a
								href="?page={paginator.currentPage === 1
									? 1
									: paginator.currentPage - 1}{technologiesParam}"
								aria-disabled="false"
								class="projects__info__paginator__item"
							>
								<i><Fa icon={faAngleLeft} /></i>
							</a>
						{/if}

						{#each { length: paginator.pageRange } as _, index (index)}
							<a
								href="?page={index + paginator.pageMin}{technologiesParam}"
								aria-current={index + paginator.pageMin === paginator.currentPage
									? 'page'
									: undefined}
								aria-disabled="false"
								class="projects__info__paginator__item"
							>
								{index + paginator.pageMin}
							</a>
						{/each}

						{#if paginator.currentPage === paginator.pageCount}
							<button aria-disabled="true" class="projects__info__paginator__item" disabled>
								<i><Fa icon={faAngleRight} /></i>
							</button>
						{:else}
							<a
								href="?page={paginator.currentPage === paginator.pageCount
									? paginator.pageCount
									: paginator.currentPage + 1}{technologiesParam}"
								aria-disabled="false"
								class="projects__info__paginator__item"
							>
								<i><Fa icon={faAngleRight} /></i>
							</a>
						{/if}
					</div>
				{/if}
			</div>
		{/key}
	{/if}
</section>

<style lang="scss">
	@use '../../../scss/pages/projects';
</style>
