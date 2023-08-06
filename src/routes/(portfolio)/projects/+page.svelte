<script lang="ts">
	import ProjectDisplay from '$lib/components/project-display.svelte';
	import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ projects, paginator } = data);
</script>

<section class="projects">
	<h1>Projects</h1>
	<div class="projects__info">
		<div class="projects__info__grid">
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
						href="?page={paginator.currentPage === 1 ? 1 : paginator.currentPage - 1}"
						aria-disabled="false"
						class="projects__info__paginator__item"
					>
						<i><Fa icon={faAngleLeft} /></i>
					</a>
				{/if}

				{#each { length: paginator.pageRange } as _, index (index)}
					<a
						href="?page={index + paginator.pageMin}"
						aria-current={index + paginator.pageMin === paginator.currentPage ? 'page' : undefined}
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
							: paginator.currentPage + 1}"
						aria-disabled="false"
						class="projects__info__paginator__item"
					>
						<i><Fa icon={faAngleRight} /></i>
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@use '../../../scss/pages/projects';
</style>
