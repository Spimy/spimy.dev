<script lang="ts">
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import ProjectDisplay from '$lib/components/project-display.svelte';
	import { pages } from '$lib/global';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { fly } from 'svelte/transition';
	import type { PageServerData } from './$types';

	const animationConstant = 200;
	const animationDuration = 300;
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

	onMount(() => {
		// Close the select box if it is opened and somewhere else was clicked
		document.addEventListener('click', (event) => {
			if (checked) {
				const clickedElement = event.target as HTMLElement;

				const isLabel = clickedElement.tagName.toLowerCase() === 'label';
				const isTechToggle = clickedElement.getAttribute('for') === 'technologies-toggle';

				const isFilter = clickedElement.parentElement?.className.startsWith('projects__filter');
				if ((isLabel && isTechToggle) || isFilter) return;

				checked = false;
			}
		});
	});

	const contactPath = pages.find((page) => page.id == 'contact')?.path;

	export let data: PageServerData;
	$: ({ projects, paginator, technologies, searchParams } = data);
	$: technologiesQuery = $page.url.searchParams.get('technologies');
	$: technologiesParam = technologiesQuery ? `&technologies=${technologiesQuery}` : '';

	const title = "Spimy's Portfolio - Projects";
	const description =
		'View all or filter projects that I have created based on technologies I have used to develop them.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="http://www.spimy.dev" />

	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<section class="projects">
	<h1>Projects</h1>

	<form
		method="POST"
		action="?/filterProjects"
		class="projects__filter"
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
		<div class="projects__filter__items">
			{#each technologies as technology}
				<div class="projects__filter__items__group">
					<input
						type="checkbox"
						name={technology.name}
						id={technology.name}
						checked={technologiesQuery?.split(',').includes(technology.name) ?? false}
					/>
					<label for={technology.name} class="projects__filter__items__group__label">
						<img src={technology.icon} alt="{technology.name}'s logo" />
						{technology.name}
					</label>
				</div>
			{/each}
		</div>

		<button type="submit" class="btn btn--invert">Filter</button>

		{#if technologiesQuery}
			<a href="?page=1" class="btn btn--invert">Clear Filter</a>
		{/if}
	</form>

	{#if projects.length === 0}
		<div class="projects__no-projects">
			{#if technologiesQuery && technologiesQuery.split(',').length > 0}
				<h2>No projects found with the filters provided.</h2>
				<p>
					This could be because I decided not to put the project I created using this technology or
					technology overlaps one another such as TypeScript and JavaScript or SCSS and CSS.
				</p>
				<p>
					There are various reasons why I decide not to put up a project on display on my portfolio
					but the following reasons are the most common:
				</p>
				<ol>
					<li>
						The project is not a web application and/or cannot be showcased through a link to it;
					</li>
					<li>
						The project is too old and has dependency issues and/or cannot run on newer versions of
						Ubuntu (the Linux distro hosting most of my projects).
					</li>
				</ol>
				<p>If you wish to see them, <a href={contactPath}>please contact me.</a></p>
			{:else}
				<h2>No projects have been uploaded yet.</h2>
			{/if}
		</div>
	{:else}
		{#key searchParams}
			<div class="projects__info">
				<div
					class="projects__info__grid"
					in:fly={{ x: inX, duration: animationDuration, delay: animationDuration }}
					out:fly={{ x: outX, duration: animationDuration }}
				>
					{#each projects as project, index (index)}
						<ProjectDisplay {project} />
					{/each}
				</div>
				{#if paginator.pageCount > 1}
					<div class="projects__info__paginator">
						<div class="sr-only">Paginator</div>
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
								<span class="sr-only">Page</span>
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
