<script module>
  import pre from "./CodeBlock.svelte";

  export { pre };
</script>

<script>
  let { children } = $props();
</script>

{@render children()}
