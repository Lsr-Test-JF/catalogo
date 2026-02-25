import { loadProducts } from './catalog.js';

const container = document.querySelector('#product-detail');
const params = new URLSearchParams(window.location.search);
const codigo = decodeURIComponent(params.get('codigo') || '').toLowerCase();

function createRow(label, value) {
  return `<tr><th scope="row">${label}</th><td>${value}</td></tr>`;
}

(async function init() {
  try {
    const products = await loadProducts();
    const product = products.find((item) => item.codigo.toLowerCase() === codigo);

    if (!product) {
      container.innerHTML = '<div class="empty">Produto não encontrado. <a href="produtos.html">Voltar ao catálogo</a></div>';
      return;
    }

    document.title = `${product.codigo} | LUSAR Catálogo`;

    const specsRows = Object.entries(product.especificacoes || {})
      .map(([k, v]) => createRow(k, v || 'Consultar catálogo técnico'))
      .join('');

    const apps = (product.aplicacoes || []).length
      ? product.aplicacoes.map((item) => `<li>${item}</li>`).join('')
      : '<li>Consulte nossa equipe técnica para aplicações.</li>';

    const gallery = product.imagens
      .map((img) => `<img class="detail-image" loading="lazy" src="${img}" alt="${product.nome}" onerror="this.onerror=null;this.src='assets/images/products/placeholder.svg'" />`)
      .join('');

    container.innerHTML = `
      <p><a class="btn ghost" href="produtos.html">← Voltar para produtos</a></p>
      <section class="detail-layout">
        <div>${gallery}</div>
        <div>
          <h1>${product.nome}</h1>
          <p class="muted"><strong>${product.codigo}</strong> • ${product.tipo === 'ar' ? 'Freio a ar' : 'Freio a óleo'} • ${product.marcas.join(', ')}</p>
          <p>${product.descricao}</p>
          <h2>Especificações técnicas</h2>
          <table class="tech-table" aria-label="Tabela técnica do produto"><tbody>${specsRows}</tbody></table>
          <h2>Aplicações</h2>
          <ul>${apps}</ul>
          <p><strong>Observações:</strong> ${product.observacoes}</p>
          <p><a class="btn primary" href="mailto:vendas@lusar.com.br?subject=Interesse em ${encodeURIComponent(product.codigo)}">Solicitar cotação</a></p>
        </div>
      </section>`;

    const seo = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nome,
      sku: product.codigo,
      description: product.descricao,
      brand: { '@type': 'Brand', name: 'LUSAR' }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(seo);
    document.head.appendChild(script);
  } catch {
    container.innerHTML = '<div class="empty">Erro ao carregar produto.</div>';
  }
})();
