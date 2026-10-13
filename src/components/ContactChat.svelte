<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';

  interface Fields {
    name: string;
    email: string;
    message: string;
  }

  type Errors = Partial<Record<keyof Fields, string>>;

  /** The part of hCaptcha's script that this chat uses */
  interface HCaptcha {
    render(host: HTMLElement, options: Record<string, unknown>): string;
    execute(
      widgetId: string,
      options: { async: true },
    ): Promise<{ response: string }>;
    reset(widgetId: string): void;
  }

  interface Message {
    id: number;
    from: 'spimy' | 'you' | 'system';
    author: string;
    text: string;
    email?: string;
    status?: 'sending' | 'sent' | 'failed';
  }

  interface Props {
    avatar: string;
    /** hCaptcha site key and if not provided, the form token is the only check. */
    hCaptchaSitekey?: string;
    /** Single-use signed token that proves the form was open for a while */
    token: string;
    limits: { name: number; email: number; message: number };
    /** Keep text and errors after a failed post */
    fields?: Fields;
    errors?: Errors;
    formError?: string;
    /** Set after a successful post without JS */
    sent?: { name: string; message: string } | null;
  }

  let {
    avatar,
    hCaptchaSitekey,
    token: initialToken,
    limits,
    fields: initialFields = { name: '', email: '', message: '' },
    errors: initialErrors = {},
    formError = '',
    sent = null,
  }: Props = $props();

  const GREETING =
    'Hey, thanks for making it this far. Drop your name and email below so I know where to reply, then just say whatever you came to say.';
  const THANKS =
    'Got it, your message is in my inbox. No promises on a reply, but I do read everything.';
  const CAPTCHA_CLOSED =
    'The captcha was not completed, so your message was not sent. Press Retry to try again.';
  const NETWORK_ERROR =
    'Your message could not be sent. Check your connection and try again.';

  let nextId = 0;

  function seed(): Message[] {
    const list: Message[] = [
      { id: nextId++, from: 'spimy', author: 'Spimy', text: GREETING },
    ];
    if (sent) {
      list.push(
        {
          id: nextId++,
          from: 'you',
          author: sent.name,
          text: sent.message,
          status: 'sent',
        },
        { id: nextId++, from: 'spimy', author: 'Spimy', text: THANKS },
      );
    }
    if (formError) {
      list.push({
        id: nextId++,
        from: 'system',
        author: 'System',
        text: formError,
      });
    }
    return list;
  }

  let messages = $state<Message[]>(untrack(() => seed()));
  let fields = $state<Fields>(untrack(() => ({ ...initialFields })));
  let errors = $state<Errors>(untrack(() => ({ ...initialErrors })));
  let token = $state(untrack(() => initialToken));
  let showForm = $state(untrack(() => !sent));
  let sending = $derived(
    messages.some((message) => message.status === 'sending'),
  );

  let log = $state<HTMLElement>();
  let messageInput = $state<HTMLTextAreaElement>();

  // Keep the newest bubble in view, but not on the first render
  let firstRun = true;
  $effect(() => {
    void messages.length;
    if (firstRun) {
      firstRun = false;
      return;
    }
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    tick().then(() =>
      log?.lastElementChild?.scrollIntoView({
        block: 'nearest',
        behavior: calm ? 'auto' : 'smooth',
      }),
    );
  });

  function push(message: Omit<Message, 'id'>): Message {
    messages.push({ id: nextId++, ...message });
    return messages[messages.length - 1];
  }

  function fail(message: Message, text: string) {
    message.status = 'failed';
    push({ from: 'system', author: 'System', text });
  }

  async function send(message: Message, data: FormData) {
    message.status = 'sending';
    messages = messages.filter((m) => m.from !== 'system');

    try {
      const captchaResponse = await captchaToken();
      if (captchaResponse) data.set('h-captcha-response', captchaResponse);
    } catch {
      fail(message, CAPTCHA_CLOSED);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const body = await response.json().catch(() => null);
      // The token that was sent is used up, so every reply brings a new one
      if (body?.token) token = body.token;

      if (response.ok) {
        message.status = 'sent';
        push({ from: 'spimy', author: 'Spimy', text: THANKS });
      } else if (response.status === 422 && body?.errors) {
        // Not a chat message so put the text back and show the field errors
        messages = messages.filter((m) => m !== message);
        fields.message = message.text;
        errors = body.errors;
      } else {
        fail(message, body?.error ?? NETWORK_ERROR);
      }
    } catch {
      fail(message, NETWORK_ERROR);
    }
  }

  function onsubmit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);

    const message = push({
      from: 'you',
      author: fields.name.trim(),
      email: fields.email.trim(),
      text: fields.message.trim(),
      status: 'sending',
    });

    errors = {};
    fields.message = '';
    messageInput?.focus();
    send(message, data);
  }

  function retry(message: Message) {
    const data = new FormData();
    data.set('name', message.author);
    data.set('email', message.email ?? '');
    data.set('message', message.text);
    data.set('form-token', token);
    send(message, data);
  }

  async function again(event: MouseEvent) {
    event.preventDefault();
    showForm = true;
    await tick();
    messageInput?.focus();
  }

  // ---------- hCaptcha  ----------
  // "pending" while the script loads, "unavailable" if it never will
  // then the message goes with the form token alone, exactly as without JS
  let captcha = $state<'pending' | 'ready' | 'unavailable'>(
    untrack(() => (hCaptchaSitekey ? 'pending' : 'unavailable')),
  );
  let captchaHost = $state<HTMLElement>();
  let captchaApi: HCaptcha | undefined;
  let widgetId: string | undefined;
  let captchaLoading: Promise<void> | undefined;

  function loadCaptchaScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('hCaptcha did not load'));
      setTimeout(
        () => reject(new Error('hCaptcha took too long to load')),
        8000,
      );
      document.head.append(script);
    });
  }

  onMount(() => {
    if (!hCaptchaSitekey) return;

    captchaLoading = loadCaptchaScript()
      .then(() => {
        captchaApi = (window as unknown as { hcaptcha: HCaptcha }).hcaptcha;
        widgetId = captchaApi.render(captchaHost!, {
          sitekey: hCaptchaSitekey,
          size: 'invisible',
        });
        captcha = 'ready';
      })
      .catch((error) => {
        console.warn(error);
        captcha = 'unavailable';
      });
  });

  /** A token for this one send, or null when the form token has to do the job alone */
  async function captchaToken(): Promise<string | null> {
    if (captcha === 'pending') await captchaLoading;
    if (captcha !== 'ready' || !captchaApi || widgetId === undefined)
      return null;

    try {
      const { response } = await captchaApi.execute(widgetId, { async: true });
      return response;
    } finally {
      captchaApi.reset(widgetId);
    }
  }

  const statusText = { sending: 'Sending…', sent: 'Sent', failed: 'Not sent' };
</script>

<div class="chat" id="chat">
  <div class="chat__header">
    <div class="chat__avatar">
      <img
        class="chat__avatar-image"
        src={avatar}
        alt=""
        width="38"
        height="38"
      />
    </div>
    <div class="chat__identity">
      <div class="chat__name">Spimy</div>
      <div class="chat__status">
        <span class="chat__status-dot" aria-hidden="true"></span>
        Actively building - willing to relocate
      </div>
    </div>
    <span class="chat__tag">Party Chat</span>
  </div>

  <div
    class="chat__log"
    role="log"
    aria-live="polite"
    aria-relevant="additions"
    bind:this={log}
  >
    {#each messages as message (message.id)}
      <div
        class="bubble"
        class:bubble--you={message.from === 'you'}
        class:bubble--error={message.from === 'system'}
      >
        {#if message.from === 'spimy'}
          <div class="bubble__avatar">
            <img
              class="bubble__avatar-image"
              src={avatar}
              alt=""
              width="26"
              height="26"
            />
          </div>
        {/if}

        <div class="bubble__body">
          <div
            class="bubble__content"
            role={message.from === 'system' ? 'alert' : undefined}
          >
            {message.text}
          </div>

          {#if message.status === 'sending'}
            <div
              class="bubble__progress"
              role="progressbar"
              aria-label="Sending message"
            >
              <span class="bubble__progress-bar"></span>
            </div>
          {/if}

          <div class="bubble__meta">
            <span>{message.author}</span>
            {#if message.status}
              <span
                class="bubble__status"
                class:bubble__status--failed={message.status === 'failed'}
              >
                · {statusText[message.status]}
              </span>
            {/if}
            {#if message.status === 'failed'}
              <button
                type="button"
                class="bubble__retry"
                onclick={() => retry(message)}
              >
                Retry
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if showForm}
    <form class="compose" method="POST" action="/contact#chat" {onsubmit}>
      <div class="compose__meta">
        <div class="compose__field">
          <label class="compose__label" for="cf-name">Name</label>
          <input
            class="compose__input"
            type="text"
            id="cf-name"
            name="name"
            required
            maxlength={limits.name}
            autocomplete="name"
            bind:value={fields.name}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
          />
          {#if errors.name}
            <p class="compose__error" id="cf-name-error">{errors.name}</p>
          {/if}
        </div>

        <div class="compose__field">
          <label class="compose__label" for="cf-email">Email</label>
          <input
            class="compose__input"
            type="email"
            id="cf-email"
            name="email"
            required
            maxlength={limits.email}
            autocomplete="email"
            bind:value={fields.email}
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
          />
          {#if errors.email}
            <p class="compose__error" id="cf-email-error">{errors.email}</p>
          {/if}
        </div>
      </div>

      <input type="hidden" name="form-token" value={token} />

      <div class="compose__captcha" bind:this={captchaHost}></div>

      <div class="compose__trap" aria-hidden="true">
        <label for="cf-website">Leave this empty</label>
        <input
          type="text"
          id="cf-website"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div class="compose__row">
        <div class="compose__message">
          <label class="sr-only" for="cf-message">Message</label>
          <textarea
            class="compose__textarea"
            id="cf-message"
            name="message"
            rows="1"
            placeholder="Type your message…"
            required
            maxlength={limits.message}
            bind:value={fields.message}
            bind:this={messageInput}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'cf-message-error' : undefined}
          ></textarea>
          {#if errors.message}
            <p class="compose__error" id="cf-message-error">{errors.message}</p>
          {/if}
        </div>
        <button type="submit" class="compose__send" disabled={sending}
          >Send</button
        >
      </div>

      <p class="compose__hint">
        Any reply will go to the email you give here.
        {#if captcha !== 'ready'}
          <a href="/privacy">Privacy Policy</a>
        {/if}
      </p>
      {#if captcha === 'ready'}
        <p class="compose__hint">
          This site is protected by hCaptcha and its
          <a href="https://www.hcaptcha.com/privacy">Privacy Policy</a> and
          <a href="https://www.hcaptcha.com/terms">Terms of Service</a> apply,
          except as noted in our <a href="/privacy">Privacy Policy</a>.
        </p>
      {/if}
    </form>
  {:else}
    <p class="chat__again">
      <a href="/contact#chat" onclick={again}>Send another message</a>
    </p>
  {/if}
</div>

<style>
  /* ---------- Chat window ---------- */
  .chat {
    max-width: 35rem;
    margin-top: 1.5rem;
    background: var(--panel);
    border: 2px solid var(--ink);
    box-shadow: 0.5rem 0.5rem 0 var(--accent-pop);
    clip-path: polygon(0 1rem, 1rem 0, 100% 0, 100% 100%, 0 100%);
    scroll-margin-top: 1.5rem;
  }

  .chat__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.125rem;
    background: var(--panel-2);
    border-bottom: 2px solid var(--ink);
  }

  .chat__avatar {
    flex-shrink: 0;
    width: 2.375rem;
    height: 2.375rem;
    overflow: hidden;
    border: 2px solid var(--accent-soft);
  }

  .chat__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transform: scale(1.6) translateY(0.3125rem);
  }

  .chat__identity {
    flex: 1;
    min-width: 0;
  }

  .chat__name {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.8125rem;
    color: var(--text);
  }

  .chat__status {
    display: flex;
    align-items: flex-start;
    gap: 0.3125rem;
    margin-top: 0.125rem;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--accent-soft);
  }

  .chat__status-dot {
    flex-shrink: 0;
    width: 0.375rem;
    height: 0.375rem;
    margin-top: 0.1875rem;
    border-radius: 50%;
    background: var(--ok);
    box-shadow: 0 0 0.375rem var(--ok);
  }

  .chat__tag {
    flex-shrink: 0;
    padding: 0.1875rem 0.4375rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--accent-pop);
    border: 1px solid var(--accent-pop);
  }

  .chat__log {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.125rem 1.125rem 1.375rem;
  }

  .chat__again {
    margin: 0;
    padding: 0 1.125rem 1.25rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  /* ---------- Message bubbles ---------- */
  .bubble {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    scroll-margin-bottom: 5rem;
  }

  .bubble__avatar {
    flex-shrink: 0;
    width: 1.625rem;
    height: 1.625rem;
    overflow: hidden;
    border: 2px solid var(--ink);
  }

  .bubble__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transform: scale(1.6) translateY(0.25rem);
  }

  .bubble__body {
    min-width: 0;
    max-width: 82%;
  }

  .bubble__content {
    padding: 0.625rem 0.875rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--text);
    background: var(--panel-2);
    border: 1px solid var(--ink);
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .bubble__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.3125rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
  }

  .bubble__status--failed {
    color: var(--accent-pop);
  }

  .bubble__retry {
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: var(--accent-soft);
    text-decoration: underline;
    background: none;
    border: 0;
  }

  .bubble--you {
    flex-direction: row-reverse;
  }

  .bubble--you .bubble__body {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .bubble--you .bubble__content {
    background: color-mix(in srgb, var(--accent) 28%, var(--panel-2));
    border-color: var(--accent);
  }

  .bubble--error .bubble__content {
    border-color: var(--accent-pop);
  }

  .bubble__progress {
    position: relative;
    align-self: stretch;
    height: 0.1875rem;
    margin-top: 0.25rem;
    overflow: hidden;
    background: color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .bubble__progress-bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 40%;
    background: var(--accent-pop);
    animation: slide 1.1s ease-in-out infinite;
  }

  @keyframes slide {
    from {
      transform: translateX(-100%);
    }

    to {
      transform: translateX(250%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bubble__progress-bar {
      width: 100%;
      opacity: 0.6;
      animation: none;
    }
  }

  /* ---------- Compose area ---------- */
  .compose {
    padding: 1rem 1.125rem 1.125rem;
    border-top: 2px solid var(--ink);
  }

  .compose__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
  }

  .compose__field {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.3125rem;
    min-width: 8.75rem;
  }

  .compose__label {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.6rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .compose__input,
  .compose__textarea {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text);
    background: var(--panel-2);
    border: 2px solid var(--ink);
  }

  .compose__input {
    padding: 0.5625rem 0.6875rem;
  }

  .compose__textarea {
    width: 100%;
    min-height: 3.25rem;
    padding: 0.6875rem 0.875rem;
    font-size: 0.8125rem;
    resize: vertical;
  }

  .compose__input::placeholder,
  .compose__textarea::placeholder {
    color: var(--text-muted);
  }

  .compose__input:focus,
  .compose__textarea:focus {
    outline: none;
    border-color: var(--accent-soft);
  }

  .compose__input:focus-visible,
  .compose__textarea:focus-visible {
    outline: 2px solid var(--accent-pop);
    outline-offset: 2px;
  }

  .compose__input[aria-invalid='true'],
  .compose__textarea[aria-invalid='true'] {
    border-color: var(--accent-pop);
  }

  .compose__error {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--accent-pop);
  }

  .compose__row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    align-items: flex-start;
  }

  .compose__message {
    display: flex;
    flex: 1 1 14rem;
    flex-direction: column;
    gap: 0.3125rem;
  }

  .compose__send {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 0.4375rem;
    height: 3.25rem;
    padding: 0 1.125rem;
    cursor: pointer;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--on-accent);
    background: var(--accent-pop);
    border: 2px solid var(--ink);
    box-shadow: 0.25rem 0.25rem 0 var(--ink);
  }

  .compose__send::after {
    content: '➤';
    content: '➤' / '';
    font-size: 0.8125rem;
  }

  .compose__send:hover:not(:disabled) {
    transform: translate(-0.125rem, -0.125rem);
    box-shadow: 0.375rem 0.375rem 0 var(--ink);
  }

  .compose__send:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .compose__hint {
    margin: 0.75rem 0 0;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  /* Bots fill this honeypot field, people should never see it */
  .compose__trap {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  /* The tag would squeeze the status line into four lines on a phone */
  @media (max-width: 480px) {
    .chat__tag {
      display: none;
    }
  }

  /* Below 16px, iOS Safari zooms the page when an input is focused
   * It's always Safari that causes a headache 
   */
  @media (max-width: 760px) {
    .compose__input,
    .compose__textarea {
      font-size: 1rem;
    }
  }
</style>
