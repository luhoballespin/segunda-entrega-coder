const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io'); // Importar Server de socket.io
const http = require('http'); // Necesario para envolver Express
const path = require('path');
const productManager = require('./utils/productManager');
const viewsRouter = require('./routes/views.router');
const productsRouter = require('./routes/products.router'); // Para API RESTful

const app = express();
const server = http.createServer(app); // Creamos un servidor HTTP
const io = new Server(server); // Conectamos Socket.IO al servidor HTTP

const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter); // Para la API RESTful de productos

// --- Socket.IO setup ---
// Variable global para io, para poder usarla en las rutas si es necesario
// PERO, la consigna dice: "Si se desea hacer la conexión de socket emits con HTTP,
// deberá buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST."
// Esto lo manejaremos más adelante en products.router.js
app.set('socketio', io); // Pasar la instancia de io a Express para accederla en rutas

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // 1. Emitir la lista inicial de productos al cliente que se conecta
    socket.emit('updateProducts', productManager.getProducts());

    // 2. Escuchar el evento 'addProduct' del cliente
    socket.on('addProduct', (productData) => {
        const newProduct = productManager.addProduct(productData);
        console.log('Producto agregado vía WebSocket:', newProduct);
        // Emitir la lista actualizada a TODOS los clientes conectados
        io.emit('updateProducts', productManager.getProducts());
    });

    // 3. Escuchar el evento 'deleteProduct' del cliente
    socket.on('deleteProduct', (productId) => {
        const success = productManager.deleteProduct(productId);
        if (success) {
            console.log(`Producto con ID ${productId} eliminado vía WebSocket.`);
            // Emitir la lista actualizada a TODOS los clientes conectados
            io.emit('updateProducts', productManager.getProducts());
        } else {
            console.log(`Producto con ID ${productId} no encontrado para eliminar.`);
        }
    });

   

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


// Iniciar el servidor
server.listen(PORT, () => { // Usamos server.listen, no app.listen
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});