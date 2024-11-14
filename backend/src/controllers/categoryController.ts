import { Request, Response } from "express";
import { createCategory, getCategories, deleteCategory, updateCategory } from "../services/categoryService";

export const createCategoryController = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const newCategory = await createCategory(name);
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteCategory(Number(id));
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateCategoryController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await updateCategory(Number(id), name);
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}