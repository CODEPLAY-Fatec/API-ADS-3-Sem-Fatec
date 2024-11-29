import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { db } from "../config/database2"; // Import the db variable
import { createUser, deleteUser, getAllUsersWithDetails, getLeaders, updateUser } from "../services/userService";

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = (await getAllUsersWithDetails()) as any[];
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createUserController = async (req: Request, res: Response) => {
    const { name, email, password, isAdmin, phoneNumber } = req.body;
    const photo = req.file;

    // Log request body and file
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    try {
        const newUser = await createUser({ name, email, password, phoneNumber, isAdmin: isAdmin === "1" });

        if (photo) {
            const photoPath = path.join(__dirname, "../../uploads", `${newUser.id}-${photo.originalname}`);
            fs.writeFileSync(photoPath, photo.buffer);
            await db.query("INSERT INTO user_pictures (user_id, image) VALUES (?, ?)", [newUser.id, photo.buffer]);
        }

        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.body;
    try {
        await updateUser(Number(id), user);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteUser(Number(id));
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getLeadersController = async (req: Request, res: Response) => {
    try {
        const leaders = await getLeaders();
        res.json(leaders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
