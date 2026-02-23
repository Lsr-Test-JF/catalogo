import { loadProducts, productCard, uniqueValues } from './catalog.js';

const state = { products: [], filtered: [], page: 1, pageSize: 12 };

const searchInput = document.querySelector('#search');
const brandFilter = document.querySelector('#brandFilter');
const categoryFilter = document.querySelector('#categoryFilter');
const typeFilter = document.querySelector('#typeFilter');
const grid = document.querySelector('#products-grid');
const pagination = document.querySelector('#pagination');
const meta = document.querySelector('#results-meta');

function debounce(fn, wait = 180) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function matchesBrand(product, selectedBrand) {
  if (!selectedBrand) return true;
  return product.marcas.includes(selectedBrand);
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();

  state.filtered = state.products.filter((product) => {
    const matchQuery = !q
      || product.codigo.toLowerCase().includes(q)
      || product.nome.toLowerCase().includes(q);

    const matchCategory = !categoryFilter.value || product.categoria === categoryFilter.value;
    const matchType = !typeFilter.value || product.tipo === typeFilter.value;

    return matchQuery && matchesBrand(product, brandFilter.value) && matchCategory && matchType;
  });

  state.page = 1;
  render();
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';

  for (let page = 1; page <= totalPages; page += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `page-btn ${state.page === page ? 'active' : ''}`;
    btn.textContent = page;
    btn.setAttribute('aria-label', `Ir para página ${page}`);
    btn.addEventListener('click', () => {
      state.page = page;
      render();
    });
    pagination.appendChild(btn);
  }
}

function render() {
  const start = (state.page - 1) * state.pageSize;
  const pageItems = state.filtered.slice(start, start + state.pageSize);
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));

  meta.textContent = `${state.filtered.length} produto(s) encontrado(s).`;
  grid.innerHTML = pageItems.length
    ? pageItems.map(productCard).join('')
    : '<div class="empty" role="status">Nenhum produto encontrado.</div>';

  renderPagination(totalPages);
}

(async function init() {
  try {
    state.products = await loadProducts();
    state.filtered = [...state.products];

    uniqueValues(state.products, 'marcas').forEach((value) => {
      brandFilter.append(new Option(value, value));
    });

    uniqueValues(state.products, 'categoria').forEach((value) => {
      categoryFilter.append(new Option(value, value));
    });

    searchInput.addEventListener('input', debounce(applyFilters));
    [brandFilter, categoryFilter, typeFilter].forEach((el) => el.addEventListener('change', applyFilters));

    render();
  } catch {
    meta.textContent = 'Falha ao carregar catálogo.';
    grid.innerHTML = '<div class="empty">Não foi possível carregar os produtos.</div>';
  }
})();
