import { loadProducts, productCard } from './catalog.js';

const kpis = document.querySelector('#kpis');
const featuredGrid = document.querySelector('#featured-grid');
document.querySelector('#year').textContent = new Date().getFullYear();

(async function init() {
  try {
    const products = await loadProducts();
    const ar = products.filter((p) => p.tipo === 'ar').length;
    const oleo = products.filter((p) => p.tipo === 'oleo').length;
    kpis.innerHTML = `
      <div class="kpi"><span>Total de itens</span><strong>${products.length}</strong></div>
      <div class="kpi"><span>Sapatas a ar</span><strong>${ar}</strong></div>
      <div class="kpi"><span>Sapatas a óleo</span><strong>${oleo}</strong></div>`;

    featuredGrid.innerHTML = products.slice(0, 8).map(productCard).join('');
  } catch {
    kpis.innerHTML = '<div class="empty">Não foi possível carregar os dados.</div>';
  }
})();
