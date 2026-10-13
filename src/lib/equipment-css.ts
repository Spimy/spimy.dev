import { gear, loadouts } from './equipment';

function gearRule(id: string) {
  return `
body:has(#eq-${id}:checked) .inspector__card--${id} { display: flex; }
body:has(#eq-${id}:checked) label[for="eq-${id}"] {
	border-color: var(--accent-pop);
	box-shadow: 0.25rem 0.25rem 0 var(--accent-pop);
	background: color-mix(in srgb, var(--accent-pop) 8%, transparent);
}
body:has(#eq-${id}:checked) label[for="eq-${id}"] .tile__lock {
	color: var(--locked);
}
body:has(#eq-${id}:focus-visible) label[for="eq-${id}"] {
	outline: 2px solid var(--accent-pop);
	outline-offset: 2px;
}`;
}

function loadoutRule(id: string) {
  return `
body:has(#ld-${id}:checked) .loadout__block--${id} { display: block; }
body:has(#ld-${id}:checked) label[for="ld-${id}"] {
	color: var(--on-accent);
	background: var(--accent);
}
body:has(#ld-${id}:focus-visible) label[for="ld-${id}"] {
	outline: 2px solid var(--accent-pop);
	outline-offset: 2px;
}`;
}

export const equipmentCss =
  gear.map((item) => gearRule(item.id)).join('\n') +
  loadouts.map((loadout) => loadoutRule(loadout.id)).join('\n');
