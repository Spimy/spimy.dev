<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    /** False when no contact address is configured, so there is nothing to show */
    canReveal: boolean;
    /** The address, only when the server was given a valid token */
    email: string | null;
    /** Token for the "Show email" link */
    revealToken: string;
    /** The link had a token, but it was too old or not valid */
    expired?: boolean;
    links: { label: string; href: string }[];
  }

  let {
    canReveal,
    email: initialEmail,
    revealToken,
    expired = false,
    links,
  }: Props = $props();

  let email = $state<string | null>(untrack(() => initialEmail));
  let expiredNote = $state(untrack(() => expired));
  let busy = false;

  // Without JS this is a plain link that reloads the page with or without the address
  // With JS, the address is fetched and shown in place, so a message that is half written is not lost to a reload
  const showHref = $derived(`/contact?reveal=${revealToken}#links`);
  const hideHref = '/contact#links';

  async function toggle(event: MouseEvent) {
    event.preventDefault();
    if (busy) return;

    if (email) {
      email = null;
      return;
    }

    busy = true;
    expiredNote = false;
    try {
      const response = await fetch(
        `/api/email?reveal=${encodeURIComponent(revealToken)}`,
      );
      const body = await response.json().catch(() => null);
      if (!response.ok || typeof body?.email !== 'string')
        throw new Error('expired');
      email = body.email;
    } catch {
      // The full page shows the "expired" note and a fresh link
      window.location.href = showHref;
    } finally {
      busy = false;
    }
  }
</script>

<ul class="menu" id="links" role="list">
  {#if canReveal}
    <li>
      <a
        class="menu__link"
        href={email ? hideHref : showHref}
        rel="nofollow"
        aria-controls="email"
        aria-expanded={email !== null}
        onclick={toggle}
      >
        {email ? 'Hide email' : 'Show email'}
      </a>
    </li>
  {/if}
  {#each links as link (link.href)}
    <li>
      <a class="menu__link menu__link--secondary" href={link.href}
        >{link.label}</a
      >
    </li>
  {/each}
</ul>

<p class="menu__email" id="email" hidden={!email}>
  {#if email}
    <a class="menu__email-link" href={`mailto:${email}`}>{email}</a>
  {/if}
</p>

{#if expiredNote}
  <p class="menu__note" role="status">
    That link expired. Press Show email again.
  </p>
{/if}

<style>
  .menu {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.25rem 0 0;
    padding: 0;
    list-style: none;
  }

  .menu__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem 0.75rem 1rem;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.03em;
    text-decoration: none;
    text-transform: uppercase;
    color: var(--on-accent);
    background: var(--accent);
    border: 2px solid var(--ink);
    box-shadow: 0.25rem 0.25rem 0 var(--ink);
  }

  .menu__link::before {
    content: '▶';
    content: '▶' / '';
    font-size: 0.5625rem;
  }

  .menu__link--secondary {
    color: var(--text);
    background: var(--panel-2);
  }

  .menu__link:hover {
    transform: translate(-0.125rem, -0.125rem);
    box-shadow: 0.375rem 0.375rem 0 var(--ink);
  }

  .menu__email {
    margin: 0.5rem 0 0;
    padding-left: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--text-muted);
    border-left: 2px solid var(--accent);
    overflow-wrap: anywhere;
  }

  .menu__email-link {
    color: var(--accent-soft);
    text-decoration-color: color-mix(
      in srgb,
      var(--accent-soft) 50%,
      transparent
    );
    text-underline-offset: 0.25em;
  }

  .menu__email-link:hover {
    color: var(--text);
  }

  .menu__note {
    margin: 0.75rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }
</style>
