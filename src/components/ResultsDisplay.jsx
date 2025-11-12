import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp } from 'lucide-react';

const ResultsDisplay = ({ result, activeTab }) => {
  const renderContent = () => {
    if (!result) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
          <p>Aguardando cálculo...</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'proportional':
      case 'ownership':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Proporcional</p>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F9438D] to-[#A82FFC]">
                R$ {result.proportionalValue.toFixed(2)}
              </p>
            </div>
            <div className="text-sm text-center text-gray-600 dark:text-gray-300">
              {result.daysUsed} de 30 dias utilizados.
            </div>
          </div>
        );
      case 'planChange':
        return (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Proporcional do Plano Antigo</p>
              <p className="text-2xl font-semibold text-red-500">R$ {result.proportionalBefore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Proporcional do Plano Novo</p>
              <p className="text-2xl font-semibold text-green-500">R$ {result.proportionalAfter.toFixed(2)}</p>
            </div>
            <div className="!mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar na Próxima Fatura</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F9438D] to-[#A82FFC]">
                R$ {result.totalProportionalValue.toFixed(2)}
              </p>
            </div>
          </div>
        );
      case 'discount':
        return (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor com Desconto</p>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F9438D] to-[#A82FFC]">
                R$ {result.finalValue.toFixed(2)}
              </p>
            </div>
            <div className="text-sm text-green-500 dark:text-green-400">
              Desconto de R$ {result.discount.toFixed(2)} aplicado.
            </div>
          </div>
        );
      default:
        return <p>Selecione uma opção de cálculo.</p>;
    }
  };

  return (
    <Card className="bg-white/70 dark:bg-[#2D1A4D]/70 backdrop-blur-sm border-gray-200 dark:border-[#4A2F8C] shadow-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Resultados</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <motion.div
          key={activeTab + (result ? '1' : '0')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
