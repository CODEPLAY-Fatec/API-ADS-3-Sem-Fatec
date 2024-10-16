import { Router } from "express";

import { createCategoryController, getCategoriesController, deleteCategoryController, updateCategoryController } from "../controllers/categoryController";

const router = Router();

router.post('/category/', createCategoryController);
router.get('/category/', getCategoriesController);
router.delete('/category/:id', deleteCategoryController);
router.put('/category/:id', updateCategoryController);

export default router;