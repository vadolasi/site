<script lang="ts">
	import type { Toc } from "@stefanprobst/rehype-extract-toc"

	const { toc } = $props<{ toc: Toc }>()
	console.log(toc)
</script>

{#if toc && toc.length > 0}
	<nav
		class="sticky top-8 hidden lg:block w-full"
		data-hs-scrollspy="#scrollspy-content"
	>
		<h2
			class="font-bold mb-4 text-sm uppercase tracking-wider text-base-content/70"
		>
			Nesta página
		</h2>
		<ul class="space-y-2 text-sm border-l border-base-300">
			{#each toc as heading}
				<li>
					<a
						href="#{heading.id}"
						class="block pl-4 py-1 border-l-2 border-transparent transition-colors hover:text-primary [&.active]:border-primary [&.active]:text-primary [&.active]:font-medium text-base-content/60"
					>
						{heading.value}
					</a>
					{#if heading.children && heading.children.length > 0}
						<ul class="mt-2 space-y-2">
							{#each heading.children as child}
								<li>
									<a
										href="#{child.id}"
										class="block pl-8 py-1 border-l-2 border-transparent transition-colors hover:text-primary [&.active]:border-primary [&.active]:text-primary [&.active]:font-medium text-base-content/60"
									>
										{child.value}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
{/if}
