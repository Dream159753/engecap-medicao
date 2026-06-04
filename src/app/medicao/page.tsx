'use client';

import { useState, useEffect } from 'react';

type ServicoLiberado = {
  id: number;
  secao: string;
  andar: string;
  servico: string;
  liberado: boolean;
};

type MedicaoItem = {
  id: number;
  chapa: string;
  nome: string;
  funcao: string;
  secao: string;
  andar: string;
  servico: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
};

export default function MedicaoScreen() {
  const [servicosLiberados, setServicosLiberados] = useState<ServicoLiberado[]>([]);
  const [medicoes, setMedicoes] = useState<MedicaoItem[]>([]);
  const [chapaInput, setChapaInput] = useState("");
  const [funcionarioAtual, setFuncionarioAtual] = useState<any>(null);

  const [qtIntegracao, setQtIntegracao] = useState(0);
  const [qtVTSabado, setQtVTSabado] = useState(0);

  const funcionarios = [
    { chapa: "01", nome: "João da Silva", funcao: "Carpinteiro" },
    { chapa: "02", nome: "Maria Santos", funcao: "Armadora" },
  ];

  useEffect(() => {
    const salvo = localStorage.getItem('servicosLiberados');
    if (salvo) setServicosLiberados(JSON.parse(salvo));
  }, []);

  const buscarFuncionario = () => {
    const encontrado = funcionarios.find(f => f.chapa === chapaInput);
    if (encontrado) setFuncionarioAtual(encontrado);
    else alert("Funcionário não encontrado!");
  };

  const adicionarMedicao = (servico: ServicoLiberado) => {
    if (!funcionarioAtual) return alert("Busque um funcionário primeiro!");

    const novo: MedicaoItem = {
      id: Date.now(),
      chapa: funcionarioAtual.chapa,
      nome: funcionarioAtual.nome,
      funcao: funcionarioAtual.funcao,
      secao: servico.secao,
      andar: servico.andar,
      servico: servico.servico,
      quantidade: 0,
      valorUnitario: servico.servico.includes("Forma") ? 85.50 : 32.00,
      total: 0
    };

    setMedicoes([...medicoes, novo]);
  };

  const atualizarQuantidade = (id: number, quantidade: number) => {
    setMedicoes(medicoes.map(m => 
      m.id === id ? { ...m, quantidade, total: quantidade * m.valorUnitario } : m
    ));
  };

  const totalServicos = medicoes.reduce((sum, m) => sum + m.total, 0);
  const totalIntegracao = qtIntegracao * 9.98;
  const totalVTSabado = qtVTSabado * 19.98;
  const totalGeral = totalServicos + totalIntegracao + totalVTSabado;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Lançamento de Medição</h2>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Busca por Chapa */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Chapa do Funcionário</label>
            <div className="flex gap-3">
              <input type="text" value={chapaInput} onChange={(e) => setChapaInput(e.target.value)} placeholder="Ex: 01" className="flex-1 border border-gray-300 rounded-xl px-5 py-4 text-lg" />
              <button onClick={buscarFuncionario} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold">Buscar</button>
            </div>
          </div>
        </div>

        {funcionarioAtual && (
          <div className="bg-green-50 border border-green-200 p-5 rounded-2xl mb-8">
            ✅ <strong className="text-xl">{funcionarioAtual.nome}</strong> — {funcionarioAtual.funcao}
          </div>
        )}

        {/* Serviços Liberados */}
        <h3 className="font-semibold text-lg mb-4">Serviços Liberados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {servicosLiberados.filter(s => s.liberado).length === 0 ? (
            <p className="col-span-2 text-center py-12 text-gray-500">Nenhum serviço liberado ainda.</p>
          ) : (
            servicosLiberados.filter(s => s.liberado).map(s => (
              <button key={s.id} onClick={() => adicionarMedicao(s)} className="border-2 border-gray-200 hover:border-blue-500 p-6 rounded-2xl text-left transition-all hover:shadow-md">
                <p className="font-medium text-lg">{s.servico}</p>
                <p className="text-gray-500">{s.secao} • {s.andar}</p>
              </button>
            ))
          )}
        </div>

        {/* ==================== INTEGRAÇÃO E VT SÁBADO ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t pt-8">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-semibold mb-3 text-lg">Integração</h4>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={qtIntegracao} 
                onChange={(e) => setQtIntegracao(Number(e.target.value) || 0)} 
                className="border rounded-xl px-5 py-3 w-32 text-center text-lg" 
              />
              <span className="text-gray-500">× R$ 9,98</span>
            </div>
            <p className="text-right mt-4 font-bold text-lg">Total: R$ {(qtIntegracao * 9.98).toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="font-semibold mb-3 text-lg">VT Sábado</h4>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={qtVTSabado} 
                onChange={(e) => setQtVTSabado(Number(e.target.value) || 0)} 
                className="border rounded-xl px-5 py-3 w-32 text-center text-lg" 
              />
              <span className="text-gray-500">× R$ 19,98</span>
            </div>
            <p className="text-right mt-4 font-bold text-lg">Total: R$ {(qtVTSabado * 19.98).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex justify-between items-end">
          <div>
            <p className="text-2xl font-semibold">Total Geral</p>
            <p className="text-6xl font-bold text-green-600">R$ {totalGeral.toFixed(2)}</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-16 py-5 rounded-3xl font-semibold text-xl">
            Finalizar Medição
          </button>
        </div>
      </div>
    </div>
  );
}