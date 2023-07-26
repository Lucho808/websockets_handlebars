import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import viewsRoutes from './routes/views.routes.js';
import { ProductManager } from './ProductManager.js';

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager();

// Configurar el motor de plantillas "express-handlebars"
const hbs = engine({
  extname: '.hbs',
  helpers: {
    layout: (name, options) => {
      const layoutPath = path.join(__dirname, 'views', 'layouts', `${name}.hbs`);
      const layoutTemplate = fs.readFileSync(layoutPath, 'utf8');
      return hbs.handlebars.compile(layoutTemplate)(options.data.root);
    },
  },
});
app.engine('.hbs', hbs);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  socket.emit('productsUpdate', productManager.getAllProducts());

  socket.on('getProducts', () => {
    socket.emit('productsUpdate', productManager.getAllProducts());
  });
});

app.use('/', viewsRoutes);
app.use(express.json());

app.post('/api/products', async (req, res) => {
  const newProduct = req.body;
  const product = productManager.createNewProduct(newProduct); 
  res.json({ status: 'success', message: 'Producto agregado exitosamente', product });
});

app.delete('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProduct(productId); 
  res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
