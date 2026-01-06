<script>
  export let title, tags, desc;
</script>

<div
  class="card card-compact bg-base-200 border border-base-300 hover:border-primary/50 transition-colors"
>
  <div class="card-body">
    <h2 class="card-title text-base">{title}</h2>
    <p class="text-sm opacity-70">{desc}</p>
    <div class="card-actions mt-2">
      {#each tags as tag}
        <div class="badge badge-outline badge-sm opacity-50">{tag}</div>
      {/each}
    </div>
  </div>
</div>
