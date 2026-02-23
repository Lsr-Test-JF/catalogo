const DATA_URL = 'data/products.json';

export async function loadProducts() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error('Falha ao carregar catálogo.');

  const data = await response.json();
  return data.map((product) => ({
    ...product,
    marcas: Array.isArray(product.marcas) && product.marcas.length ? product.marcas : [product.marca_caminhao || 'Universal'],
    imagens: Array.isArray(product.imagens) && product.imagens.length ? product.imagens : ['assets/images/products/placeholder.svg'],
    aplicacoes: Array.isArray(product.aplicacoes) ? product.aplicacoes : []
  }));
}

export function slug(value = '') {
  return encodeURIComponent(value.trim().toLowerCase());
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function productCard(product) {
  const image = product.imagens[0];
  const badges = [product.tipo === 'ar' ? 'Freio a ar' : 'Freio a óleo', ...product.marcas.slice(0, 2)]
    .map((label) => `<span class="chip">${escapeHtml(label)}</span>`)
    .join('');

  return `
    <article class="product-card" tabindex="0" aria-label="${escapeHtml(product.nome)}">
      <img class="product-thumb" loading="lazy" src="${escapeHtml(image)}" alt="${escapeHtml(product.nome)}" />
      <div class="product-content">
        <strong>${escapeHtml(product.codigo)}</strong>
        <h3>${escapeHtml(product.nome)}</h3>
        <div class="chips">${badges}</div>
        <a class="btn ghost" href="produto.html?codigo=${slug(product.codigo)}">Ver detalhes</a>
      </div>
    </article>`;
}

export function uniqueValues(products, key) {
  return [...new Set(products.flatMap((product) => {
    if (Array.isArray(product[key])) return product[key];
    return product[key] ? [product[key]] : [];
  }))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
