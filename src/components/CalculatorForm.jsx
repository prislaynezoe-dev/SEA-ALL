import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { calculateProportionalValue, calculatePlanChange, calculateOwnershipChange, calculateDiscount } from '@/lib/calculator';
import { plansFrom, plansTo, plansFromNetPara, plansToNetPara } from '@/lib/plans';
import { osMasks, osTypes } from '@/lib/osMasks';
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';

const CalculatorForm = ({ activeTab, onCalculate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [osMask, setOsMask] = useState('');
  const [osInputData, setOsInputData] = useState({});

  const resetForm = useCallback(() => {
    setFormData({
      monthlyValue: '',
      openingDate: '',
      closingDate: '',
      ownershipChangeDate: '',
      ownershipMonthlyValue: '',
      planFrom: '',
      planTo: '',
      planChangeDate: '',
      planFromNetPara: '',
      planToNetPara: '',
      planChangeDateNetPara: '',
      openingDateNetPara: '',
      closingDateNetPara: '',
      discountPlanValue: '',
      daysWithoutConnection: '',
      osType: '',
      seaOpeningDate: '',
      seaClosingDate: '',
      seaMonthlyValue: '',
      netParaOpeningDate: '',
      netParaClosingDate: '',
      netParaMonthlyValue: '',
    });
    setOsMask('');
    setOsInputData({});
    if (onCalculate) onCalculate(null);
  }, [onCalculate]);
  
  useEffect(() => {
    resetForm();
  }, [activeTab, resetForm]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOsInputChange = (field, value) => {
    setOsInputData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleOsTypeChange = (value) => {
    handleInputChange('osType', value);
    const template = osMasks[value];
    if (template) {
      setOsInputData({
        horario: '',
        prioridade: '',
        quemRecebe: '',
        endereco: '',
        reclamacao: template.defaults.reclamacao || '',
        observacao: template.defaults.observacao || '',
      });
    } else {
      setOsInputData({});
    }
    setOsMask('');
  };

  const generateOsMask = () => {
    const template = osMasks[formData.osType];
    if (!template) return;

    const finalMask = template.generate(osInputData);
    setOsMask(finalMask);
  };

  const handleCopyToClipboard = () => {
    if (!osMask) return;
    navigator.clipboard.writeText(osMask).then(() => {
        toast({
            title: 'Copiado! 📋',
            description: 'A máscara de O.S foi copiada para a área de transferência.',
        });
    });
  };

  const handleReset = () => {
    resetForm();
    toast({
      title: "Formulário limpo",
      description: "Todos os campos foram resetados."
    });
  };
  
  // Automatic calculation logic for tabs other than 'os'
  useEffect(() => {
    if (activeTab === 'os') return;
    try {
      let result = null;
      if (activeTab === 'proportional') {
        const seaMonthlyValue = parseFloat(formData.seaMonthlyValue);
        if (formData.seaOpeningDate && formData.seaClosingDate && seaMonthlyValue > 0) {
          result = calculateProportionalValue(seaMonthlyValue, formData.seaOpeningDate, formData.seaClosingDate);
        } else {
            const netParaMonthlyValue = parseFloat(formData.netParaMonthlyValue);
            if (formData.netParaOpeningDate && formData.netParaClosingDate && netParaMonthlyValue > 0) {
                result = calculateProportionalValue(netParaMonthlyValue, formData.netParaOpeningDate, formData.netParaClosingDate);
            }
        }
      } else if (activeTab === 'ownership') {
        const monthlyValue = parseFloat(formData.ownershipMonthlyValue);
        if (monthlyValue > 0 && formData.openingDate && formData.ownershipChangeDate) {
          result = calculateOwnershipChange(monthlyValue, formData.openingDate, formData.ownershipChangeDate);
        }
      } else if (activeTab === 'planChange') {
        const planFromData = plansFrom.find(p => p.value === formData.planFrom);
        const planToData = plansTo.find(p => p.value === formData.planTo);
        const planFromNetParaData = plansFromNetPara.find(p => p.value === formData.planFromNetPara);
        const planToNetParaData = plansToNetPara.find(p => p.value === formData.planToNetPara);

        if (planFromData && planToData && formData.planChangeDate && formData.openingDate && formData.closingDate) {
          result = calculatePlanChange(parseFloat(planFromData.price), parseFloat(planToData.price), formData.openingDate, formData.closingDate, formData.planChangeDate);
        } else if(planFromNetParaData && planToNetParaData && formData.planChangeDateNetPara && formData.openingDateNetPara && formData.closingDateNetPara) {
          result = calculatePlanChange(parseFloat(planFromNetParaData.price), parseFloat(planToNetParaData.price), formData.openingDateNetPara, formData.closingDateNetPara, formData.planChangeDateNetPara);
        }
      } else if (activeTab === 'discount') {
        const planValue = parseFloat(formData.discountPlanValue);
        const days = parseInt(formData.daysWithoutConnection, 10);
        if (planValue > 0 && days > 0) {
          result = calculateDiscount(planValue, days);
        }
      }
      onCalculate(result);
    } catch (error) {
      onCalculate(null);
    }
  }, [formData, activeTab, onCalculate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ownership':
        return (
          <div className="space-y-4">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">*Proporcional de cancelamento até a data da troca.</p>
            <div className="space-y-1">
              <Label htmlFor="openingDateOwnership">Data de Abertura da Fatura</Label>
              <Input id="openingDateOwnership" type="date" value={formData.openingDate || ''} onChange={(e) => handleInputChange('openingDate', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ownershipChangeDate">Data da Troca</Label>
              <Input id="ownershipChangeDate" type="date" value={formData.ownershipChangeDate || ''} onChange={(e) => handleInputChange('ownershipChangeDate', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ownershipMonthlyValue">Valor Total da Mensalidade (R$)</Label>
              <Input id="ownershipMonthlyValue" type="number" step="0.01" placeholder="Ex: 99,90" value={formData.ownershipMonthlyValue || ''} onChange={(e) => handleInputChange('ownershipMonthlyValue', e.target.value)} />
            </div>
          </div>
        );
      case 'planChange':
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-[#4A2F8C] rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">Proporcional entre planos (SEA)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-2">
                        <Label>De:</Label>
                        <Combobox options={plansFrom} value={formData.planFrom} onSelect={(value) => handleInputChange('planFrom', value)} placeholder="Selecione o plano atual" />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <Label>Para:</Label>
                        <Combobox options={plansTo} value={formData.planTo} onSelect={(value) => handleInputChange('planTo', value)} placeholder="Selecione o novo plano" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="openingDatePlan">Abertura</Label>
                        <Input id="openingDatePlan" type="date" value={formData.openingDate || ''} onChange={(e) => handleInputChange('openingDate', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="closingDatePlan">Fechamento</Label>
                        <Input id="closingDatePlan" type="date" value={formData.closingDate || ''} onChange={(e) => handleInputChange('closingDate', e.target.value)} />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <Label htmlFor="planChangeDate">Data da Troca do Plano</Label>
                        <Input id="planChangeDate" type="date" value={formData.planChangeDate || ''} onChange={(e) => handleInputChange('planChangeDate', e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="border border-gray-200 dark:border-[#4A2F8C] rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">Proporcional entre planos (Net Pará)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-2">
                        <Label>De:</Label>
                        <Combobox options={plansFromNetPara} value={formData.planFromNetPara} onSelect={(value) => handleInputChange('planFromNetPara', value)} placeholder="Selecione o plano atual (Net Pará)" />
                    </div>
                     <div className="space-y-1 col-span-2">
                        <Label>Para:</Label>
                        <Combobox options={plansToNetPara} value={formData.planToNetPara} onSelect={(value) => handleInputChange('planToNetPara', value)} placeholder="Selecione o novo plano (Net Pará)" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="openingDateNetPara">Abertura</Label>
                        <Input id="openingDateNetPara" type="date" value={formData.openingDateNetPara || ''} onChange={(e) => handleInputChange('openingDateNetPara', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="closingDateNetPara">Fechamento</Label>
                        <Input id="closingDateNetPara" type="date" value={formData.closingDateNetPara || ''} onChange={(e) => handleInputChange('closingDateNetPara', e.target.value)} />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <Label htmlFor="planChangeDateNetPara">Data da Troca do Plano</Label>
                        <Input id="planChangeDateNetPara" type="date" value={formData.planChangeDateNetPara || ''} onChange={(e) => handleInputChange('planChangeDateNetPara', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
        );
      case 'discount':
        return (
          <div className="space-y-4">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">*Cálculo de desconto por dias sem serviço.</p>
            <div className="space-y-1">
              <Label htmlFor="discountPlanValue">Valor do plano (R$)</Label>
              <Input id="discountPlanValue" type="number" placeholder="Ex: 99,90" step="0.01" value={formData.discountPlanValue || ''} onChange={(e) => handleInputChange('discountPlanValue', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="daysWithoutConnection">Dias sem conexão</Label>
              <Input id="daysWithoutConnection" type="number" placeholder="Ex: 3" step="1" value={formData.daysWithoutConnection || ''} onChange={(e) => handleInputChange('daysWithoutConnection', e.target.value)} />
            </div>
          </div>
        );
      case 'os':
        const currentOsMask = osMasks[formData.osType];
        return (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="osType">Tipo de O.S</Label>
                    <Combobox 
                        options={osTypes} 
                        value={formData.osType} 
                        onSelect={handleOsTypeChange} 
                        placeholder="Selecione um tipo de O.S." 
                    />
                </div>

                {formData.osType && (
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="osHorario">HORÁRIO DE ATENDIMENTO</Label>
                            <Input 
                                id="osHorario" 
                                value={osInputData.horario || ''} 
                                onChange={e => handleOsInputChange('horario', e.target.value)} 
                                placeholder="Insira o horário de atendimento"
                            />
                        </div>
                        <div>
                            <Label htmlFor="osPrioridade">PRIORIDADE</Label>
                            <Input 
                                id="osPrioridade" 
                                value={osInputData.prioridade || ''} 
                                onChange={e => handleOsInputChange('prioridade', e.target.value)} 
                                placeholder="Insira a prioridade"
                            />
                        </div>
                        <div>
                            <Label htmlFor="osQuemRecebe">QUEM VAI RECEBER A EQUIPE</Label>
                            <Input 
                                id="osQuemRecebe" 
                                placeholder="Insira quem irá receber a equipe" 
                                value={osInputData.quemRecebe || ''} 
                                onChange={e => handleOsInputChange('quemRecebe', e.target.value)} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="osEndereco">ENDEREÇO</Label>
                            <Input id="osEndereco" placeholder={currentOsMask?.defaults.endereco} value={osInputData.endereco || ''} onChange={e => handleOsInputChange('endereco', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="osReclamacao">RECLAMAÇÃO</Label>
                            <Textarea id="osReclamacao" value={osInputData.reclamacao || ''} onChange={e => handleOsInputChange('reclamacao', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <Label htmlFor="osObservacao">OBSERVAÇÃO</Label>
                            <Textarea id="osObservacao" value={osInputData.observacao || ''} onChange={e => handleOsInputChange('observacao', e.target.value)} rows={3} />
                        </div>
                        <Button onClick={generateOsMask} className="w-full">Gerar Máscara</Button>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="osMaskResult">Máscara Gerada</Label>
                <Textarea id="osMaskResult" value={osMask} readOnly rows={16} className="bg-gray-100 dark:bg-black/20" />
                {osMask && <Button onClick={handleCopyToClipboard} className="w-full" variant="secondary"><Copy className="mr-2 h-4 w-4" />Copiar Máscara</Button>}
            </div>
          </div>
      );
      case 'proportional':
      default:
        return (
          <div className="space-y-4">
             <div className="border border-gray-200 dark:border-[#4A2F8C] rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">Proporcional de Vencimento (SEA)</h3>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="seaOpeningDate">Abertura</Label>
                        <Input id="seaOpeningDate" type="date" value={formData.seaOpeningDate || ''} onChange={(e) => handleInputChange('seaOpeningDate', e.target.value)} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">*Abertura do antigo venc.</p>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="seaClosingDate">Fechamento</Label>
                        <Input id="seaClosingDate" type="date" value={formData.seaClosingDate || ''} onChange={(e) => handleInputChange('seaClosingDate', e.target.value)} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">*Fechamento do novo venc.</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="seaMonthlyValue">Valor Total da Mensalidade (R$)</Label>
                      <Input id="seaMonthlyValue" type="number" step="0.01" placeholder="Ex: 99,90" value={formData.seaMonthlyValue || ''} onChange={(e) => handleInputChange('seaMonthlyValue', e.target.value)} />
                    </div>
                 </div>
             </div>
             <div className="border border-gray-200 dark:border-[#4A2F8C] rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">Proporcional de Vencimento (Net Pará)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="netParaOpeningDate">Abertura</Label>
                      <Input id="netParaOpeningDate" type="date" value={formData.netParaOpeningDate || ''} onChange={(e) => handleInputChange('netParaOpeningDate', e.target.value)} />
                      <p className="text-xs text-gray-500 dark:text-gray-400">*Abertura do antigo venc.</p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="netParaClosingDate">Fechamento</Label>
                      <Input id="netParaClosingDate" type="date" value={formData.netParaClosingDate || ''} onChange={(e) => handleInputChange('netParaClosingDate', e.target.value)} />
                      <p className="text-xs text-gray-500 dark:text-gray-400">*Fechamento do novo venc.</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="netParaMonthlyValue">Valor Total da Mensalidade (R$)</Label>
                    <Input id="netParaMonthlyValue" type="number" step="0.01" placeholder="Ex: 99,90" value={formData.netParaMonthlyValue || ''} onChange={(e) => handleInputChange('netParaMonthlyValue', e.target.value)} />
                  </div>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#2D1A4D] rounded-xl shadow-lg p-6 border border-gray-200 dark:border-[#4A2F8C] flex flex-col justify-between h-full"
    >
      <div>{renderTabContent()}</div>
      
      {activeTab !== 'os' && (
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-600/80 dark:bg-black/80 hover:bg-gray-700 dark:hover:bg-black text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all duration-300"
            >
              Limpar
            </Button>
          </div>
      )}
    </div>
  );
};

export default CalculatorForm;
