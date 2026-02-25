# Estrutura por produto

Cada produto agora possui uma pasta própria em `data/produtos/<slug>/`.

## Como editar um produto
1. Abra `data/produtos/<slug>/produto.json`.
2. Edite campos como `nome`, `descricao`, `categoria`, `tipo`, `especificacoes`, `aplicacoes` e `observacoes`.
3. Coloque a foto de capa em `data/produtos/<slug>/imagens/capa.svg`.
4. Se quiser mais fotos, adicione os caminhos no array `imagens` dentro do `produto.json`.

## Como adicionar novo produto
1. Crie uma nova pasta em `data/produtos/<novo-slug>/`.
2. Crie `produto.json` com a mesma estrutura dos outros produtos.
3. Adicione a capa em `imagens/capa.svg`.
4. Inclua o novo item em `data/produtos/index.json` com `codigo`, `slug` e `path`.
