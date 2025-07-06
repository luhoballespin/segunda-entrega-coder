const express = require('express');
const router = express.Router();
const productManager = require('../utils/productManager');

// GET all products
router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});

// POST a new product (API HTTP)
router.post('/', (req, res) => {
    const newProductData = req.body;
    const newProduct = productManager.addProduct(newProductData);

    // --- Aquí es donde usas Socket.IO desde una ruta HTTP ---
    const io = req.app.get('socketio'); // Obtenemos la instancia de io
    io.emit('updateProducts', productManager.getProducts()); // Emitimos a todos los clientes

    res.status(201).json(newProduct);
});

// DELETE a product by ID (API HTTP)
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const success = productManager.deleteProduct(productId);

    if (success) {
        // --- Aquí es donde usas Socket.IO desde una ruta HTTP ---
        const io = req.app.get('socketio'); // Obtenemos la instancia de io
        io.emit('updateProducts', productManager.getProducts()); // Emitimos a todos los clientes

        res.status(200).json({ message: `Producto con ID ${productId} eliminado.` });
    } else {
        res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` });
    }
});

// GET product by ID (optional)
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = productManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado.' });
    }
});

module.exports = router;