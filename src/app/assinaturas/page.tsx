'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [assinaturas, setAssinaturas] = useState<Record<string, string>>({}); // chave por chapa

  useEffect(() => {
    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo) {
      setMedicoes(JSON.parse(salvo));
    }
  }, []);

  // Agrupa as medições por funcionário (chapa)
  const medicoesAgrupadas = medicoes.reduce((acc: any, item) => {
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

  const totalGeral = Object.values(medicoesAgrupadas).reduce((sum: number, grupo: any) => sum + grupo.total, 0);

  const registrarAssinatura = (chapa: string) => {
    if (confirm(`Confirmar assinatura de ${medicoesAgrupadas[chapa].nome}?`)) {
      setAssinaturas(prev => ({
        ...prev,
        [chapa]: new Date().toLocaleString('pt-BR')
      }));
      alert("✅ Assinatura registrada com sucesso!");
    }
  };

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

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Medições Aguardando Assinatura</h2>

        {medicoes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-20 text-center">
            <p className="text-xl text-gray-500">Nenhuma medição aguardando assinatura no momento.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Funcionário</th>
                  <th className="p-4 text-left">Trechos</th>
                  <th className="p-4 text-center">Quantidade Total</th>
                  <th className="p-4 text-center">Valor Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(medicoesAgrupadas).map((grupo: any) => (
                  <tr key={grupo.chapa} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      {grupo.nome}<br/>
                      <span className="text-sm text-gray-500">Chapa: {grupo.chapa}</span>
                    </td>
                    <td className="p-4">
                      {grupo.itens.map((item: any, i: number) => (
                        <div key={i} className="text-sm">{item.servico}</div>
                      ))}
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {grupo.itens.reduce((sum: number, item: any) => sum + item.quantidade, 0)} m³
                    </td>
                    <td className="p-4 text-center font-semibold">R$ {grupo.total}</td>
                    <td className="p-4 text-center">
                      {assinaturas[grupo.chapa] ? (
                        <span className="text-green-600 font-medium">✅ Assinado</span>
                      ) : (
                        <span className="text-orange-600">⏳ Aguardando</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {!assinaturas[grupo.chapa] && (
                        <Link href={`/assinatura?id=${grupo.itens[0].id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium">
                            Assinar Agora
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}