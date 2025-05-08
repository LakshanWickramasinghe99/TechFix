import mongoose from 'mongoose';
import CartModel from '../models/cartModel.js';
import ProductModel from '../models/Item.js';

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check for valid quantity
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Find or create the cart for the user
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

const getCart = async (req, res) => {
  const { userId } = req; 

  try {
    const cart = await CartModel.findOne({ userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req;

  try {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId } = req.params; 
  const { quantity } = req.body;     

  if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  try {
    const cart = await CartModel.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ message: 'Cart item quantity updated', cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// Use named export for all functions
export { addToCart, getCart, removeFromCart, updateCartQuantity };
