"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyProduct = exports.getProduct = exports.getProducts = void 0;
const product_1 = require("../models/product");
// Obtener todos los productos
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listProducts = yield product_1.Product.findAll();
        res.json(listProducts);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al obtener los productos', error });
    }
});
exports.getProducts = getProducts;
// Obtener un producto por id
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_1.Product.findByPk(id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ msg: `No existe un producto con el id ${id}` });
        }
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al obtener el producto', error });
    }
});
exports.getProduct = getProduct;
// Comprar un producto
const buyProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    try {
        const product = yield product_1.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ msg: `No existe un producto con el id ${productId}` });
        }
        if (product.existencia > 0) {
            product.existencia -= 1;
            yield product.save();
            res.json({ msg: 'Compra realizada con éxito', product });
        }
        else {
            res.status(400).json({ msg: 'El producto está agotado' });
        }
    }
    catch (error) {
        console.error('Error al comprar el producto:', error);
        res.status(500).json({ msg: 'Error interno del servidor', error });
    }
});
exports.buyProduct = buyProduct;
// // Eliminar un producto por id
// export const deleteProducts = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const product = await Product.findByPk(id);
//   if (!product) {
//     res.status(404).json({
//       msg: `No existe un producto con el id ${id}`
//     });
//   } else {
//     if (product.imagen) {
//       const imagePath = path.join(__dirname, '../../uploads', product.imagen);
//       fs.unlink(imagePath, (err) => {
//         if (err) {
//           console.error('Error al eliminar la imagen:', err);
//         }
//       });
//     }
//     await product.destroy();
//     res.json({
//       msg: 'El producto fue eliminado correctamente!!'
//     });
//   }
// };
// // Crear un nuevo producto
// export const postProduct = async (req: Request, res: Response) => {
//   const { body } = req;
//   const file = req.file;
//   try {
//     const product = await Product.create({
//       ...body,
//       imagen: file ? file.filename : null
//     });
//     res.json({
//       msg: `Producto registrado correctamente!!`,
//       product
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       msg: `Ocurrió un error, comunícate con soporte. Error: ${error}`
//     });
//   }
// };
// // Actualizar un producto por id
// export const updateProduct = async (req: Request, res: Response) => {
//   const { body } = req;
//   const { id } = req.params;
//   const file = req.file;
//   const product = await Product.findByPk(id);
//   try {
//     if (product) {
//       if (file && product.imagen) {
//         const oldImagePath = path.join(__dirname, '../../uploads', product.imagen);
//         fs.unlink(oldImagePath, (err) => {
//           if (err) {
//             console.error('Error al eliminar la imagen antigua:', err);
//           }
//         });
//       }
//       await product.update({
//         ...body,
//         imagen: file ? file.filename : product.imagen
//       });
//       res.json({
//         msg: 'El producto se actualizó con éxito',
//         product
//       });
//     } else {
//       res.status(404).json({
//         msg: `No existe un producto con el id ${id}`
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       msg: `Ocurrió un error, comunícate con soporte. Error: ${error}`
//     });
//   }
// };
// // Eliminar una imagen
// export const deleteImage = async (req: Request, res: Response) => {
//   const { imagePath } = req.params;
//   const fullPath = path.join(__dirname, '../../uploads', imagePath);
//   fs.unlink(fullPath, (err) => {
//     if (err) {
//       return res.status(404).json({
//         msg: 'No se pudo encontrar la imagen'
//       });
//     }
//     res.json({
//       msg: 'Imagen eliminada correctamente'
//     });
//   });
// };
