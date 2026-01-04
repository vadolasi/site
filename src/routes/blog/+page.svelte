<script lang="ts">
  const { data } = $props();
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Blog</h1>
  <div class="grid gap-6">
    {#each data.posts as post}
      <a
        href="/blog/{post.slug}"
        class="block p-6 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group"
      >
        <article>
          <h2
            class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"
          >
            {post.title}
          </h2>
          {#if post.description}
            <p class="text-base-content/70">{post.description}</p>
          {/if}
        </article>
      </a>
    {/each}
  </div>
</div>
