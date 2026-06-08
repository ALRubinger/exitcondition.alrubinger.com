<script lang="ts">
  import { onMount } from 'svelte';
  import FileText from '@lucide/svelte/icons/file-text';
  import Calendar from '@lucide/svelte/icons/calendar';

  type PostEntry = {
    slug: string;
    href: string;
    title: string;
    date: string; // ISO string — Date doesn't survive serialization to client components
    displayDate: string; // Pre-formatted date string from the server
  };

  let {
    currentPath = '',
    posts = [] as PostEntry[],
  }: { currentPath?: string; posts?: PostEntry[] } = $props();

  let mobileOpen = $state(false);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  function isActive(href: string): boolean {
    return currentPath === href || currentPath === href + '/';
  }

  // Posts root: matches /posts and /posts/ exactly. Specific post pages
  // get their own highlight on the post link below, so the root stays
  // unhighlighted when reading any individual post.
  const postsHomeActive = $derived(isActive('/posts'));
</script>

<!-- Mobile toggle button -->
<button
  class="fixed top-4 left-3 z-50 p-2 rounded-md bg-background border border-border opacity-100 visible translate-x-0 transition-[opacity,visibility,translate] duration-200 lg:opacity-0 lg:invisible lg:-translate-x-12"
  onclick={() => (mobileOpen = !mobileOpen)}
  aria-label="Toggle navigation"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    {#if mobileOpen}
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    {:else}
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    {/if}
  </svg>
</button>

<!-- Backdrop for mobile -->
{#if mobileOpen}
  <div
    class="lg:hidden fixed inset-0 z-30 bg-black/50"
    onclick={() => (mobileOpen = false)}
    onkeydown={(e) => { if (e.key === 'Escape') mobileOpen = false; }}
    role="button"
    tabindex="-1"
    aria-label="Close navigation"
  ></div>
{/if}

<!-- Sidebar -->
<aside
  class="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-80 shrink-0 border-r border-border bg-muted shadow-low transition-transform duration-200
    {mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]"
  style="background-image: var(--pattern-sidebar); background-repeat: repeat;"
>
  <div class="p-4 flex flex-col h-full">
    <nav
      class="flex-1 min-h-0 overflow-y-auto pr-4 -mr-4 flex flex-col gap-4 {mounted ? 'visible' : 'invisible'}"
      aria-label="Blog posts"
    >
      <!-- Thoughts: blog index link + flat list of posts, newest first -->
      <div class="rounded border border-border bg-card shadow-low">
        <a
          href="/posts/"
          class="group flex items-center gap-2 py-1.5 px-2 rounded text-sm font-medium no-underline
            {postsHomeActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:text-accent-foreground hover:bg-accent/70'}"
          onclick={() => (mobileOpen = false)}
        >
          <FileText size={16} class="shrink-0 transition-transform duration-150 {postsHomeActive ? 'scale-125' : 'group-hover:scale-125'}" />
          Thoughts
        </a>
        {#if posts.length > 0}
          <div class="ml-2 pl-2">
            {#each posts as post (post.slug)}
              <a
                href={post.href}
                class="block py-1.5 px-2 rounded no-underline
                  {isActive(post.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/70'}"
                onclick={() => (mobileOpen = false)}
              >
                <div class="text-sm leading-tight">{post.title}</div>
                <div class="text-xs opacity-70 mt-0.5">{post.displayDate}</div>
              </a>
            {/each}
          </div>
        {/if}
      </div>

      {#if posts.length === 0}
        <div class="text-sm text-muted-foreground px-2">No posts yet.</div>
      {/if}
    </nav>

    <!-- Book-a-call CTA: opens the Google Calendar appointment page directly,
         styled to fit the site theme rather than the default Google embed. -->
    <a
      href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0due3tfhNZobPoGzpCoUnKo3rLe5C0K_BnAWbLf41Kv7ZoK4UeweVCll-eRHBNu9GWzjT3d8re?gv=true"
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0 mt-4 flex items-center gap-2 py-2.5 px-3 rounded-md border border-border bg-primary text-primary-foreground text-sm font-medium no-underline shadow-low hover:opacity-90 transition-opacity"
      onclick={() => (mobileOpen = false)}
    >
      <Calendar size={16} class="shrink-0" />
      Book ALR for Customer Discovery
    </a>
  </div>
</aside>
