import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const ideaCategories = [
    "Atendimento ao cliente", "Processos internos", "Sistema / Ferramentas",
    "Qualidade / Monitoria", "Treinamento / Comunicação interna",
    "Motivação / Clima organizacional", "Produtividade"
];

const expectedBenefitsOptions = [
    "Reduz tempo de atendimento", "Melhora satisfação do cliente",
    "Facilita o trabalho da equipe", "Gera economia"
];

const impactOptions = ["Baixo impacto", "Médio impacto", "Alto impacto"];
const implementationOptions = ["Fácil (baixo custo / rápido)", "Moderado (algum investimento)", "Difícil (depende de TI / mudanças grandes)"];

const IdeaForm = ({ onAddIdea, user }) => {
    const { toast } = useToast();
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [ideaData, setIdeaData] = useState({
        nome: '', equipe: '', turno: '', anonimo: false,
        categoria: '', titulo: '', descricao: '', problema: '',
        beneficios: [], impacto: '', implementacao: ''
    });

    const handleInputChange = (field, value) => {
        setIdeaData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (checked) => {
        setIsAnonymous(checked);
        handleInputChange('anonimo', checked);
        if (checked) {
            handleInputChange('nome', '');
            handleInputChange('equipe', '');
            handleInputChange('turno', '');
        }
    };

    const handleBenefitsChange = (benefit) => {
        const currentBenefits = ideaData.beneficios;
        const newBenefits = currentBenefits.includes(benefit)
            ? currentBenefits.filter(b => b !== benefit)
            : [...currentBenefits, benefit];
        handleInputChange('beneficios', newBenefits);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ideaData.titulo || !ideaData.descricao) {
            toast({ variant: "destructive", title: "Campos obrigatórios", description: "Título e descrição são necessários." });
            return;
        }

        onAddIdea({
            ...ideaData,
            data_envio: new Date().toISOString(),
            status: 'Recebida',
            user_id: user?.id,
        });

        setIdeaData({
            nome: '', equipe: '', turno: '', anonimo: false,
            categoria: '', titulo: '', descricao: '', problema: '',
            beneficios: [], impacto: '', implementacao: ''
        });
        setIsAnonymous(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#2D1A4D] p-6 rounded-xl shadow-lg border border-gray-200 dark:border-[#4A2F8C]">
            <div className="text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F9438D] to-[#A82FFC]">Compartilhe sua Ideia!</h2>
                <p className="text-gray-500 dark:text-gray-400">Juntos, podemos fazer a diferença.</p>
            </div>

            <div className="space-y-4 p-4 border border-gray-200 dark:border-[#4A2F8C] rounded-lg">
                <h3 className="font-semibold">1. Identificação (Opcional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Nome completo" disabled={isAnonymous} value={ideaData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
                    <Select onValueChange={(v) => handleInputChange('equipe', v)} disabled={isAnonymous} value={ideaData.equipe}>
                        <SelectTrigger><SelectValue placeholder="Equipe" /></SelectTrigger>
                        <SelectContent><SelectItem value="BACKBONE">BACKBONE</SelectItem><SelectItem value="FIBRA">FIBRA</SelectItem><SelectItem value="TERABYTE">TERABYTE</SelectItem></SelectContent>
                    </Select>
                    <Select onValueChange={(v) => handleInputChange('turno', v)} disabled={isAnonymous} value={ideaData.turno} className="col-span-2 md:col-span-1">
                        <SelectTrigger><SelectValue placeholder="Turno de trabalho" /></SelectTrigger>
                        <SelectContent><SelectItem value="6X1">6X1</SelectItem><SelectItem value="12x36">12x36</SelectItem></SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="anonymous" className="cursor-pointer">Prefiro não me identificar</Label>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <Label>2. Categoria da Ideia</Label>
                    <Select onValueChange={(v) => handleInputChange('categoria', v)} value={ideaData.categoria}><SelectTrigger><SelectValue placeholder="Selecione a categoria..." /></SelectTrigger>
                        <SelectContent>{ideaCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>3. Título da Ideia</Label>
                    <Input placeholder="Um resumo breve da sua ideia" maxLength="100" value={ideaData.titulo} onChange={(e) => handleInputChange('titulo', e.target.value)} required />
                </div>
            </div>

            <div className="space-y-1">
                <Label>4. Descrição da Ideia</Label>
                <Textarea placeholder="Explique claramente o que é a ideia, como funcionaria e qual problema resolve." value={ideaData.descricao} onChange={(e) => handleInputChange('descricao', e.target.value)} required />
            </div>

            <div className="space-y-1">
                <Label>5. Problema Identificado</Label>
                <Textarea placeholder="Qual situação ou dificuldade motivou essa ideia?" value={ideaData.problema} onChange={(e) => handleInputChange('problema', e.target.value)} />
            </div>

            <div className="space-y-3">
                <Label>6. Benefícios Esperados</Label>
                <div className="grid sm:grid-cols-2 gap-2">
                    {expectedBenefitsOptions.map(b => (
                        <div key={b} className="flex items-center space-x-2">
                            <Checkbox id={b} onCheckedChange={() => handleBenefitsChange(b)} checked={ideaData.beneficios.includes(b)} />
                            <Label htmlFor={b} className="font-normal cursor-pointer">{b}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <Label>7. Impacto Estimado</Label>
                    <Select onValueChange={(v) => handleInputChange('impacto', v)} value={ideaData.impacto}><SelectTrigger><SelectValue placeholder="Selecione o impacto..." /></SelectTrigger>
                        <SelectContent>{impactOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>8. Facilidade de Implementação</Label>
                    <Select onValueChange={(v) => handleInputChange('implementacao', v)} value={ideaData.implementacao}><SelectTrigger><SelectValue placeholder="Selecione a facilidade..." /></SelectTrigger>
                        <SelectContent>{implementationOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#F9438D] to-[#A82FFC] text-white font-bold">Enviar Ideia</Button>
        </form>
    );
};

export default IdeaForm;
