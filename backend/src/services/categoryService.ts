import { db } from "../config/database2";

export const createCategory = async (name: string) => {
    const query = `INSERT INTO answer_category (name) VALUES (?)`;
    const values = [name];
    return db.query(query, values);
}

export const getCategories = async () => {
    const query = `SELECT * FROM answer_category`;
    return db.query(query);
}

export const deleteCategory = async (id: number) => {
    const query = `DELETE FROM answer_category WHERE id = ?`;
    const values = [id];
    return db.query(query, values);
}

export const updateCategory = async (id: number, name: string) => {
    const query = `UPDATE answer_category SET name = ? WHERE id = ?`;
    const values = [name, id];
    return db.query(query, values);
}