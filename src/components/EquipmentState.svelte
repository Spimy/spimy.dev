<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    loadouts: { id: string; gear: string[] }[];
    gear: string[];
  }

  let { loadouts, gear }: Props = $props();

  let openLoadout = $state(untrack(() => loadouts[0]?.id ?? ''));
  let selectedGear = $state('close');

  $effect(() => {
    // Only react to the selected gear, not to the user switching tabs
    const owners = loadouts.filter((loadout) =>
      loadout.gear.includes(selectedGear),
    );
    if (owners.length === 0) return;
    if (owners.some((loadout) => loadout.id === untrack(() => openLoadout)))
      return;
    openLoadout = owners[0].id;
  });
</script>

{#each loadouts as loadout}
  <input
    class="state-checkbox"
    type="radio"
    name="loadout"
    id="ld-{loadout.id}"
    value={loadout.id}
    bind:group={openLoadout}
  />
{/each}

<input
  class="state-checkbox"
  type="radio"
  name="gear"
  id="eq-close"
  value="close"
  bind:group={selectedGear}
/>
{#each gear as id}
  <input
    class="state-checkbox"
    type="radio"
    name="gear"
    id="eq-{id}"
    value={id}
    bind:group={selectedGear}
  />
{/each}
