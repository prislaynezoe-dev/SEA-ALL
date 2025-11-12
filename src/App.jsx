import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Wrench, Users, Repeat, Percent, FileText, Lightbulb, LogIn, LogOut } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Switch } from '@/components/ui/switch';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ReferenceTable from '@/components/ReferenceTable';
import CollabSac from '@/components/CollabSac';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const tabs = [
  { id: 'proportional', label: 'VENCIMENTO', icon: Wrench },
  { id: 'ownership', label: 'TITULARIDADE', icon: Users },
  { id: 'planChange', label: 'PLANOS', icon: Repeat },
  { id: 'discount', label: 'DESCONTO', icon: Percent },
  { id: 'os', label: 'MASK O.S', icon: FileText },
  { id: 'collab', label: 'COLLAB SAC', icon: Lightbulb },
];

function AuthModal({ isOpen, onOpenChange }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#2D1A4D]">
        <DialogHeader>
          <DialogTitle>Login de Gestor</DialogTitle>
          <DialogDescription>
            Insira suas credenciais de gestor para gerenciar as ideias.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
          <Input id="password" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
          <Button type="submit" className="w-full bg-gradient-to-r from-[#F9438D] to-[#A82FFC] text-white font-bold" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function App() {
  const { user, profile, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [calculationResult, setCalculationResult] = useState(null);
  const [activeTab, setActiveTab] = useState('proportional');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCalculationResult(null);
  };


  return (
    <>
      <Helmet>
        <title>SEA ALL - Calculadora e Ferramentas</title>
        <meta name="description" content="Calcule valores proporcionais, gere máscaras de O.S. e utilize outras ferramentas para otimizar seu trabalho." />
      </Helmet>
      
      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      <div className="min-h-screen bg-gray-100 dark:bg-[#1A0E2A] text-gray-800 dark:text-white transition-colors duration-300">
        
        <header className="container mx-auto px-4 pt-6 max-w-7xl">
           <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
             <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                 SEA ALL
               </h1>
             </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Button onClick={signOut} variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sair
                </Button>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)} variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Gestor
                </Button>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white dark:bg-[#2D1A4D] px-3 py-1.5 rounded-full shadow-md"
              >
                <Sun className="w-5 h-5 text-yellow-500" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-300"
                />
                <Moon className="w-5 h-5 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>

          <nav className="flex justify-center items-center mb-8">
            <div className="flex flex-wrap justify-center space-x-2 bg-white dark:bg-[#2D1A4D] p-2 rounded-xl shadow-lg border border-gray-200 dark:border-[#4A2F8C]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  } relative rounded-lg px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 my-1`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-10 bg-gradient-to-r from-[#F9438D] to-[#A82FFC]"
                      style={{ borderRadius: 8 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon className={`relative z-20 w-4 h-4`} />
                  <span className="relative z-20">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 max-w-7xl pb-12">
          <Toaster />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'collab' ? (
                 <CollabSac isManager={profile?.role === 'manager'} />
              ) : activeTab === 'os' ? (
                <CalculatorForm activeTab={activeTab} onCalculate={setCalculationResult} />
              ) : (
                <div className="grid lg:grid-cols-12 gap-6">
                   <div className="lg:col-span-3 lg:order-1">
                      <ReferenceTable />
                    </div>
                    <div className="lg:col-span-6 lg:order-2">
                        <CalculatorForm activeTab={activeTab} onCalculate={setCalculationResult} />
                    </div>
                   <div className="lg:col-span-3 lg:order-3">
                      <ResultsDisplay result={calculationResult} activeTab={activeTab} />
                    </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default App;
