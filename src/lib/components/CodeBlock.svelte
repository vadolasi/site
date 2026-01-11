<script>
  let { children, ...props } = $props();
  let copied = $state(false);

  const rawCode = decodeURIComponent(props["data-code"] || "");

  async function copy() {
    await navigator.clipboard.writeText(rawCode);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div class="mockup-code">
  <pre {...props}>
		{#if children}
      {@render children()}
    {/if}
	</pre>
</div>
