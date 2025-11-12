import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IdeaCard from './IdeaCard';

const IdeaList = ({ ideas, loading, ...props }) => {
    if (loading) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-400">Carregando ideias...</p>
            </div>
        );
    }

    if (ideas.length === 0) {
        return (
            <div className="text-center py-10 bg-white/5 dark:bg-[#2d1a4d]/50 rounded-lg">
                <p className="text-gray-400">Nenhuma ideia foi compartilhada ainda.</p>
                <p className="text-gray-500 text-sm">Seja o primeiro a fazer a diferença!</p>
            </div>
        );
    }

    return (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {ideas.map(idea => (
                    <IdeaCard
                        key={idea.id}
                        idea={idea}
                        {...props}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default IdeaList;
