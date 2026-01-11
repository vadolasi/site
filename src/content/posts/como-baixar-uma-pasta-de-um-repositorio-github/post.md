---
title: Como baixar uma única pasta de um repositório no GitHub
description: Aprenda a baixar apenas uma pasta específica de um repositório no GitHub, sem precisar clonar todo o repositório.
keywords: ["git", "github"]
---

# Introdução

Às vezes precisamos baixar uma pasta de um repositório no GitHub sem clonar tudo. Por exemplo, quando você quer acessar apenas a pasta "exemplos" de um projeto. Claro você pode simplesmente clonar o repositório inteiro, mas você pode querer algo mais simples, ou o reposítório é muito grande,o que demora para baixar e consome muito espaço. Vou mostrar três formas práticas de fazer isso.

# 1. Usando o DownGit (ferramenta online)

Uma das maneiras mais fáceis é utilizando a ferramenta online [DownGit](https://downgit.github.io/), ele cria um arquivo ZIP contendo apenas o conteúdo da pasta desejada. Siga os passos abaixo:

1.  Acesse o [DownGit](https://downgit.github.io/).
2.  Cole a URL da pasta do GitHub (ex: `https://github.com/usuario/repo/tree/main/pasta`).
3.  Clique em **Download**.

**Dica:** Você pode criar links para download diretos prefixando a URL da pasta com `https://downgit.github.io/#/home?url=`.

# 2. Usando o Degit (Node.js)

Outra opção é utilizar a ferramenta de linha de comando [Degit](https://github.com/Rich-Harris/degit). Ela vai fazer o download de todos os arquivos do repositório, sem o histórico do Git (sem a pasta `.git`, o que o torna mais leve que o `git clone`), mas permite que você extraia apenas a pasta desejada. Basta executar o comando abaixo:

```bash "usuario" "repositorio" "caminho para pasta" "branch ou tag" "destino"
npx degit usuario/repositorio/caminho para pasta#branch ou tag destino
```

# 3. Usando o Git Sparse Checkout (nativo)

Esse método não é tão simples quanto os anteriores, mas o git tem uma funcionalidade nativa e robusta para essa finalidade, chamada Sparse Checkout. Diferente do Degit, esse método vai baixar apenas os metadados (estrutura de pastas, etc) e os arquivos que você especificar. Basta executar os comandos abaixo:

```bash "url do repositorio" "pasta do repositorio" "caminho da pasta que você quer baixar" "branch"
git clone --filter=blob:none --no-checkout url do repositorio

cd pasta do repositorio

git sparse-checkout init --cone

git sparse-checkout set caminho da pasta que você quer baixar

git checkout branch
```

---

> [!NOTE]
> PS: Essa é minha primeira postagem. O plano era que o primeiro post fosse sobre como eu criei este blog utilizando SvelteKit e Markdown (que será publicado em breve). Mas tive a necessidade de disponibilizar o código que eu vou escrever nos artigos de maneira simples, já que todo o código e conteúdo está hospedado em um único [repositório público](https://github.com/vadolasi/site), então decidi escrever este post primeiro.
