import React from 'react';
import { motion } from 'framer-motion';

const ReferenceTable = () => {
  const seaTableData = [
    { dia: '05 e 10', abertura: '01', fechamento: '30' },
    { dia: '15 e 20', abertura: '11', fechamento: '10' },
    { dia: '25 e 30', abertura: '21', fechamento: '20' },
  ];

  const netParaTableData = [
    { dia: '05', abertura: '06', fechamento: '05' },
    { dia: '10', abertura: '11', fechamento: '10' },
    { dia: '15', abertura: '16', fechamento: '15' },
    { dia: '20', abertura: '21', fechamento: '20' },
    { dia: '25', abertura: '26', fechamento: '25' },
    { dia: '30', abertura: '21', fechamento: '20' },
  ];

  const Table = ({ title, data }) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#4A2F8C]">
        <table className="w-full text-center">
          <thead className="bg-gray-100 dark:bg-[#1A0E2A]">
            <tr>
              <th className="py-2 px-3 font-semibold text-xs text-gray-600 dark:text-white">Dia</th>
              <th className="py-2 px-3 font-semibold text-xs text-gray-600 dark:text-white">Abertura</th>
              <th className="py-2 px-3 font-semibold text-xs text-gray-600 dark:text-white">Fechamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#4A2F8C]">
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className="bg-white dark:bg-[#2D1A4D] hover:bg-gray-50 dark:hover:bg-[#382261] transition-colors"
              >
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-white">{row.dia}</td>
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-white">{row.abertura}</td>
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-white">{row.fechamento}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-[#2D1A4D] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-[#4A2F8C] h-full"
    >
      <Table 
        title="Tabela Ref. SEA"
        data={seaTableData}
      />
      <Table 
        title="Tabela Ref. NET PARÁ"
        data={netParaTableData}
      />
    </motion.div>
  );
};

export default ReferenceTable;
