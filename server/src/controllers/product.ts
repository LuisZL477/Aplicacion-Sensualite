import { Request, Response } from 'express';
import { Product } from '../models/product';

// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  const listProducts = await Product.findAll();
  res.json(listProducts);
};

// Obtener un producto por id
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({
      msg: `No existe un producto con el id ${id}`
    });
  }
};

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
