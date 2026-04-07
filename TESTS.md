GET /products - Consulta la db y devuelve la lista de productos
POST /products - Registra un nuevo producto en la database
GET /cart - Hace una lista con los productos que el usuario agrego a la cesta pero aun no pago
POST /cart - Añade un nuevo producto a la cesta del usuario
POST /checkout - Calcula el total de la cesta, resta las cantidades compradas del stock real de los productos y vacia el carrito (Simulacion de pago).