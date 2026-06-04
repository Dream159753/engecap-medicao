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

  const funcionarios = [
    { chapa: "01", nome: "João da Silva", funcao: "Carpinteiro" },
    { chapa: "02", nome: "Maria Santos", funcao: "Armadora" },
    { chapa: "03", nome: "Pedro Oliveira", funcao: "Pedreiro" },
  ];

  // Carrega os serviços liberados
  useEffect(() => {
    const salvo = localStorage.getItem('servicosLiberados');
    if (salvo) {
      setServicosLiberados(JSON.parse(salvo));
    }
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

  const atualizarQuantidade = (id: number, qt: number) => {
    setMedicoes(medicoes.map(m => m.id === id ? { ...m, quantidade: qt, total: qt * m.valorUnitario } : m));
  };

  const totalGeral = medicoes.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Lançamento de Medição</h2>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Chapa do Funcionário</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={chapaInput} 
                onChange={(e) => setChapaInput(e.target.value)} 
                placeholder="Ex: 01" 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3" 
              />
              <button onClick={buscarFuncionario} className="bg-blue-600 text-white px-8 py-3 rounded-lg">Buscar</button>
            </div>
          </div>
        </div>

        {funcionarioAtual && (
          <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
            ✅ <strong>{funcionarioAtual.nome}</strong> — {funcionarioAtual.funcao}
          </div>
        )}

        <h3 className="font-semibold mb-4">Serviços Liberados</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicosLiberados.filter(s => s.liberado).length === 0 ? (
            <p className="col-span-2 text-center text-gray-500 py-12">Nenhum serviço liberado ainda. Vá na tela de Liberação.</p>
          ) : (
            servicosLiberados.filter(s => s.liberado).map(s => (
              <button 
                key={s.id}
                onClick={() => adicionarMedicao(s)}
                className="border p-6 rounded-xl hover:bg-gray-50 text-left transition"
              >
                <p className="font-medium">{s.servico}</p>
                <p className="text-sm text-gray-500">{s.secao} • {s.andar}</p>
              </button>
            ))
          )}
        </div>

        {medicoes.length > 0 && (
          <table className="w-full mt-12 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Funcionário</th>
                <th className="p-4 text-left">Serviço</th>
                <th className="p-4 text-center">Qtd</th>
                <th className="p-4 text-right">Valor Unit.</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {medicoes.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-4 font-medium">{m.nome}</td>
                  <td className="p-4">{m.servico}</td>
                  <td className="p-4 text-center">
                    <input type="number" value={m.quantidade} onChange={(e) => atualizarQuantidade(m.id, Number(e.target.value) || 0)} className="w-24 text-center border rounded py-2" />
                  </td>
                  <td className="p-4 text-right">R$ {m.valorUnitario.toFixed(2)}</td>
                  <td className="p-4 text-right font-semibold">R$ {m.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-10 border-t pt-6 flex justify-between items-center">
          <div>
            <p className="text-2xl font-semibold">Total Geral</p>
            <p className="text-5xl font-bold text-green-600">R$ {totalGeral.toFixed(2)}</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg">
            Finalizar Medição
          </button>
        </div>
      </div>
    </div>
  );
}