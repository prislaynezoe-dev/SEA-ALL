import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeIdeas = () => {
    const { toast } = useToast();
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIdeas = useCallback(async () => {
        console.log('[Realtime] Fetching all ideas...');
        try {
            const { data, error } = await supabase
                .from('ideas')
                .select('*, comments(*), likes(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setIdeas(data || []);
        } catch (error) {
            console.error('Error fetching ideas:', error);
            toast({
                variant: "destructive",
                title: "Erro ao buscar ideias",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Initial fetch
    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    // Realtime subscriptions and polling
    useEffect(() => {
        console.log('[Realtime] Setting up subscriptions and polling...');

        const handleRealtimeEvent = (payload) => {
            console.log('[Realtime] Event received!', payload);
            toast({
                title: "Novas atualizações!",
                description: "O mural de ideias foi atualizado.",
            });
            fetchIdeas();
        };

        const ideasChannel = supabase
            .channel('realtime-collab-sac-all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, handleRealtimeEvent)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, handleRealtimeEvent)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, handleRealtimeEvent)
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Realtime] Subscribed to all changes!');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('[Realtime] Subscription Error:', err);
                }
            });

        // Polling as a fallback mechanism
        const interval = setInterval(() => {
            console.log('[Polling] Fetching ideas as fallback...');
            fetchIdeas();
        }, 5000); // Poll every 5 seconds

        // Cleanup
        return () => {
            console.log('[Realtime] Cleaning up subscriptions and polling.');
            supabase.removeChannel(ideasChannel);
            clearInterval(interval);
        };
    }, [fetchIdeas, toast]);

    return { ideas, loading };
};
