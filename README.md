# Catálogo Web LUSAR — Sapatas de Freio

Sistema completo de catálogo web profissional, responsivo e dinâmico para sapatas de freio de caminhões/ônibus.

## Estrutura

- `index.html` — página inicial
- `produtos.html` — listagem com filtros + busca + paginação
- `produto.html` — página individual dinâmica
- `data/products.json` — base editável dos produtos
- `assets/images/products/` — imagens dos produtos
- `assets/js/` — módulos JS reutilizáveis
- `assets/css/styles.css` — estilos globais

## Edição rápida

1. Atualize `data/products.json` com novos itens.
2. Adicione imagens em `assets/images/products/`.
3. Referencie os caminhos das imagens no campo `imagens` de cada produto.

Sem necessidade de alterar HTML/JS para adicionar produtos.

## Campos esperados no JSON

- `codigo`
- `nome`
- `marca_caminhao`
- `marcas` (array para filtro por marca)
- `categoria`
- `tipo` (`ar` ou `oleo`)
- `descricao`
- `especificacoes` (objeto chave/valor)
- `imagens` (array)
- `aplicacoes` (array)
- `observacoes`

## Execução local

```bash
python -m http.server 8000
```

Abra: `http://localhost:8000`

## Observação

Catálogo focado exclusivamente em **sapatas de freio** (sem lonas).

## Deploy automático (GitHub Pages)

O workflow já está em `.github/workflows/deploy.yml` e publica automaticamente a cada push na branch `main`.

### Passos no GitHub (1x)

1. Vá em **Settings > Pages**.
2. Em **Build and deployment**, selecione **Source: GitHub Actions**.
3. Faça push para `main`.
4. Acompanhe em **Actions > Deploy GitHub Pages**.

Quando concluir, a URL publicada aparece no job `deploy`.

## Estrutura mínima entregue

Arquivos e pastas solicitados disponíveis no repositório:
- `index.html`
- `produtos.html`
- `produto.html`
- `assets/`
- `data/`
- `data/products.json`
