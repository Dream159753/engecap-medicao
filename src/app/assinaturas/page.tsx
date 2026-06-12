'use client';

import { useState, useEffect } from 'react';

type MedicaoItem = {
  id: number;
  chapa: string;
  nome: string;
  funcao: string;
  servico: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
};

export default function AguardandoAssinatura() {
  const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
  const [assinaturas, setAssinaturas] = useState<Record<number, string>>({});
  const [medicaoSelecionada, setMedicaoSelecionada] = useState<MedicaoItem | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo) {
      setMedicoes(JSON.parse(salvo));
    }
  }, []);

  const registrarAssinatura = (id: number) => {
    const confirmacao = window.confirm(`Confirmar assinatura do funcionário?\n\n${medicoes.find(m => m.id === id)?.nome}`);
    if (confirmacao) {
      setAssinaturas(prev => ({
        ...prev,
        [id]: new Date().toLocaleString('pt-BR')
      }));
      alert("✅ Assinatura registrada com sucesso!");
    }
  };

  const removerMedicao = (id: number) => {
    if (confirm("Remover esta medição?")) {
      const novas = medicoes.filter(m => m.id !== id);
      setMedicoes(novas);
      localStorage.setItem('medicoesAguardandoAssinatura', JSON.stringify(novas));
    }
  };

  const totalGeral = medicoes.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Engecap Medição</h1>
          <p className="text-sm text-gray-500">Faena - 325</p>
        </div>
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">📊 Dashboard</a>
            <a href="/cadastro" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">📋 Cadastro</a>
            <a href="/liberacao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">🔓 Liberação</a>
            <a href="/medicao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">📝 Lançar Medição</a>
            <a href="/assinaturas" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">✍️ Aguardando Assinatura</a>
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Medições Aguardando Assinatura</h2>

        {medicoes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-20 text-center">
            <p className="text-2xl text-gray-400">Nenhuma medição aguardando assinatura no momento.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Funcionário</th>
                  <th className="p-4 text-left">Trecho / Serviço</th>
                  <th className="p-4 text-center">Quantidade (m³)</th>
                  <th className="p-4 text-center">Valor Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {medicoes.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{item.nome}</td>
                    <td className="p-4">{item.servico}</td>
                    <td className="p-4 text-center">{item.quantidade} m³</td>
                    <td className="p-4 text-center font-semibold">R$ {item.total}</td>
                    <td className="p-4 text-center">
                      {assinaturas[item.id] ? (
                        <span className="text-green-600 font-medium">✅ Assinado</span>
                      ) : (
                        <span className="text-orange-600 font-medium">⏳ Aguardando</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {!assinaturas[item.id] ? (
                        <button 
                          onClick={() => registrarAssinatura(item.id)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Registrar Assinatura
                        </button>
                      ) : (
                        <button 
                          onClick={() => removerMedicao(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 text-right text-2xl font-bold">
              Total Geral: R$ {totalGeral}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}