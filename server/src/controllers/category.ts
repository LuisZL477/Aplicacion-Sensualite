import { Request, Response } from 'express';
import { Category } from '../models/category'; // Asegúrate de que la ruta sea correcta
import { Product } from '../models/product'
 

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
    const { nombre } = req.body;

    try {
        const nuevaCategoria = await Category.create({ nombre });
        res.json({
            msg: 'Categoría creada exitosamente',
            categoria: nuevaCategoria
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al crear la categoría',
            error
        });
    }
};

// Obtener todas las categorías
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categorias = await Category.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener las categorías',
            error
        });
    }
};



// Actualizar una categoría por ID
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const categoria = await Category.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }

        await categoria.update({ nombre });
        res.json({
            msg: 'Categoría actualizada exitosamente',
            categoria
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar la categoría',
            error
        });
    }
};

// Eliminar una categoría por ID
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const categoria = await Category.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }

        await categoria.destroy();
        res.json({
            msg: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar la categoría',
            error
        });
    }
};


export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id, {
            include: [{
                model: Product,
                as: 'productos' // Debe coincidir con el alias definido en la asociación
            }]
        });

        if (!category) {
            return res.status(404).json({
                msg: `No existe una categoría con el id ${id}`
            });
        }

        res.json(category);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener la categoría'
        });
    }
};
