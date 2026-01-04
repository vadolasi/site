<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="alternate"
    type="application/atom+xml"
    title="Vitor Daniel Feed"
    href="/atom.xml"
  />
</svelte:head>

{@render children()}
