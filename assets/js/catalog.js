const DATA_URL = 'data/products.json';
const FOLDER_INDEX_URL = 'data/produtos/index.json';
const FALLBACK_IMAGE = 'assets/images/products/placeholder.svg';

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
  return response.json();
}

function normalizeProduct(product = {}) {
  return {
    ...product,
    marcas: Array.isArray(product.marcas) && product.marcas.length
      ? product.marcas
      : [product.marca_caminhao || 'Universal'],
    imagens: Array.isArray(product.imagens) && product.imagens.length
      ? product.imagens
      : [FALLBACK_IMAGE],
    aplicacoes: Array.isArray(product.aplicacoes) ? product.aplicacoes : []
  };
}

async function loadProductsFromFolders() {
  const index = await fetchJson(FOLDER_INDEX_URL);
  const entries = Array.isArray(index) ? index : [];

  const products = await Promise.all(entries.map(async (entry) => {
    const product = await fetchJson(entry.path);
    return normalizeProduct(product);
  }));

  return products;
}

export async function loadProducts() {
  try {
    const products = await loadProductsFromFolders();
    if (products.length) return products;
  } catch {
    // fallback para formato legado em data/products.json
  }

  const legacyData = await fetchJson(DATA_URL);
  return legacyData.map(normalizeProduct);
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
      <img class="product-thumb" loading="lazy" src="${escapeHtml(image)}" alt="${escapeHtml(product.nome)}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
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
