const socket = io();

const productList = document.getElementById('productList');
const productForm = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteForm');

// Renderiza la lista de productos
const renderProducts = (products) => {
    productList.innerHTML = '';
    if (products && products.length > 0) {
        products.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('product-item');
            li.innerHTML = `
                <span class="product-id">ID: ${product.id}</span>
                <span class="product-name">${product.name}</span>
                <span class="product-price">$${product.price}</span>
                <span class="product-description">${product.description || 'N/A'}</span>
                <button class="delete-btn" data-id="${product.id}">Eliminar</button>
            `;
            productList.appendChild(li);
        });
    } else {
        productList.innerHTML = '<li>No hay productos disponibles.</li>';
    }
};

// Escucha la actualización de productos desde el servidor
socket.on('updateProducts', (products) => {
    renderProducts(products);
});

// Enviar nuevo producto
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = Number(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    socket.emit('addProduct', { name, price, description });
    productForm.reset();
});

// Eliminar producto desde el formulario manual
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = Number(document.getElementById('productId').value);
    socket.emit('deleteProduct', productId);
    deleteForm.reset();
});

// Eliminar producto desde el botón individual
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.getAttribute('data-id'));
        socket.emit('deleteProduct', id);
    }
});