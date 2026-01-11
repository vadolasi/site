---
title: Crie seu próprio N8N - Parte 1
description: Aprenda a criar sua própria plataforma de automação similar ao N8N
keywords: ["automação", "workflows", "inteligência artificial", "open source"]
draft: true
---

# Introdução

Você provavelmente já deve ter pelo menos ouvido falar do n8n, e de outras plataformas como Make e Zapier. Automações e agentes de IA são a tendência do momento.

Nesse cenário, resolvi tentar criar a minha própria plataforma de automações, similar a soluções já existentes, mas com algumas características e funcionalidades própias, como a possibilidade de executar as automações em um ambiente serverless, como o Cloudflare Workers (falarei mais sobre isso em um futuro artigo).

# Em busca da solução

Quando você vai construir um e-commerce, você não começa do absoluto zero. Com isso em mente eu procurei por soluções open source que pudessem me atender. A maioria das soluções que encontrei eram soluções prontas que não permitiam muita modificação ou dependiam de um serviço externo. Depender de um serviço, seja api, banco de dados, etc dificulta muito ou até impede a execução em ambientes serverless. Algumas soluções, como o n8n, embora tenham o código disponível, tem restrições quanto ao uso.

<details>
  <summary>O n8n é Open Source?</summary>

Não. Segundo o [própia documentação do n8n](https://docs.n8n.io/sustainable-use-license/#is-n8n-open-source):

> Embora o código-fonte do n8n esteja disponível sob a Sustainable Use License, a [Open Source Initiative](https://opensource.org) (OSI) estabelece que licenças de código aberto não podem incluir limitações de uso; por isso, não nos rotulamos como open source. Na prática, o n8n oferece à maioria dos usuários muitos dos mesmos benefícios de uma licença aprovada pela OSI.

Você não pode usar o código deles para oferecer um serviço de automação pago (SaaS) a terceiros. Basicamente, você não pode criar um concorrente direto para o n8n (que é o que eu quero fazer). Essa limitação o impede de ser Open Source, mesmo que o código esteja disponível publicamente.

</details>

Mas encontrei algumas promissoras, como o [Workflow Builder](https://workflow-builder.dev) construido em cima do [Workflow DevKit](https://useworkflow.dev) da [Vercel](https://vercel.com), e [Workflow Kit](https://www.inngest.com/docs/reference/workflow-kit) da [Inggest](https://www.inngest.com). Ambas bastante recentes, e parecem ser soluçães robustas para facilitar tanto a construção do backend quanto do frontend. Mas ambas depende de serviços externos, e além disso incentivam a usar os serviços de nuvem deles.

Também encontrei algumas bibliotecas Open Source, como o [fluxo-engine](https://github.com/Aldrie/fluxo-engine), [flowed](https://github.com/danielduarte/flowed) e [js-functions-orchestrator](https://github.com/damianofalcioni/js-functions-orchestrator). Essas são bem próximas do que eu queria. Me inspirei bastante especialmente na fluxo-engine, pegando emprestado alguns conceitos deles, mas fiz uma versão bem mais simples.

# A solução

Baseado na arquitetura dessas bibliotecas, resolvi desenvolver a minha própia. Algo bem mais simples, sem algoritmos de grafos, com algumas caracteristicas que acho que faltaram nas outras, como os workflows definidos enquanto nodes e edges, sendo um objeto bem próximo de um JSON, a geração de um estado completo em cada etapa, estado serializado que permite retormar a execução a qualquer momento.

## Os desafios

# Mão na massa

_OBS: O refluxo ainda está em desenvolvimento, sem uma versão 1.0 definitiva, as coisas podem mudar, mas vou atualizando aqui caso necessário_

Primeiro, vamos instalar os pacotes. Utilize o gerenciador de pacotes de sua preferência.

```bash
pnpm add @refluxo/core @refluxo/jexl-middleware @refluxo/standard-schema-middleware valibot
```

Como nesse exemplo vamos utilizar Typescript, vou instalar o `sucrase`, que converte código Typescript em Javascript. Se você estiver utilizando o Bun ou Deno, pode pular essa parte.

```bash
pnpm add -D sucrase
```

## Entendendo os módulos

### @refluxo/core

O motor de execução. O core foi feito para ser bastante simples e fléxivel, permitindo que ele seja extendido através de middlewares.

### @refluxo/jexl-middleware

Permite executar expressões, de maneira [similar ao n8n](https://docs.n8n.io/code/expressions/), as expressões permitem passar valores para os nodes dinâmicamente.

### @refluxo/standard-schema-middleware

Permite definir schemas estritos da entrada dos nodes, usando bibliotecas como `zod`, `arktype`, `typebox` ou qualquer outra compatível com o [Standard Schema](https://standardschema.dev). Nesse tutorial, userei o `valibot`.

## Definindo os nodes

Os nodes são basicamente funções, com alguns metadados adicionais, como o schema de entrada e saída. Vamos criar um node simples que faz uma requisição HTTP, començando pelo schema.

```ts twoslash title="index.ts"
import * as v from "valibot"

const httpRequestNodeInputSchema = v.object({
	url: v.string(),
	method: v.union([
		v.literal("GET"),
		v.literal("POST"),
		v.literal("PUT"),
		v.literal("PATCH"),
		v.literal("DELETE")
	]),
	headers: v.optional(v.record(v.string(), v.string())),
	body: v.optional(v.string())
})

const httpRequestNodeOutputSchema = v.object({
	statusCode: v.number(),
	headers: v.record(v.string(), v.string()),
	body: v.string()
})
```

Agora, vamos definir o node em si, utilizando o schema que acabamos de criar.

```ts twoslash title="index.ts" ins={1-4,26-44,"Retornar o resultado dentro da propriedade data é obrigatório":45,46-54} collapse={8-17,21-23}
import {
	createStandardSchemaMiddleware,
	type StandardSchemaNodeDefinition
} from "@refluxo/standard-schema-middleware"
import * as v from "valibot"

const httpRequestNodeInputSchema = v.object({
	url: v.string(),
	method: v.union([
		v.literal("GET"),
		v.literal("POST"),
		v.literal("PUT"),
		v.literal("PATCH"),
		v.literal("DELETE")
	]),
	headers: v.optional(v.record(v.string(), v.string())),
	body: v.optional(v.string())
})

const httpRequestNodeOutputSchema = v.object({
	statusCode: v.number(),
	headers: v.record(v.string(), v.string()),
	body: v.string()
})

const httpRequestNodeDefinition: StandardSchemaNodeDefinition<
	v.InferInput<typeof httpRequestNodeInputSchema>,
	v.InferOutput<typeof httpRequestNodeOutputSchema>
> = {
	metadata: {
		input: httpRequestNodeInputSchema,
		output: httpRequestNodeOutputSchema
	},
	executor: async (input) => {
		const response = await fetch(input.url, {
			method: input.method,
			...(input.headers ? { headers: input.headers } : {}),
			...(input.body ? { body: input.body } : {})
		})
		const responseBody = await response.text()
		const responseHeaders: Record<string, string> = {}
		response.headers.forEach((value, key) => {
			responseHeaders[key] = value
		})

		return {
			data: {
				statusCode: response.status,
				headers: responseHeaders,
				body: responseBody
			}
		}
	}
}
```

## Montando o workflow

Agora que já temos um node, podemos montar um workflow simples que faz uma requisição HTTP e imprime o resultado no console.

```ts twoslash title="index.ts" ins={1-2,58-66} collapse={9-57}
import { WorkflowEngine } from "@refluxo/core"
import { createJexlMiddleware } from "@refluxo/jexl-middleware"
import {
	createStandardSchemaMiddleware,
	type StandardSchemaNodeDefinition
} from "@refluxo/standard-schema-middleware"
import * as v from "valibot"

const httpRequestNodeInputSchema = v.object({
	url: v.string(),
	method: v.union([
		v.literal("GET"),
		v.literal("POST"),
		v.literal("PUT"),
		v.literal("PATCH"),
		v.literal("DELETE")
	]),
	headers: v.optional(v.record(v.string(), v.string())),
	body: v.optional(v.string())
})

const httpRequestNodeOutputSchema = v.object({
	statusCode: v.number(),
	headers: v.record(v.string(), v.string()),
	body: v.string()
})

const httpRequestNodeDefinition: StandardSchemaNodeDefinition<
	v.InferInput<typeof httpRequestNodeInputSchema>,
	v.InferOutput<typeof httpRequestNodeOutputSchema>
> = {
	metadata: {
		input: httpRequestNodeInputSchema,
		output: httpRequestNodeOutputSchema
	},
	executor: async (input) => {
		const response = await fetch(input.url, {
			method: input.method,
			...(input.headers ? { headers: input.headers } : {}),
			...(input.body ? { body: input.body } : {})
		})
		const responseBody = await response.text()
		const responseHeaders: Record<string, string> = {}
		response.headers.forEach((value, key) => {
			responseHeaders[key] = value
		})

		return {
			// Passar o resultado dentro da propriedade "data" é obrigatório
			data: {
				statusCode: response.status,
				headers: responseHeaders,
				body: responseBody
			}
		}
	}
}

const workflowEngine = new WorkflowEngine({
	nodeDefinitions: {},
	workflow: {
		nodes: [],
		edges: []
	},
	middlewares: [createJexlMiddleware(), createStandardSchemaMiddleware()]
})
```
