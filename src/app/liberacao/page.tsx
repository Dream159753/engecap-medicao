'use client';

import { useState, useEffect } from 'react';

type ServicoLiberado = {
  id: number;
  secao: string;
  andar: string;
  servico: string;
  liberado: boolean;
};

export default function LiberacaoTarefas() {
  const [servicos, setServicos] = useState<ServicoLiberado[]>([]);

  // Carrega do Cadastro
  useEffect(() => {
    const secoesSalvas = localStorage.getItem('secoesObra');
    if (secoesSalvas) {
      const secoes = JSON.parse(secoesSalvas);
      const lista: ServicoLiberado[] = [];

      secoes.forEach((secao: any, s: number) => {
        secao.andares.forEach((andar: any, a: number) => {
          lista.push({
            id: Date.now() + s * 100 + a * 10 + 1,
            secao: secao.nome,
            andar: andar.nome,
            servico: "Forma + Armação + Concretagem",
            liberado: false
          });
          lista.push({
            id: Date.now() + s * 100 + a * 10 + 2,
            secao: secao.nome,
            andar: andar.nome,
            servico: "Desforma",
            liberado: false
          });
        });
      });
      setServicos(lista);
    }
  }, []);

  const toggleLiberacao = (id: number) => {
    const novosServicos = servicos.map(s => 
      s.id === id ? { ...s, liberado: !s.liberado } : s
    );
    setServicos(novosServicos);
    
    // Salva no localStorage para a Medição ver
    localStorage.setItem('servicosLiberados', JSON.stringify(novosServicos));
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
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {servicos.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center text-gray-500">
                  Cadastre seções na tela de Cadastro primeiro
                </td>
              </tr>
            ) : (
              servicos.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.secao}</td>
                  <td className="p-4">{item.andar}</td>
                  <td className="p-4">{item.servico}</td>
                  <td className="p-4 text-center">
                    <span className={`px-5 py-2 rounded-full text-sm ${item.liberado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.liberado ? '✅ Liberado' : '⏳ Pendente'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleLiberacao(item.id)}
                      className={`px-8 py-2 rounded-lg text-sm font-medium ${item.liberado ? 'bg-red-100 text-red-600' : 'bg-green-600 text-white'}`}
                    >
                      {item.liberado ? 'Bloquear' : 'Liberar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}