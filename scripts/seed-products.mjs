// One-off dev seed script: pulls sample products from DummyJSON (free public API)
// and inserts them into our own backend/DB via the existing admin REST endpoints.
// Run with: node scripts/seed-products.mjs
// Requires the backend running on localhost:8080 with the seeded `admin/adminPass` user.

const API = 'http://localhost:8080/api';
const PRODUCT_LIMIT = 60;
const CATEGORY_LIMIT = 8; // keep the storefront demo-sized

let cookie = '';

function extractCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    cookie = setCookie.split(';')[0];
  }
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
      ...(options.headers || {}),
    },
  });
  extractCookie(res);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${options.method || 'GET'} ${path} failed: ${res.status} ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

async function main() {
  console.log('Signing in as admin...');
  await api('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'adminPass' }),
  });

  console.log('Fetching sample products from DummyJSON...');
  const { products } = await fetch(
    `https://dummyjson.com/products?limit=${PRODUCT_LIMIT}&select=title,category,price,discountPercentage,stock,description,thumbnail`
  ).then((r) => r.json());

  const categoriesInUse = [...new Set(products.map((p) => p.category))].slice(0, CATEGORY_LIMIT);
  const categoryIdByName = {};

  console.log(`Creating ${categoriesInUse.length} categories...`);
  for (const categoryName of categoriesInUse) {
    const readableName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    try {
      const created = await api('/admin/add-category', {
        method: 'POST',
        body: JSON.stringify({ categoryName: readableName }),
      });
      categoryIdByName[categoryName] = created.categoryId;
      console.log(`  + ${readableName} (id ${created.categoryId})`);
    } catch (e) {
      console.warn(`  ! skipped ${readableName}: ${e.message}`);
    }
  }

  const seedableProducts = products.filter((p) => categoryIdByName[p.category]);
  console.log(`Creating ${seedableProducts.length} products...`);

  let created = 0;
  for (const p of seedableProducts) {
    const categoryId = categoryIdByName[p.category];
    try {
      const addedProduct = await api(`/admin/categories/${categoryId}/product`, {
        method: 'POST',
        body: JSON.stringify({
          productName: p.title,
          description: p.description,
          quantity: p.stock,
          price: p.price,
          discount: Math.round(p.discountPercentage),
          specialPrice: 0,
        }),
      });

      // addProduct always defaults image to "default.png" server-side; a follow-up
      // update call is required to persist a real image URL against the product.
      await api(`/admin/product/${addedProduct.productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...addedProduct,
          image: p.thumbnail,
        }),
      });

      created++;
    } catch (e) {
      console.warn(`  ! skipped "${p.title}": ${e.message}`);
    }
  }

  console.log(`Done. Seeded ${created} products across ${categoriesInUse.length} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
