import { io } from 'socket.io-client';

const socket = io(); 

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.io');
});

socket.on('productsUpdate', (products) => {
  updateProductsList(products); 
});

function updateProductsList(products) {
  const productsListElement = document.getElementById('products-list');
  productsListElement.innerHTML = '';

  products.forEach((product) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${product.title} - ${product.price}`;
    productsListElement.appendChild(listItem);
  });
}
