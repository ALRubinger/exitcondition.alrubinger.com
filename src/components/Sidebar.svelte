<script lang="ts">
  import { onMount } from 'svelte';
  import Home from '@lucide/svelte/icons/home';
  import FileText from '@lucide/svelte/icons/file-text';

  type PostEntry = {
    slug: string;
    href: string;
    title: string;
    date: string; // ISO string — Date doesn't survive serialization to client components
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

  const homeActive = $derived(isActive('/'));

  // Group posts by year for the sidebar. Posts arrive pre-sorted newest-first
  // from the page, so iteration order produces year buckets in descending
  // order without an extra sort here.
  const grouped = $derived.by(() => {
    const buckets = new Map<number, PostEntry[]>();
    for (const p of posts) {
      const year = new Date(p.date).getFullYear();
      const arr = buckets.get(year);
      if (arr) arr.push(p);
      else buckets.set(year, [p]);
    }
    return Array.from(buckets.entries());
  });
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
      <!-- Home link -->
      <a
        href="/"
        class="group flex items-center gap-2 py-1.5 px-2 rounded text-sm no-underline
          {homeActive ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/70'}"
        onclick={() => (mobileOpen = false)}
      >
        <Home size={16} class="shrink-0 transition-transform duration-150 {homeActive ? 'scale-125' : 'group-hover:scale-125'}" />
        Home
      </a>

      <!-- Posts grouped by year -->
      {#each grouped as [year, entries] (year)}
        <div class="rounded border border-border bg-card shadow-low">
          <div class="flex items-center gap-2 py-1.5 px-2 text-sm font-medium select-none text-foreground">
            <FileText size={16} class="shrink-0" />
            {year}
          </div>
          <div class="ml-2 pl-2">
            {#each entries as post (post.slug)}
              <a
                href={post.href}
                class="block py-1 px-2 rounded text-sm no-underline
                  {isActive(post.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/70'}"
                onclick={() => (mobileOpen = false)}
              >
                {post.title}
              </a>
            {/each}
          </div>
        </div>
      {/each}

      {#if posts.length === 0}
        <div class="text-sm text-muted-foreground px-2">No posts yet.</div>
      {/if}
    </nav>
  </div>
</aside>
