"use client";
// níveis de acesso:

import React from "react";

// dashboard pessoal / usuário normal (pesquisas respondidas)
// dashboard de líder (respostas de autoavaliação de liderado, respostas de avaliação de liderado)
// dashboard de admin (tem acesso à avaliações de líderes)

// essa página vai ter apenas um dashboard, que exibe apenas os dados que o usuário logado possui acesso.
// ex: um líder tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder.
// ex: um admin tem acesso aos dados do dashboard pessoal + os dados de dashboard de líder + os dados de dashboard de admin.

export default class Page extends React.Component {
    render() {
        return (
            <div>
                <h1>Dashboard</h1>
            </div>
        )
    }
}