const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../../products.json');

const getProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer products.json:", error);
        return [];
    }
};

const saveProducts = (products) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al escribir products.json:", error);
    }
};

const addProduct = (product) => {
    const products = getProducts();
    // Generar un ID simple para el ejemplo
    const newProduct = { id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, ...product };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
};

const deleteProduct = (id) => {
    let products = getProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length < initialLength) {
        saveProducts(products);
        return true; // Eliminado con éxito
    }
    return false; // Producto no encontrado
};

module.exports = {
    getProducts,
    saveProducts,
    addProduct,
    deleteProduct
};