const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = require("./database");

app.get("/users", (req, res) => {
    const query = `
        SELECT u.id, u.name, u.isAdmin, u.isLeader, u.password,
               GROUP_CONCAT(l.name) as leaders,
               GROUP_CONCAT(s.name) as subordinates
        FROM users u
        LEFT JOIN user_leader ul ON u.id = ul.user_id
        LEFT JOIN users l ON ul.leader_id = l.id
        LEFT JOIN user_leader us ON u.id = us.leader_id
        LEFT JOIN users s ON us.user_id = s.id
        GROUP BY u.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            res.status(500).json({ error: "Erro ao buscar usuários." });
        } else {
            results.forEach((user) => {
                user.leaders = user.leaders ? user.leaders.split(",") : [];
                user.subordinates = user.subordinates ? user.subordinates.split(",") : []; // Adicionando a lista de subordinados
            });
            res.json(results);
        }
    });
});

app.get("/leaders", (req, res) => {
    const query = "SELECT id, name FROM users WHERE isLeader = true"; // Filtra apenas os líderes
    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar líderes:", err);
            res.status(500).json({ error: "Erro ao buscar líderes." });
        } else {
            res.json(results);
        }
    });
});

app.post("/users", (req, res) => {
    const { name, isAdmin, isLeader, leaders, password } = req.body;

    // Validações
    if (!name || name.length < 3) {
        return res.status(400).json({ error: "O nome deve ter no mínimo 3 caracteres." });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "A senha deve ter no mínimo 6 caracteres." });
    }

    // Verificar se o nome já existe
    const checkUserQuery = "SELECT * FROM users WHERE name = ?";
    db.query(checkUserQuery, [name], (err, results) => {
        if (err) {
            console.error("Erro ao verificar nome de usuário:", err);
            return res.status(500).json({ error: "Erro ao verificar nome de usuário." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "O nome de usuário já está em uso." });
        }

        // Se passar nas validações, prosseguir com a criação
        const query = "INSERT INTO users (name, isAdmin, isLeader, password) VALUES (?, ?, ?, ?)";
        db.query(query, [name, isAdmin, isLeader, password], (err, result) => {
            if (err) {
                console.error("Erro ao criar usuário:", err);
                return res.status(500).json({ error: "Erro ao criar usuário." });
            }

            const userId = result.insertId;
            const validLeaders = leaders.filter((leaderId) => leaderId !== "");

            if (validLeaders.length > 0) {
                const leaderQuery = "INSERT INTO user_leader (user_id, leader_id) VALUES ?";
                const leaderValues = validLeaders.map((leaderId) => [userId, leaderId]);

                db.query(leaderQuery, [leaderValues], (err) => {
                    if (err) {
                        console.error("Erro ao associar líderes:", err);
                        return res.status(500).json({ error: "Erro ao associar líderes." });
                    }
                    res.status(201).json({ id: userId, name, isAdmin, isLeader, leaders: validLeaders });
                });
            } else {
                res.status(201).json({ id: userId, name, isAdmin, isLeader, leaders: [] });
            }
        });
    });
});

app.put("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, isAdmin, isLeader, leaders, password } = req.body;

    const query = "UPDATE users SET name = ?, isAdmin = ?, isLeader = ?, password = ? WHERE id = ?";

    db.query(query, [name, isAdmin, isLeader, password, id], (err) => {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            res.status(500).json({ error: "Erro ao atualizar usuário." });
        } else {
            const deleteQuery = "DELETE FROM user_leader WHERE user_id = ?";
            const insertQuery = "INSERT INTO user_leader (user_id, leader_id) VALUES ?";
            const leaderValues = leaders.map((leaderId) => [id, leaderId]);

            db.query(deleteQuery, [id], (err) => {
                if (err) {
                    console.error("Erro ao remover líderes antigos:", err);
                    res.status(500).json({ error: "Erro ao remover líderes antigos." });
                } else {
                    if (leaderValues.length > 0) {
                        db.query(insertQuery, [leaderValues], (err) => {
                            if (err) {
                                console.error("Erro ao adicionar líderes:", err);
                                res.status(500).json({ error: "Erro ao adicionar líderes." });
                            } else {
                                res.json({ id, name, isAdmin, isLeader, leaders });
                            }
                        });
                    } else {
                        res.json({ id, name, isAdmin, isLeader, leaders });
                    }
                }
            });
        }
    });
});

app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const query = "DELETE FROM users WHERE id = ?";

    db.query(query, [id], (err) => {
        if (err) {
            console.error("Erro ao deletar usuário:", err);
            res.status(500).json({ error: "Erro ao deletar usuário." });
        } else {
            res.status(204).end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
