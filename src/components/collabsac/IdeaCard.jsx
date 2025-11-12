import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ThumbsUp, MessageSquare, Info, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusOptions = ['Recebida', 'Em avaliação', 'Aprovada para teste', 'Implementada', 'Recusada'];

const IdeaCard = ({ idea, onLike, onComment, onStatusChange, onDelete, isManager, currentUser }) => {
    const { toast } = useToast();
    const [commentText, setCommentText] = useState('');
    const [statusComment, setStatusComment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const liked = useMemo(() => {
        if (!currentUser) return false;
        return idea.likes?.some(like => like.user_id === currentUser.id);
    }, [idea.likes, currentUser]);

    const canDelete = useMemo(() => {
        if (!currentUser) return false;
        if (isManager) return true;
        return idea.user_id === currentUser.id;
    }, [currentUser, isManager, idea.user_id]);

    const handleLikeClick = () => {
        if (!currentUser) {
            toast({ variant: "destructive", title: "Login Necessário", description: "Faça login para curtir." });
            return;
        }
        onLike(idea.id, liked);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast({ variant: "destructive", title: "Login Necessário", description: "Faça login para comentar." });
            return;
        }
        if (commentText.trim()) {
            onComment(idea.id, commentText);
            setCommentText('');
        }
    };
    
    const handleStatusUpdate = (newStatus) => {
        if (!isManager) return;
        if (['Recebida', 'Em avaliação'].includes(newStatus)) {
            onStatusChange(idea.id, newStatus, null);
        } else {
            setSelectedStatus(newStatus);
        }
    };

    const confirmStatusChange = () => {
        if (!isManager) return;
        if (selectedStatus === 'Recusada' && statusComment.trim() === '') {
            toast({ variant: "destructive", title: "Justificativa obrigatória", description: "Por favor, adicione uma justificativa para a recusa." });
            return;
        }
        onStatusChange(idea.id, selectedStatus, statusComment || null);
        setStatusComment('');
        setSelectedStatus('');
    };

    const getDialogTitle = () => {
        if (selectedStatus === 'Recusada') return 'Adicionar Justificativa (Obrigatório)';
        if (selectedStatus === 'Aprovada para teste') return 'Adicionar Comentário (Opcional)';
        if (selectedStatus === 'Implementada') return 'Adicionar Comentário (Opcional)';
        return 'Adicionar Comentário';
    };

    const getDialogPlaceholder = () => {
        if (selectedStatus === 'Recusada') return 'Descreva o motivo da recusa...';
        return 'Adicione um comentário sobre esta etapa...';
    };
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'Recebida': return 'bg-blue-500/20 text-blue-300';
            case 'Em avaliação': return 'bg-yellow-500/20 text-yellow-300';
            case 'Aprovada para teste': return 'bg-purple-500/20 text-purple-300';
            case 'Implementada': return 'bg-green-500/20 text-green-300';
            case 'Recusada': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    }

    const showInfoIcon = idea.justification && ['Recusada', 'Aprovada para teste', 'Implementada'].includes(idea.status);

    const getInfoIconTitle = () => {
        if (idea.status === 'Recusada') return 'Justificativa da Recusa';
        if (idea.status === 'Aprovada para teste') return 'Comentário de Teste';
        if (idea.status === 'Implementada') return 'Comentário de Implementação';
        return 'Informação';
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="relative bg-white/5 dark:bg-[#2d1a4d]/50 p-5 rounded-lg border border-white/10"
        >
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                 {showInfoIcon && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Info className="h-4 w-4 text-yellow-400"/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{getInfoIconTitle()}</AlertDialogTitle>
                                <AlertDialogDescription className="whitespace-pre-wrap">
                                    {idea.justification}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction>Fechar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {isManager && (
                    <AlertDialog open={!!selectedStatus} onOpenChange={(open) => !open && setSelectedStatus('')}>
                        <Select onValueChange={handleStatusUpdate} value={idea.status}>
                            <SelectTrigger className="h-7 w-auto px-2 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{getDialogTitle()}</AlertDialogTitle>
                                <Textarea 
                                    placeholder={getDialogPlaceholder()} 
                                    value={statusComment} 
                                    onChange={e => setStatusComment(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {
                                    setStatusComment('');
                                    setSelectedStatus('');
                                }}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmStatusChange}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
            
            <div className={`flex justify-between items-start pt-2`}>
                <div className="pr-16">
                    <p className="text-xs text-gray-400">{idea.anonimo ? 'Colaborador Anônimo' : idea.nome || 'Usuário'}</p>
                    <h3 className="font-bold text-lg text-white">{idea.titulo}</h3>
                    <p className="text-xs text-gray-300">{idea.categoria}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(idea.status)} flex-shrink-0`}>{idea.status}</span>
            </div>

            <p className="text-sm text-gray-300 mt-3">{idea.descricao}</p>
            
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                <p>Enviado em: {new Date(idea.data_envio).toLocaleDateString()}</p>
                <div className="flex items-center gap-4">
                    <button onClick={handleLikeClick} className={`flex items-center gap-1 transition-colors ${liked ? 'text-[#F9438D]' : 'hover:text-[#F9438D]'}`}>
                        <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'}/> {idea.likes?.length || 0}
                    </button>
                    <div className="flex items-center gap-1">
                        <MessageSquare size={16}/> {idea.comments?.length || 0}
                    </div>
                </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
                 <h4 className="text-sm font-semibold mb-2 text-white">Comentários</h4>
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {idea.comments?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((comment) => (
                        <div key={comment.id} className="bg-black/20 p-2 rounded text-xs">
                           <p className="text-gray-300">{comment.comment_text}</p>
                        </div>
                    ))}
                    {(!idea.comments || idea.comments.length === 0) && <p className="text-xs text-gray-500">Nenhum comentário ainda.</p>}
                 </div>
                 <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-3">
                     <Input 
                        type="text" 
                        placeholder="Adicione um comentário..." 
                        className="text-xs" 
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                     />
                     <Button type="submit" size="sm">Enviar</Button>
                 </form>
            </div>
             {canDelete && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 size={16} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a ideia.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(idea.id)} className="bg-red-600 hover:bg-red-700">Deletar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </motion.div>
    );
};

export default IdeaCard;
