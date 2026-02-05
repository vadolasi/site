<script lang="ts">
	import { Mail, CheckCircle, AlertCircle } from "@lucide/svelte"

	let email = $state("")
	let isLoading = $state(false)
	let status: "idle" | "success" | "error" = $state("idle")
	let message = $state("")

	async function handleSubscribe(e: SubmitEvent) {
		e.preventDefault()
		isLoading = true
		status = "idle"

		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			})

			const data = (await response.json()) as {
				success?: boolean
				message?: string
			}

			if (response.ok && data.success) {
				status = "success"
				message = "Email adicionado com sucesso! 🎉"
				email = ""
			} else {
				status = "error"
				message = data.message || "Erro ao adicionar email. Tente novamente."
			}
		} catch (error) {
			status = "error"
			message = "Erro na conexão. Tente novamente mais tarde."
			console.error(error)
		} finally {
			isLoading = false
		}
	}
</script>

<div class="bg-base-200 p-8 rounded-xl border border-base-300 not-prose">
	<div class="flex items-start gap-4 mb-4">
		<Mail class="text-primary flex-shrink-0 mt-1" size={24} />
		<div>
			<h3 class="font-bold text-lg text-base-content">Newsletter</h3>
			<p class="text-sm text-base-content/60">
				Receba novos artigos diretamente no seu email
			</p>
		</div>
	</div>

	<form onsubmit={handleSubscribe} class="space-y-3">
		<div class="flex flex-col sm:flex-row gap-2">
			<input
				type="email"
				placeholder="seu.email@exemplo.com"
				bind:value={email}
				required
				disabled={isLoading}
				class="input input-bordered input-sm flex-1 {status === 'error'
					? 'input-error'
					: ''}"
			/>
			<button
				type="submit"
				disabled={isLoading || !email}
				class="btn btn-primary btn-sm w-full sm:w-auto"
			>
				{#if isLoading}
					<span class="loading loading-spinner loading-xs"></span>
					Enviando...
				{:else}
					Inscrever-se
				{/if}
			</button>
		</div>

		{#if message}
			<div
				class="flex items-center gap-2 p-3 rounded-lg text-sm {status ===
				'success'
					? 'bg-success/10 text-success'
					: 'bg-error/10 text-error'}"
			>
				{#if status === "success"}
					<CheckCircle size={18} />
				{:else}
					<AlertCircle size={18} />
				{/if}
				<span>{message}</span>
			</div>
		{/if}
	</form>
</div>
