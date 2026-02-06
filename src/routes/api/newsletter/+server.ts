import { json } from "@sveltejs/kit"
import { Resend } from "resend"
import { env } from "$env/dynamic/private"
import type { RequestHandler } from "./$types"

const resend = new Resend(env.RESEND_API_KEY)

const SEGMENT_ID = "ad969e46-1811-4c6d-9bd3-6d075024926d"

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = (await request.json()) as { email: string }

		if (!email || !email.includes("@")) {
			return json(
				{ success: false, message: "Email inválido" },
				{ status: 400 }
			)
		}

		const { data, error: createError } = await resend.contacts.create({
			email: "steve.wozniak@gmail.com",
			unsubscribed: false
		})

		if (createError) {
			console.error("Resend create contact error:", createError)
			return json(
				{ success: false, message: "Erro ao criar contato na newsletter" },
				{ status: 500 }
			)
		}

		const { error } = await resend.contacts.segments.add({
			contactId: data.id,
			segmentId: SEGMENT_ID
		})

		if (error) {
			console.error("Resend error:", error)
			return json(
				{ success: false, message: "Erro ao adicionar email à newsletter" },
				{ status: 500 }
			)
		}

		return json({ success: true, message: "Email adicionado com sucesso!" })
	} catch (error) {
		console.error("Newsletter API error:", error)
		return json(
			{ success: false, message: "Erro interno do servidor" },
			{ status: 500 }
		)
	}
}
