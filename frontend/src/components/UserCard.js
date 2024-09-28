import React from "react";

const UserCard = ({ user, onEdit, onDelete }) => {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                    {user.isAdmin ? (
                        <span className="badge bg-success" style={{ marginRight: "5px" }}>
                            Admin
                        </span>
                    ) : null}
                    {user.isLeader ? <span className="badge bg-success">Líder</span> : null}
                </p>

                <p className="card-text">
                    <strong>Líderes:</strong>
                    {Array.isArray(user.leaders) && user.leaders.length > 0 ? (
                        <ul className="list-unstyled">
                            {user.leaders.map((leader, index) => (
                                <li key={index} className="ms-3">
                                    • {leader}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        " Nenhum"
                    )}
                </p>

                {user.isLeader ? (
                    <p className="card-text">
                        <strong>Liderados:</strong>
                        {Array.isArray(user.subordinates) && user.subordinates.length > 0 ? (
                            <ul className="list-unstyled">
                                {user.subordinates.map((subordinate, index) => (
                                    <li key={index} className="ms-3">
                                        • {subordinate}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            " Nenhum"
                        )}
                    </p>
                ) : null}

                <button onClick={() => onEdit(user)} className="btn btn-warning me-2">
                    Editar
                </button>
                <button onClick={() => onDelete(user.id)} className="btn btn-danger">
                    Deletar
                </button>
            </div>
        </div>
    );
};

export default UserCard;
