"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Collapse } from "react-bootstrap";
import ConfirmDialog from "@/components/confirmDialog";
import InstanceListDialog from "@/components/InstanceListDialog";
import './opensurvey.css';
import { BaseSurvey } from "@/types/Survey";
import Link from "next/link";

interface Team {
    id: number;
    name: string;
}

const SurveyList = () => {
    const [surveys, setSurveys] = useState<BaseSurvey[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSurveyId, setOpenSurveyId] = useState<number | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'send' | 'delete' | 'send+auto' | null>(null); // Novo estado para ação do diálogo
    const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
    const [isInstanceDialogOpen, setIsInstanceDialogOpen] = useState(false);
    const [instanceSurveyId, setInstanceSurveyId] = useState<number | null>(null);

    useEffect(() => {
        fetchSurveysAndTeams();
    }, []);

    const fetchSurveysAndTeams = async () => {
        try {
            setLoading(true);
            const [surveyResponse, teamResponse] = await Promise.all([
                axios.get("/api/survey/base"),
                axios.get("/api/team"),
            ]);

            if (Array.isArray(surveyResponse.data)) {
                setSurveys(surveyResponse.data);
            } else {
                throw new Error("Formato inesperado de dados da resposta de pesquisas.");
            }

            if (Array.isArray(teamResponse.data)) {
                setTeams(teamResponse.data);
            } else {
                throw new Error("Formato inesperado de dados da resposta de times.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setError("Não foi possível carregar os dados. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSurvey = (uid: number) => {
        setOpenSurveyId(prevId => (prevId === uid ? null : uid));
    };

    const openConfirmationDialog = (surveyUid: number, action: 'send' | 'delete' | 'send+auto') => {
        setSelectedSurveyId(surveyUid);
        setDialogAction(action);
        setIsDialogOpen(true);
    };

    const closeConfirmationDialog = () => {
        setIsDialogOpen(false);
        setSelectedSurveyId(null);
        setDialogAction(null);
    };

    const handleDeleteSurvey = async () => {
        try {
            await axios.delete(`/api/survey/base/${selectedSurveyId}`);
            alert("Pesquisa deletada com sucesso!");
            closeConfirmationDialog();
            fetchSurveysAndTeams();
        } catch (error) {
            console.error("Erro ao deletar pesquisa:", error);
            alert("Não foi possível deletar a pesquisa. Tente novamente.");
            closeConfirmationDialog();
        }
    };

    const handleSendSurvey = async () => {
        if (!selectedTeam) {
            alert("Por favor, selecione um time antes de enviar.");
            return;
        }

        try {
            await axios.post(`/api/survey/instance/${selectedSurveyId}`, {
                team_id: selectedTeam
            });
            if (dialogAction === 'send+auto') {
              // TODO: DEPOIS EU CONTINUO ISSO AQUI (ass: Gabriel Vasconcelos)
            }
            alert("Pesquisa enviada com sucesso!");
            closeConfirmationDialog();
        } catch (error) {
            console.error("Erro ao enviar pesquisa:", error);
            alert("Não foi possível enviar a pesquisa. Tente novamente.");
            closeConfirmationDialog();
        }
    };

    const openInstanceDialog = (surveyUid: number) => {
        setInstanceSurveyId(surveyUid);
        setIsInstanceDialogOpen(true);
    };

    const closeInstanceDialog = () => {
        setIsInstanceDialogOpen(false);
        setInstanceSurveyId(null);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="flex-grow-1 text-center mb-4">Lista de Pesquisas</h1>
                <Link href="/home/surveys/surveycrud">
                    <button className="btn btn-secondary ms-3">Voltar</button>
                </Link>
            </div>

            {surveys.length > 0 ? (
                surveys.map((survey) => (
                    <div key={`survey-${survey.uid}`} className="card shadow-sm mb-4">
                        <div className="card-header" onClick={() => survey.uid !== undefined && toggleSurvey(survey.uid)} style={{ cursor: "pointer" }}>
                            <h3>{survey.title}</h3>
                        </div>
                        <Collapse in={openSurveyId === survey.uid}>
                            <div className="card-body">
                                <p><strong>Descrição:</strong> {survey.description}</p>
                                <p><strong>Categoria:</strong> {survey.category}</p>

                                <h5>Perguntas:</h5>
                                <ul className="list-group">
                                    {survey.questions.map((question, questionIndex) => (
                                        <li key={`question-${survey.uid}-${questionIndex}`} className="list-group-item">
                                            <p><strong>Pergunta:</strong> {question.question}</p>
                                            <p><strong>Categoria da Pergunta:</strong> {question.category}</p>
                                            <p><strong>Tipo:</strong> {question.type}</p>
                                            {question.type !== "Text" && question.options && question.options.length > 0 && (
                                                <ul className="mt-2">
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={`option-${survey.uid}-${questionIndex}-${optionIndex}`} className="list-group-item">
                                                            {option}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-3">
                                    <label htmlFor="teamSelect"><strong>Selecione o time para enviar/reenviar pesquisa:</strong></label>
                                    <select
                                        id="teamSelect"
                                        className="form-select mt-2"
                                        value={selectedTeam || ''}
                                        onChange={(e) => setSelectedTeam(Number(e.target.value))}
                                    >
                                        <option value="">Escolha um time...</option>
                                        {teams.map((team) => (
                                            <option key={team.name} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    className="btn btn-primary mt-3 me-2"
                                    onClick={() => survey.uid !== undefined && openConfirmationDialog(survey.uid, 'send')}
                                >
                                    Enviar Pesquisa
                                </button>
                                <button
                                    className="btn btn-secondary mt-3 me-2"
                                    onClick={() => survey.uid !== undefined && openConfirmationDialog(survey.uid, 'send+auto')}
                                >
                                Enviar com autoavaliação correspondente
                                </button>


                                <button
                                    className="btn btn-danger mt-3 me-2"
                                    onClick={() => survey.uid !== undefined && openConfirmationDialog(survey.uid, 'delete')}
                                >
                                    Deletar pesquisa
                                </button>

                                <button
                                    className="btn btn-info mt-3"
                                    onClick={() => survey.uid !== undefined && openInstanceDialog(survey.uid)}
                                >
                                    Ver Instâncias
                                </button>

                            </div>
                        </Collapse>
                    </div>
                ))
            ) : (
                <p className="alert alert-warning text-center">
                    Nenhuma pesquisa disponível no momento.
                </p>
            )}

            {/* Usando ConfirmDialog */}
            <ConfirmDialog
                open={isDialogOpen}
                title={dialogAction === 'send' && "Confirmar Envio" || dialogAction == 'send+auto' && "Confirmar envio com autoavaliação correspondente" || "Confirmar Exclusão"}
                message={
                    dialogAction === 'send' || dialogAction === 'send+auto'
                        ? "Tem certeza? Se essa pesquisa já estiver aberta para esse time, o envio fechará a pesquisa anterior."
                        : "Tem certeza de que deseja deletar esta pesquisa? Essa ação não pode ser desfeita e perderá todos as respostas que estiveram ligação com essa pesquisa."
                }
                onConfirm={dialogAction === 'send' || dialogAction === 'send+auto' ? handleSendSurvey : handleDeleteSurvey}
                onCancel={closeConfirmationDialog}
            />

            {instanceSurveyId && (
                <InstanceListDialog
                    open={isInstanceDialogOpen}
                    onClose={closeInstanceDialog}
                    surveyId={instanceSurveyId}
                />
            )}
        </div>
    );
};

export default SurveyList;
