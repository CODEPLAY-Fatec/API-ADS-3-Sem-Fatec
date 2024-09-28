import React, { useEffect, useState } from "react";

const UserForm = ({ onSubmit, availableLeaders, editingUser }) => {
    const [form, setForm] = useState({
        name: "",
        password: "",
        isAdmin: false,
        isLeader: false,
        leaders: [],
    });

    useEffect(() => {
        if (editingUser) {
            setForm({
                name: editingUser.name || "",
                password: editingUser.password || "",
                isAdmin: editingUser.isAdmin || false,
                isLeader: editingUser.isLeader || false,
                leaders: editingUser.leaders || [],
            });
        }
    }, [editingUser]);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLeaderSelectChange = (index, e) => {
        const selectedLeader = e.target.value;
        const newLeaders = [...form.leaders];

        if (selectedLeader && selectedLeader !== "" && !newLeaders.includes(selectedLeader)) {
            newLeaders[index] = selectedLeader;
            setForm((prevForm) => ({
                ...prevForm,
                leaders: newLeaders,
            }));
        } else if (selectedLeader === "") {
            alert("Por favor, selecione um líder válido.");
        } else {
            alert("Este líder já foi selecionado.");
        }
    };

    const addLeaderSelect = () => {
        setForm((prevForm) => ({
            ...prevForm,
            leaders: [...prevForm.leaders, ""], // Adiciona um novo líder vazio ao array
        }));
    };

    const removeLeader = (index) => {
        const newLeaders = form.leaders.filter((_, i) => i !== index); // Remove o líder do índice correspondente
        setForm((prevForm) => ({
            ...prevForm,
            leaders: newLeaders,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validações
        if (form.name.trim() === "" || form.name.length < 3) {
            alert("O nome deve ter no mínimo 3 caracteres.");
            return;
        }

        if (form.password.trim() === "" || form.password.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        const validLeaders = form.leaders.filter((leader) => leader !== "");

        onSubmit({ ...form, leaders: validLeaders });
        setForm({ name: "", password: "", isAdmin: false, isLeader: false, leaders: [] });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 mb-3 bg-light rounded shadow-sm">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Nome
                </label>
                <input type="text" id="name" name="name" value={form.name} onChange={onChange} className="form-control" />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Senha
                </label>
                <input type="password" id="password" name="password" value={form.password} onChange={onChange} className="form-control" />
            </div>

            <div className="form-check mb-3">
                <input type="checkbox" id="isAdmin" name="isAdmin" checked={form.isAdmin} onChange={onChange} className="form-check-input" />
                <label htmlFor="isAdmin" className="form-check-label">
                    Admin
                </label>
            </div>

            <div className="form-check mb-3">
                <input type="checkbox" id="isLeader" name="isLeader" checked={form.isLeader} onChange={onChange} className="form-check-input" />
                <label htmlFor="isLeader" className="form-check-label">
                    Líder
                </label>
            </div>

            {form.leaders.map((leader, index) => (
                <div key={index} className="mb-3 d-flex align-items-center">
                    <select value={leader} onChange={(e) => handleLeaderSelectChange(index, e)} className="form-select me-2">
                        <option value="">Selecione um líder</option>
                        {Array.isArray(availableLeaders) && availableLeaders.length > 0 ? (
                            availableLeaders.map((availableLeader) => (
                                <option key={availableLeader.id} value={availableLeader.id}>
                                    {availableLeader.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                Nenhum líder disponível
                            </option>
                        )}
                    </select>
                    <button type="button" className="btn btn-danger" onClick={() => removeLeader(index)}>
                        Remover
                    </button>
                </div>
            ))}

            <button type="button" className="btn btn-primary mb-3" onClick={addLeaderSelect}>
                Novo Líder
            </button>
            <br />
            <button type="submit" className="btn btn-success">
                {editingUser ? "Atualizar" : "Criar"} Usuário
            </button>
        </form>
    );
};

export default UserForm;
