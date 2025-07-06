const express = require('express');
const router = express.Router();
const productManager = require('../utils/productManager');

// Vista "home.handlebars"
router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Vista "realTimeProducts.handlebars"
router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

module.exports = router;