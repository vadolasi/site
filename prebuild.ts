/**
 * Script para gerar dados estáticos antes do build
 * Executado via npm hook antes de vite build
 */
import { generateSeriesJson } from "./src/lib/server/generate-series.ts"

async function prebuild() {
	console.log("📝 Generating static data...")
	try {
		await generateSeriesJson()
		console.log("✓ Prebuild complete")
	} catch (error) {
		console.error("✗ Prebuild failed:", error)
		process.exit(1)
	}
}

prebuild()
