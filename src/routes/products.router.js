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

    // --- usamos Socket.IO desde una ruta HTTP ---
    const io = req.app.get('socketio'); // Obtenemos la instancia de io
    io.emit('updateProducts', productManager.getProducts()); // Emitimos a todos los clientes

    res.status(201).json(newProduct);
});

// DELETE a product by ID (API HTTP)
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const success = productManager.deleteProduct(productId);

    if (success) {
        // --- hacemos uso nuevamente de Socket.IO desde una ruta HTTP ---
        const io = req.app.get('socketio'); // Obtenemos la instancia de io
        io.emit('updateProducts', productManager.getProducts()); // Emitimos a todos los clientes

        res.status(200).json({ message: `Producto con ID ${productId} eliminado.` });
    } else {
        res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` });
    }
});



module.exports = router;