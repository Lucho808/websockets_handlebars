import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const port = 8080;


app.engine('.handlebars', exphbs({ extname: '.handlebars' }));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  const products = getProductsFromSomewhere(); 

  socket.emit('productsUpdate', products);

  socket.on('createProduct', (newProduct) => {
    createNewProduct(newProduct);
    const updatedProducts = getProductsFromSomewhere();  
    io.emit('productsUpdate', updatedProducts);
  });

  
  socket.on('deleteProduct', (productId) => {
    deleteProduct(productId);
    const updatedProducts = getProductsFromSomewhere();
    io.emit('productsUpdate', updatedProducts);
  });

  
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Rutas
app.get('/', async (req, res) => {
  const products = getProductsFromSomewhere();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = getProductsFromSomewhere();
  res.render('realTimeProducts', { products });
});

app.use(express.json());

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    await createNewProduct(newProduct);
    res.json({ status: 'success', message: 'Producto agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar el producto' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await deleteProduct(productId);
    res.json({ status: 'success', message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar el producto' });
  }
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});