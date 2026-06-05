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
  trecho: string;
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

      const liberados: ServicoLiberado[] = [];
      dados.forEach(secao => {
        secao.andares.forEach(andar => {
          if (andar.usaVolume) {
            liberados.push({
              secao: secao.nome,
              andar: andar.nome,
              volumeTotal: andar.volume,
              volumeLiberado: 0,
              trecho: "",
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

  const atualizarTrecho = (index: number, valor: string) => {
    const novos = [...servicosLiberados];
    novos[index].trecho = valor;
    setServicosLiberados(novos);
  };

  const toggleLiberacao = (index: number) => {
    const novos = [...servicosLiberados];
    novos[index].liberado = !novos[index].liberado;
    setServicosLiberados(novos);
    localStorage.setItem('servicosLiberados', JSON.stringify(novos));
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
            <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">
              📊 Dashboard
            </a>
            <a href="/cadastro" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">
              📋 Cadastro de Obra
            </a>
            <a href="/liberacao" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">
              🔓 Liberação de Tarefas
            </a>
            <a href="/medicao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">
              📝 Lançar Medição
            </a>
          </nav>
        </div>

        <div className="p-4 border-t">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg">Sair</button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8">Liberação de Tarefas</h2>
          <div className="bg-white rounded-2xl shadow p-8">
            <h4 className="text-xl font-semibold mb-6">Serviços Cadastrados - Volume (m³)</h4>

            {servicosLiberados.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">Nenhuma seção cadastrada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left">Seção</th>
                      <th className="p-4 text-left">Andar / Pavimento</th>
                      <th className="p-4 text-center">Volume Total (m³)</th>
                      <th className="p-4 text-center">Volume a Liberar (m³)</th>
                      <th className="p-4 text-left">Trecho a Liberar</th>
                      <th className="p-4 text-center">Ação</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosLiberados.map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
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
                        <td className="p-4">
                          <input 
                            type="text" 
                            value={item.trecho} 
                            onChange={(e) => atualizarTrecho(index, e.target.value)}
                            placeholder="Ex: Pilares e Vigas eixo A-B"
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleLiberacao(index)}
                            className={`px-6 py-2 rounded-lg font-medium ${item.liberado ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
                          >
                            {item.liberado ? 'Liberado ✓' : 'Liberar'}
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
                onClick={() => alert('✅ Liberações salvas com sucesso!')}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg"
              >
                Finalizar Liberações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}