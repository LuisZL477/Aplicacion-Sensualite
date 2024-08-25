import { Request, Response } from 'express';
import { Product } from '../models/product';

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const listProducts = await Product.findAll();
    res.json(listProducts);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los productos', error });
  }
};

// Obtener un producto por id
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ msg: `No existe un producto con el id ${id}` });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el producto', error });
  }
};

// Comprar un producto
export const buyProduct = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ msg: 'La cantidad debe ser un número positivo' });
  }

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ msg: `No existe un producto con el id ${productId}` });
    }

    if (product.existencia >= quantity) {
      product.existencia -= quantity;
      await product.save();
      res.json({ msg: `Compra realizada con éxito de ${quantity} unidad(es)`, product });
    } else {
      res.status(400).json({ msg: 'Stock insuficiente' });
    }
  } catch (error) {
    console.error('Error al comprar el producto:', error);
    res.status(500).json({ msg: 'Error interno del servidor', error });
  }
};

