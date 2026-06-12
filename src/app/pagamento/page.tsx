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

export default function LiberarPagamento() {
  const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo) {
      setMedicoes(JSON.parse(salvo));
    }
  }, []);

  // Agrupa por funcionário
  const grupos = medicoes.reduce((acc: any, item) => {
    if (!acc[item.chapa]) {
      acc[item.chapa] = {
        chapa: item.chapa,
        nome: item.nome,
        funcao: item.funcao,
        itens: [],
        total: 0
      };
    }
    acc[item.chapa].itens.push(item);
    acc[item.chapa].total += item.total;
    return acc;
  }, {});

  const totalGeral = Object.values(grupos).reduce((sum: number, g: any) => sum + g.total, 0);

  const liberarParaDP = (chapa: string) => {
    if (confirm(`Liberar todas as medições de ${grupos[chapa].nome} para pagamento?`)) {
      const restantes = medicoes.filter(m => m.chapa !== chapa);
      localStorage.setItem('medicoesAguardandoAssinatura', JSON.stringify(restantes));
      
      setMedicoes(restantes);
      alert(`✅ Medições de ${grupos[chapa].nome} liberadas para o DP!`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
            <a href="/assinaturas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">✍️ Aguardando Assinatura</a>
            <a href="/pagamento" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">💰 Liberar para Pagamento</a>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Liberar para Pagamento</h2>

        {Object.keys(grupos).length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-20 text-center">
            <p className="text-xl text-gray-500">Nenhuma medição assinada pronta para pagamento.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(grupos).map((grupo: any) => (
              <div key={grupo.chapa} className="bg-white rounded-2xl shadow p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold">{grupo.nome}</h3>
                    <p className="text-gray-500">Chapa: {grupo.chapa} • {grupo.funcao}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total a Pagar</p>
                    <p className="text-3xl font-bold text-green-600">R$ {grupo.total}</p>
                  </div>
                </div>

                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left">Trecho / Serviço</th>
                      <th className="p-4 text-center">Quantidade (m³)</th>
                      <th className="p-4 text-center">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupo.itens.map((item: any, i: number) => (
                      <tr key={i} className="border-t">
                        <td className="p-4">{item.servico}</td>
                        <td className="p-4 text-center">{item.quantidade} m³</td>
                        <td className="p-4 text-center font-semibold">R$ {item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <button 
                    onClick={() => liberarParaDP(grupo.chapa)}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg"
                  >
                    💰 Liberar para DP / Pagamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}