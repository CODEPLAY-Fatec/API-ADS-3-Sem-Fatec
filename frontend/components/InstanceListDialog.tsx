import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    IconButton
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
type Instance = {
    id: number;
    uid: number;
    team_id: number;
    created: string;
    open: number;
    team_name: string;
};

type InstanceListDialogProps = {
    open: boolean;
    onClose: () => void;
    surveyId: number; // Adiciona surveyId para filtrar instâncias específicas
};

const InstanceListDialog: React.FC<InstanceListDialogProps> = ({ open, onClose, surveyId }) => {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState(false);

    // Função para buscar as instâncias da API usando useCallback
    const fetchInstances = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/api/survey/instance/${surveyId}`);
            setInstances(response.data);
        } catch (error) {
            console.error("Erro ao buscar instâncias:", error);
        } finally {
            setLoading(false);
        }
    }, [surveyId]);

    // Função para fechar a instância
    const closeInstance = async (id: number, state: number) => {
        try {
            await axios.put(`http://localhost:3001/api/survey/instance/${id}/${state}`, {
                survey_id: id,
                state: state
            });
            fetchInstances(); // Atualiza a lista de instâncias após fechar
        } catch (error) {
            console.error("Erro ao fechar a instância:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchInstances();
        }
    }, [open, fetchInstances]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Lista de Instâncias</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : instances.length > 0 ? (
                    <List>
                        {instances
                            .map((instance) => (
                                <ListItem key={instance.id}>
                                    <ListItemText
                                        primary={`Time com a pesquisa criada: ${instance.team_name}`}
                                        secondary={
                                            <>
                                                <div>Criado em: {new Date(instance.created).toLocaleDateString()}</div>
                                                <div>Estado: {instance.open === 1 ? "Aberto" : "Fechado"}</div>
                                            </>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            edge="end"
                                            aria-label="fechar"
                                            onClick={() => closeInstance(instance.id, 0)}
                                        >
                                            <LockIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="abrir"
                                            onClick={() => closeInstance(instance.id, 1)}
                                        >
                                            <LockOpenIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                    </List>
                ) : (
                    <div>Nenhuma instância criada</div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InstanceListDialog;
