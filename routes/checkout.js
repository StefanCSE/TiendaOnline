const express = require("express");
const router = express.Router();
const CartItem = require("../models/Cart");
const Product = require("../models/Product");

// POST /checkout - Pago simulado y vaciado del carrito
router.post("/", async (req, res) => {
  try {
    const cart = await CartItem.find();

    if (cart.length === 0) {
      return res.status(400).json({ error: "El carrito esta vacio" });
    }

    let total = 0;

    // Descontamos el stock de cada producto y calculamos el total
    for (const item of cart) {
      total += item.price * item.quantity;

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Vaciamos el carrito
    await CartItem.deleteMany({});

    res.json({
      message: "Pago realizado con exito",
      itemsPurchased: cart,
      total: total.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
