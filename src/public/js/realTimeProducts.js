const socket = io(); // Conecta al servidor de Socket.IO

const productList = document.getElementById('productList');
const productForm = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteForm');

// Función para renderizar la lista de productos
const renderProducts = (products) => {
    productList.innerHTML = ''; // Limpia la lista existente
    if (products && products.length > 0) {
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `ID: ${product.id} - Nombre: ${product.name} - Precio: $${product.price} - Descripción: ${product.description || 'N/A'}`;
            productList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No hay productos disponibles.';
        productList.appendChild(li);
    }
};

// Escucha el evento 'updateProducts' del servidor
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados recibidos:', products);
    renderProducts(products);
});

// Envía un nuevo producto al servidor
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value || '',
    };
    socket.emit('addProduct', newProduct); // Emitir evento 'addProduct'
    productForm.reset();
});

// Envía una solicitud para eliminar un producto
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productIdToDelete = parseInt(document.getElementById('productId').value);
    if (!isNaN(productIdToDelete)) {
        socket.emit('deleteProduct', productIdToDelete); // Emitir evento 'deleteProduct'
        deleteForm.reset();
    } else {
        alert('Por favor, ingresa un ID válido para eliminar.');
    }
});

// Cuando el cliente se conecta, solicita la lista actual de productos
socket.on('connect', () => {
    console.log('Conectado al servidor de WebSockets');
    // No es estrictamente necesario emitir un 'requestProducts' si el servidor ya lo emite al conectar
    // Pero si no, podrías hacer: socket.emit('requestProducts');
});

// Al cargar la página, se puede solicitar la lista inicial o esperar el 'updateProducts'
// Para asegurar que siempre se muestra la lista al cargar:
// socket.emit('requestInitialProducts'); // Si quieres que el cliente pida la lista
// O simplemente, el servidor ya la emite al conectar, como en el app.js.
// Si no se pide explícitamente, se esperará a que el servidor envíe la primera actualización.