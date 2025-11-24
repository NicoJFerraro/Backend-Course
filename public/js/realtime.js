const socket = io();
const productsList = document.getElementById('products-list');
const productCount = document.getElementById('product-count');
const productForm = document.getElementById('product-form');
const status = document.getElementById('status');

// Show status messages
function showStatus(message, isError = false) {
  status.textContent = message;
  status.className = isError ? 'error' : 'success';
  setTimeout(() => {
    status.textContent = '';
  }, 3000);
}

// Render products list
function renderProducts(products) {
  productCount.textContent = products.length;
  
  if (products.length === 0) {
    productsList.innerHTML = '<p>No products available.</p>';
    return;
  }

  productsList.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-title">${product.title}</div>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Code:</strong> ${product.code}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <div class="product-price">$${product.price}</div>
      <p><strong>Status:</strong> ${product.status ? 'Available' : 'Unavailable'}</p>
      <button class="delete-btn" onclick="deleteProduct('${product.id}')">
        Delete Product
      </button>
    </div>
  `).join('');
}

// Add new product
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(productForm);
  const productData = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    category: formData.get('category'),
    thumbnails: formData.get('thumbnails') ? [formData.get('thumbnails')] : []
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      productForm.reset();
      showStatus('Product added successfully!');
    } else {
      const error = await response.json();
      showStatus(error.error || 'Error adding product', true);
    }
  } catch (error) {
    showStatus('Network error: ' + error.message, true);
  }
});

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showStatus('Product deleted successfully!');
    } else {
      const error = await response.json();
      showStatus(error.error || 'Error deleting product', true);
    }
  } catch (error) {
    showStatus('Network error: ' + error.message, true);
  }
}

// Load initial products
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    const products = data.payload || data;
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    showStatus('Error loading products', true);
  }
}

// Socket event listeners
socket.on('products:update', (products) => {
  console.log('Products updated:', products.length);
  renderProducts(products);
});

socket.on('connect', () => {
  console.log('Connected to server');
  showStatus('Connected to real-time updates!');
  // Load products when connected
  loadProducts();
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  showStatus('Disconnected from server', true);
});