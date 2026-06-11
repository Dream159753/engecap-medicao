'use client';

import { useState, useEffect } from 'react';

type ServicoLiberado = {
  secao: string;
  andar: string;
  volumeTotal: number;
  volumeLiberado: number;
  trecho: string;
  liberado: boolean;
};

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

export default function LancamentoMedicao() {
  const [servicosLiberados, setServicosLiberados] = useState<ServicoLiberado[]>([]);
  const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
  const [chapa, setChapa] = useState("");
  const [funcionarioAtual, setFuncionarioAtual] = useState<any>(null);

  const [qtIntegracao, setQtIntegracao] = useState(0);
  const [qtVTSabado, setQtVTSabado] = useState(0);

  const funcionariosDB = [
    { chapa: "1001", nome: "João da Silva", funcao: "Carpinteiro" },
    { chapa: "1002", nome: "Maria Oliveira", funcao: "Armador" },
    { chapa: "1003", nome: "Pedro Santos", funcao: "Pedreiro" },
  ];

  useEffect(() => {
    const salvo = localStorage.getItem('servicosLiberados');
    if (salvo) {
      const dados: ServicoLiberado[] = JSON.parse(salvo);
      const apenasLiberados = dados.filter(s => s.liberado === true);
      setServicosLiberados(apenasLiberados);
    }
  }, []);

  const buscarFuncionario = () => {
    const encontrado = funcionariosDB.find(f => f.chapa === chapa.trim());
    if (encontrado) {
      setFuncionarioAtual(encontrado);
    } else {
      alert("Funcionário não encontrado com esta chapa!");
      setFuncionarioAtual(null);
    }
  };

  const adicionarMedicao = (liberado: ServicoLiberado) => {
    if (!funcionarioAtual) {
      alert("Busque um funcionário pela chapa primeiro!");
      return;
    }

    const novo: MedicaoItem = {
      id: Date.now(),
      chapa: funcionarioAtual.chapa,
      nome: funcionarioAtual.nome,
      funcao: funcionarioAtual.funcao,
      servico: `${liberado.trecho || 'Serviço'} - ${liberado.andar}`,
      quantidade: liberado.volumeLiberado, // já sugere o valor liberado
      valorUnitario: 150, // ajuste depois
      total: liberado.volumeLiberado * 150
    };

    setMedicoes([...medicoes, novo]);
  };

  const atualizarQuantidade = (id: number, qtd: number) => {
    const novos = medicoes.map(m => 
      m.id === id ? { ...m, quantidade: qtd, total: qtd * m.valorUnitario } : m
    );
    setMedicoes(novos);
  };

  const totalServicos = medicoes.reduce((sum, m) => sum + m.total, 0);
  const totalIntegracao = qtIntegracao * 9.98;
  const totalVTSabado = qtVTSabado * 19.98;
  const totalGeral = totalServicos + totalIntegracao + totalVTSabado;

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
            <a href="/cadastro" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">📋 Cadastro de Obra</a>
            <a href="/liberacao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">🔓 Liberação de Tarefas</a>
            <a href="/medicao" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">📝 Lançar Medição</a>
          </nav>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Lançamento de Medição</h2>

        {/* Busca de Funcionário */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-4">1. Buscar Funcionário pela Chapa</h4>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Digite a chapa" 
              value={chapa} 
              onChange={(e) => setChapa(e.target.value)}
              className="border rounded-lg px-4 py-3 w-64"
            />
            <button onClick={buscarFuncionario} className="bg-blue-600 text-white px-8 py-3 rounded-lg">Buscar</button>
          </div>
          {funcionarioAtual && <p className="mt-4 text-green-600 font-medium">✅ {funcionarioAtual.nome} - {funcionarioAtual.funcao}</p>}
        </div>

        {/* Serviços Liberados */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-6">2. Serviços Liberados</h4>
          
          {servicosLiberados.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">Nenhum trecho liberado ainda. Vá na Liberação de Tarefas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicosLiberados.map((item, idx) => (
                <div key={idx} className="border rounded-xl p-6 hover:shadow">
                  <p className="font-medium">{item.secao} — {item.andar}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.trecho || 'Sem descrição'}</p>
                  <p className="text-blue-600 mt-3">{item.volumeLiberado} m³ liberados</p>
                  <button 
                    onClick={() => adicionarMedicao(item)}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                  >
                    Lançar neste funcionário
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integração e VT Sábado */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-6">3. Integração e VT Sábado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2">Integração (R$ 9,98)</label>
              <input 
                type="number" 
                value={qtIntegracao} 
                onChange={(e) => setQtIntegracao(Number(e.target.value) || 0)}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">VT Sábado (R$ 19,98)</label>
              <input 
                type="number" 
                value={qtVTSabado} 
                onChange={(e) => setQtVTSabado(Number(e.target.value) || 0)}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Medições Lançadas */}
        {medicoes.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h4 className="font-semibold mb-6">Medições Lançadas</h4>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Funcionário</th>
                  <th className="p-4 text-left">Trecho / Serviço</th>
                  <th className="p-4 text-center">Quantidade</th>
                  <th className="p-4 text-center">Valor Unit.</th>
                  <th className="p-4 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {medicoes.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{item.nome}</td>
                    <td className="p-4">{item.servico}</td>
                    <td className="p-4 text-center">
                      <input 
                        type="number" 
                        value={item.quantidade} 
                        onChange={(e) => atualizarQuantidade(item.id, Number(e.target.value))}
                        className="w-24 border rounded text-center"
                      />
                    </td>
                    <td className="p-4 text-center">R$ {item.valorUnitario}</td>
                    <td className="p-4 text-center font-semibold">R$ {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 text-right text-2xl font-bold">
              Total Serviços: R$ {totalServicos}<br/>
              Integração: R$ {totalIntegracao.toFixed(2)}<br/>
              VT Sábado: R$ {totalVTSabado.toFixed(2)}<br/>
              <span className="text-green-600">TOTAL GERAL: R$ {totalGeral.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}