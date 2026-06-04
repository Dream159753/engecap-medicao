'use client';

import { useState, useEffect } from 'react';

type Andar = { nome: string; volume: number; area: number };
type Secao = { nome: string; andares: Andar[] };

type ServicoLiberado = {
  id: number;
  secao: string;
  andar: string;
  servico: string;
  quantidadeTotal: number;
  quantidadeLiberada: number;
  liberado: boolean;
};

export default function LiberacaoTarefas() {
  const [servicos, setServicos] = useState<ServicoLiberado[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('secoesObra');
    if (!salvo) return;

    const secoes: Secao[] = JSON.parse(salvo);
    const lista: ServicoLiberado[] = [];

    secoes.forEach((secao, s) => {
      secao.andares.forEach((andar, a) => {
        lista.push({
          id: s * 1000 + a * 100 + 1,
          secao: secao.nome,
          andar: andar.nome,
          servico: "Forma + Armação + Concretagem",
          quantidadeTotal: andar.area || 0,
          quantidadeLiberada: 0,
          liberado: false
        });
        lista.push({
          id: s * 1000 + a * 100 + 2,
          secao: secao.nome,
          andar: andar.nome,
          servico: "Desforma",
          quantidadeTotal: andar.area || 0,
          quantidadeLiberada: 0,
          liberado: false
        });
      });
    });

    setServicos(lista);
  }, []);

  const atualizarQuantidade = (id: number, valor: number) => {
    setServicos(servicos.map(s => s.id === id ? { ...s, quantidadeLiberada: valor } : s));
  };

  const toggleLiberacao = (id: number) => {
    const novos = servicos.map(s => s.id === id ? { ...s, liberado: !s.liberado } : s);
    setServicos(novos);
    localStorage.setItem('servicosLiberados', JSON.stringify(novos));
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Liberação de Tarefas</h2>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Seção</th>
              <th className="p-4 text-left">Andar</th>
              <th className="p-4 text-left">Serviço</th>
              <th className="p-4 text-center">Total Cadastrado (m²)</th>
              <th className="p-4 text-center">Quantidade a Liberar</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.secao}</td>
                <td className="p-4">{item.andar}</td>
                <td className="p-4">{item.servico}</td>
                <td className="p-4 text-center font-semibold">{item.quantidadeTotal}</td>
                <td className="p-4 text-center">
                  <input 
                    type="number" 
                    value={item.quantidadeLiberada} 
                    onChange={(e) => atualizarQuantidade(item.id, Number(e.target.value) || 0)}
                    className="w-28 text-center border rounded py-2"
                  />
                </td>
                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full ${item.liberado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.liberado ? '✅ Liberado' : '⏳ Pendente'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => toggleLiberacao(item.id)} className={`px-8 py-2 rounded ${item.liberado ? 'bg-red-100 text-red-600' : 'bg-green-600 text-white'}`}>
                    {item.liberado ? 'Bloquear' : 'Liberar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}