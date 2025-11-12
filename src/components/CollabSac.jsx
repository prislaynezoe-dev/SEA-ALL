import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRealtimeIdeas } from '@/hooks/useRealtimeIdeas';

import IdeaForm from './collabsac/IdeaForm';
import IdeaList from './collabsac/IdeaList';

const CollabSac = ({ isManager }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const { ideas, loading } = useRealtimeIdeas();

    const handleAction = async (action, successMessage, errorMessage) => {
        try {
            const { error } = await action();
            if (error) throw error;
            if (successMessage) {
                toast({ title: successMessage });
            }
            return true;
        } catch (error) {
            console.error(errorMessage, error);
            toast({
                variant: "destructive",
                title: errorMessage,
                description: error.message
            });
            return false;
        }
    };

    const addIdea = async (newIdeaData) => {
        const success = await handleAction(
            () => supabase.from('ideas').insert([newIdeaData]),
            "Ideia Enviada! 🚀",
            "Erro ao enviar ideia"
        );
        if (success) {
            setShowForm(false);
        }
    };

    const handleDelete = (ideaId) => {
        handleAction(
            () => supabase.from('ideas').delete().eq('id', ideaId),
            "Ideia deletada!",
            "Erro ao deletar ideia"
        );
    };

    const handleLike = (idea_id, isLiked) => {
        if (!user) return;
        const action = isLiked
            ? () => supabase.from('likes').delete().match({ idea_id: idea_id, user_id: user.id })
            : () => supabase.from('likes').insert([{ idea_id, user_id: user.id }]);
        handleAction(action, null, isLiked ? "Erro ao descurtir" : "Erro ao curtir");
    };

    const handleComment = (idea_id, comment_text) => {
        if (!user) return;
        handleAction(
            () => supabase.from('comments').insert([{ idea_id, comment_text, user_id: user.id }]),
            null,
            "Erro ao comentar"
        );
    };

    const handleStatusChange = (ideaId, newStatus, justification) => {
        if (!isManager) {
            toast({ variant: "destructive", title: "Acesso Negado", description: "Apenas gestores podem alterar o status." });
            return;
        }
        handleAction(
            () => supabase.from('ideas').update({ status: newStatus, justification }).eq('id', ideaId),
            "Status atualizado!",
            "Erro ao atualizar status"
        );
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowForm(prev => !prev)} className="bg-gradient-to-r from-[#F9438D] to-[#A82FFC] text-white font-bold">
                    {showForm ? 'Ver Ideias' : 'Adicionar Nova Ideia'}
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div key="form" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                        <IdeaForm onAddIdea={addIdea} user={user} />
                    </motion.div>
                ) : (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h2 className="text-2xl font-bold text-center mb-6 text-white">Mural de Ideias</h2>
                        <IdeaList
                            ideas={ideas}
                            loading={loading}
                            onLike={handleLike}
                            onComment={handleComment}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            isManager={isManager}
                            currentUser={user}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollabSac;
