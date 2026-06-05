'use client';

import { useState, useEffect } from 'react';

type Andar = {
  nome: string;
  volume: number;
  usaVolume: boolean;
};

type Secao = {
  nome: string;
  andares: Andar[];
};

type ServicoLiberado = {
  secao: string;
  andar: string;
  volumeTotal: number;
  volumeLiberado: number;
  liberado: boolean;
};

export default function LiberacaoTarefas() {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [servicosLiberados, setServicosLiberados] = useState<ServicoLiberado[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem('secoesObra');
    if (salvo) {
      const dados: Secao[] = JSON.parse(salvo);
      setSecoes(dados);

      // Gera serviços para liberação
      const liberados: ServicoLiberado[] = [];
      dados.forEach(secao => {
        secao.andares.forEach(andar => {
          if (andar.usaVolume) {
            liberados.push({
              secao: secao.nome,
              andar: andar.nome,
              volumeTotal: andar.volume,
              volumeLiberado: 0,
              liberado: false
            });
          }
        });
      });
      setServicosLiberados(liberados);
    }
  }, []);

  const atualizarVolumeLiberado = (index: number, valor: number) => {
    const novos = [...servicosLiberados];
    novos[index].volumeLiberado = valor;
    setServicosLiberados(novos);
  };

  const toggleLiberacao = (index: number) => {
    const novos = [...servicosLiberados];
    novos[index].liberado = !novos[index].liberado;
    setServicosLiberados(novos);

    // Salva no localStorage para a tela de Medição
    localStorage.setItem('servicosLiberados', JSON.stringify(novos));
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Liberação de Tarefas</h2>
      <div className="bg-white rounded-2xl shadow p-8">
        <h4 className="text-xl font-semibold mb-6">Serviços Cadastrados - Volume (m³)</h4>

        {servicosLiberados.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">Nenhuma seção cadastrada ainda. Volte na tela de Cadastro.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Seção</th>
                  <th className="p-4 text-left">Andar / Pavimento</th>
                  <th className="p-4 text-center">Volume Total (m³)</th>
                  <th className="p-4 text-center">Volume a Liberar (m³)</th>
                  <th className="p-4 text-center">Ação</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {servicosLiberados.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium">{item.secao}</td>
                    <td className="p-4">{item.andar}</td>
                    <td className="p-4 text-center font-semibold">{item.volumeTotal}</td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        value={item.volumeLiberado} 
                        onChange={(e) => atualizarVolumeLiberado(index, Number(e.target.value) || 0)}
                        className="w-full border rounded-lg px-3 py-2 text-center"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleLiberacao(index)}
                        className={`px-6 py-2 rounded-lg font-medium ${item.liberado ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
                      >
                        {item.liberado ? 'Liberado' : 'Liberar'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-4 py-1 rounded-full text-sm ${item.liberado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.liberado ? '✅ Liberado' : '⏳ Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button 
            onClick={() => alert('✅ Liberações salvas! Agora vá para a tela de Medição.')}
            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg"
          >
            Finalizar Liberações
          </button>
        </div>
      </div>
    </div>
  );
}