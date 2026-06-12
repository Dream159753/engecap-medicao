'use client';

import { useState, useEffect } from 'react';

type ServicoLiberado = {
  secao: string;
  andar: string;
  volumeTotal: number;
  volumeLiberado: number;
  trecho: string;
  liberado: boolean;
  volumeRestante: number;
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
  servicoIndex: number; // para saber qual serviço abater
};

export default function LancamentoMedicao() {
  const [servicosLiberados, setServicosLiberados] = useState<ServicoLiberado[]>([]);
  const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
  const [chapa, setChapa] = useState("");
  const [funcionarioAtual, setFuncionarioAtual] = useState<any>(null);

  const [qtIntegracao, setQtIntegracao] = useState(0);
  const [qtVTSabado, setQtVTSabado] = useState(0);

  const funcionariosDB = [
    { chapa: "01", nome: "João da Silva", funcao: "Carpinteiro" },
    { chapa: "02", nome: "Pedro Paulo", funcao: "Armador" },
    { chapa: "03", nome: "Antonio de Souza", funcao: "Pedreiro" },
    { chapa: "1001", nome: "João da Silva", funcao: "Carpinteiro" },
    { chapa: "1002", nome: "Maria Oliveira", funcao: "Armador" },
  ];

  useEffect(() => {
    const salvo = localStorage.getItem('servicosLiberados');
    if (salvo) {
      let dados = JSON.parse(salvo);
      dados = dados.map((s: any) => ({
        ...s,
        volumeRestante: s.volumeRestante !== undefined ? s.volumeRestante : s.volumeLiberado || 0
      }));
      setServicosLiberados(dados.filter((s: any) => s.liberado === true));
    }
  }, []);

  const buscarFuncionario = () => {
    const encontrado = funcionariosDB.find(f => f.chapa === chapa.trim());
    if (encontrado) setFuncionarioAtual(encontrado);
    else alert("Funcionário não encontrado!");
  };

  const adicionarMedicao = (item: ServicoLiberado, index: number) => {
    if (!funcionarioAtual) {
      alert("Busque um funcionário primeiro!");
      return;
    }
    if (item.volumeRestante <= 0) {
      alert("Não há mais volume disponível!");
      return;
    }

    const qtdInicial = Math.min(10, item.volumeRestante);

    const novo: MedicaoItem = {
      id: Date.now(),
      chapa: funcionarioAtual.chapa,
      nome: funcionarioAtual.nome,
      funcao: funcionarioAtual.funcao,
      servico: `${item.trecho || 'Serviço'} - ${item.andar}`,
      quantidade: qtdInicial,
      valorUnitario: 150,
      total: qtdInicial * 150,
      servicoIndex: index
    };

    setMedicoes([...medicoes, novo]);
  };

  const atualizarQuantidade = (medicaoId: number, novaQtd: number) => {
    setMedicoes(prevMedicoes => {
      const novosMedicoes = prevMedicoes.map(m => {
        if (m.id === medicaoId) {
          const diferenca = novaQtd - m.quantidade;
          const novos = [...servicosLiberados];
          
          if (m.servicoIndex !== undefined && novos[m.servicoIndex]) {
            novos[m.servicoIndex].volumeRestante = Math.max(0, novos[m.servicoIndex].volumeRestante - diferenca);
            setServicosLiberados(novos);

            // Atualiza localStorage
            const todos = JSON.parse(localStorage.getItem('servicosLiberados') || '[]');
            const globalIndex = todos.findIndex((s: any) => 
              s.secao === novos[m.servicoIndex].secao && s.andar === novos[m.servicoIndex].andar
            );
            if (globalIndex !== -1) {
              todos[globalIndex].volumeRestante = novos[m.servicoIndex].volumeRestante;
              localStorage.setItem('servicosLiberados', JSON.stringify(todos));
            }
          }

          return { ...m, quantidade: novaQtd, total: novaQtd * m.valorUnitario };
        }
        return m;
      });
      return novosMedicoes;
    });
  };

  const finalizarMedicao = () => {
    if (medicoes.length === 0) {
      alert("Nenhuma medição lançada!");
      return;
    }

    const salvo = JSON.parse(localStorage.getItem('medicoesAguardandoAssinatura') || '[]');
    localStorage.setItem('medicoesAguardandoAssinatura', JSON.stringify([...salvo, ...medicoes]));

    alert(`✅ ${medicoes.length} medição(ões) salva(s) para assinatura!`);
    
    setMedicoes([]);
    setChapa("");
    setFuncionarioAtual(null);
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
            <a href="/cadastro" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">📋 Cadastro</a>
            <a href="/liberacao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">🔓 Liberação</a>
            <a href="/medicao" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">📝 Lançar Medição</a>
            <a href="/assinaturas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100">✍️ Aguardando Assinatura</a>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Lançamento de Medição</h2>

        {/* Busca Funcionário */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-4">1. Buscar Funcionário</h4>
          <div className="flex gap-4">
            <input type="text" placeholder="Chapa (01, 02, 03...)" value={chapa} onChange={(e) => setChapa(e.target.value)} className="border rounded-lg px-4 py-3 w-64" />
            <button onClick={buscarFuncionario} className="bg-blue-600 text-white px-8 py-3 rounded-lg">Buscar</button>
          </div>
          {funcionarioAtual && <p className="mt-4 text-green-600 font-medium">✅ {funcionarioAtual.nome} - {funcionarioAtual.funcao}</p>}
        </div>

        {/* Trechos Liberados */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-6">2. Trechos Liberados</h4>
          {servicosLiberados.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">Nenhum trecho liberado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicosLiberados.map((item, idx) => (
                <div key={idx} className="border rounded-xl p-6 hover:shadow">
                  <p className="font-medium">{item.secao} — {item.andar}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.trecho || 'Sem descrição'}</p>
                  <p className="text-blue-600 mt-2">Liberado: <strong>{item.volumeLiberado} m³</strong></p>
                  <p className="text-orange-600">Restante: <strong>{item.volumeRestante} m³</strong></p>
                  
                  <button 
                    onClick={() => adicionarMedicao(item, idx)}
                    disabled={item.volumeRestante <= 0}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium"
                  >
                    Lançar Medição
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Integração e VT */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h4 className="font-semibold mb-6">3. Integração e VT Sábado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2">Integração (R$ 9,98)</label>
              <input type="number" value={qtIntegracao} onChange={(e) => setQtIntegracao(Number(e.target.value)||0)} className="w-full border rounded-lg px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm mb-2">VT Sábado (R$ 19,98)</label>
              <input type="number" value={qtVTSabado} onChange={(e) => setQtVTSabado(Number(e.target.value)||0)} className="w-full border rounded-lg px-4 py-3" />
            </div>
          </div>
        </div>

        {/* Medições Lançadas */}
        {medicoes.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h4 className="font-semibold mb-6">Medições Lançadas</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Funcionário</th>
                  <th className="p-4 text-left">Trecho</th>
                  <th className="p-4 text-center">Quantidade (m³)</th>
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
                        onChange={(e) => atualizarQuantidade(item.id, Number(e.target.value)||0)} 
                        className="w-24 border rounded text-center py-1"
                      />
                    </td>
                    <td className="p-4 text-center">R$ {item.valorUnitario}</td>
                    <td className="p-4 text-center font-semibold">R$ {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 text-right text-xl font-bold bg-gray-50 p-6 rounded-xl">
              Total Serviços: R$ {totalServicos}<br/>
              Integração: R$ {totalIntegracao.toFixed(2)}<br/>
              VT Sábado: R$ {totalVTSabado.toFixed(2)}<br/>
              <span className="text-3xl text-green-600">TOTAL GERAL: R$ {totalGeral.toFixed(2)}</span>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={finalizarMedicao} className="bg-green-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:bg-green-700">
                Finalizar Medição e Enviar para Assinatura
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}