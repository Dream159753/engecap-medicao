'use client';

import { useState, useEffect } from 'react';

type Andar = { nome: string; volume: number; area: number };
type Secao = { nome: string; andares: Andar[] };

type ServicoLiberado = {
  id: number;
  secao: string;
  andar: string;
  servico: string;
  quantidadeTotal: number;   // Total cadastrado no cadastro
  quantidadeLiberada: number; // Quanto o engenheiro vai liberar
  liberado: boolean;
};

export default function LiberacaoTarefas() {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [servicos, setServicos] = useState<ServicoLiberado[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('secoesObra');
    if (salvo) {
      const secoesCarregadas = JSON.parse(salvo);
      setSecoes(secoesCarregadas);

      const listaServicos: ServicoLiberado[] = [];

      secoesCarregadas.forEach((secao: Secao, sIndex: number) => {
        secao.andares.forEach((andar: Andar, aIndex: number) => {
          listaServicos.push({
            id: sIndex * 1000 + aIndex * 100 + 1,
            secao: secao.nome,
            andar: andar.nome,
            servico: "Forma + Armação + Concretagem",
            quantidadeTotal: andar.area || 0,
            quantidadeLiberada: 0,
            liberado: false
          });
          listaServicos.push({
            id: sIndex * 1000 + aIndex * 100 + 2,
            secao: secao.nome,
            andar: andar.nome,
            servico: "Desforma",
            quantidadeTotal: andar.area || 0,
            quantidadeLiberada: 0,
            liberado: false
          });
        });
      });

      setServicos(listaServicos);
    }
  }, []);

  const atualizarQuantidadeLiberada = (id: number, valor: number) => {
    setServicos(servicos.map(s => 
      s.id === id ? { ...s, quantidadeLiberada: valor } : s
    ));
  };

  const toggleLiberacao = (id: number) => {
    const novos = servicos.map(s => 
      s.id === id ? { ...s, liberado: !s.liberado } : s
    );
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
              <th className="p-4 text-center">Total Cadastrado</th>
              <th className="p-4 text-center">Liberar Quantidade</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {servicos.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-16 text-center text-gray-500">
                  Cadastre seções e andares na tela de Cadastro primeiro
                </td>
              </tr>
            ) : (
              servicos.map(item => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.secao}</td>
                  <td className="p-4">{item.andar}</td>
                  <td className="p-4">{item.servico}</td>
                  <td className="p-4 text-center font-semibold">{item.quantidadeTotal}</td>
                  <td className="p-4 text-center">
                    <input 
                      type="number" 
                      value={item.quantidadeLiberada} 
                      onChange={(e) => atualizarQuantidadeLiberada(item.id, Number(e.target.value) || 0)}
                      className="w-24 text-center border rounded-xl py-2"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-4 py-1 rounded-full text-sm ${item.liberado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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