'use client';

import { useState } from 'react';

type Funcionario = {
  chapa: string;
  nome: string;
  funcao: string;
};

const funcionariosDB: Funcionario[] = [
  { chapa: "01", nome: "João da Silva", funcao: "Carpinteiro" },
  { chapa: "02", nome: "Maria Santos", funcao: "Armadora" },
  { chapa: "03", nome: "Pedro Oliveira", funcao: "Pedreiro" },
];

type ItemMedicao = {
  id: number;
  chapa: string;
  nome: string;
  funcao: string;
  servico: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
};

export default function MedicaoScreen() {
  const [medicoes, setMedicoes] = useState<ItemMedicao[]>([]);
  const [chapaInput, setChapaInput] = useState("");
  const [funcionarioAtual, setFuncionarioAtual] = useState<Funcionario | null>(null);

  const [qtIntegracao, setQtIntegracao] = useState(0);
  const [qtVTSabado, setQtVTSabado] = useState(0);

  const buscarFuncionario = () => {
    const encontrado = funcionariosDB.find(f => f.chapa === chapaInput);
    if (encontrado) {
      setFuncionarioAtual(encontrado);
    } else {
      alert("Funcionário não encontrado!");
      setFuncionarioAtual(null);
    }
  };

  const adicionarServico = (servico: string, valorUnitario: number) => {
    if (!funcionarioAtual) return alert("Busque um funcionário primeiro!");

    const novoItem: ItemMedicao = {
      id: Date.now(),
      chapa: funcionarioAtual.chapa,
      nome: funcionarioAtual.nome,
      funcao: funcionarioAtual.funcao,
      servico,
      quantidade: 0,
      valorUnitario,
      total: 0
    };

    setMedicoes([...medicoes, novoItem]);
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

      <div className="bg-white rounded-2xl shadow p-8">
        {/* Busca por Chapa */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Chapa do Funcionário</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={chapaInput}
                onChange={(e) => setChapaInput(e.target.value)}
                placeholder="Digite a chapa (ex: 01)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
              />
              <button onClick={buscarFuncionario} className="bg-blue-600 text-white px-8 py-3 rounded-lg">Buscar</button>
            </div>
          </div>
        </div>

        {funcionarioAtual && (
          <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
            <strong>{funcionarioAtual.nome}</strong> — {funcionarioAtual.funcao}
          </div>
        )}

        {/* Adicionar Serviços */}
        {funcionarioAtual && (
          <div className="mb-10">
            <h3 className="font-semibold mb-4">Adicionar Serviço para {funcionarioAtual.nome}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => adicionarServico("Forma + Armação + Concretagem", 85.50)} className="border p-6 rounded-xl hover:bg-gray-50 text-left">
                <p className="font-medium">Forma + Armação + Concretagem</p>
                <p className="text-sm text-gray-500">R$ 85,50 / m²</p>
              </button>
              <button onClick={() => adicionarServico("Desforma", 32.00)} className="border p-6 rounded-xl hover:bg-gray-50 text-left">
                <p className="font-medium">Desforma</p>
                <p className="text-sm text-gray-500">R$ 32,00 / m²</p>
              </button>
            </div>
          </div>
        )}

        {/* Tabela de Medições */}
        {medicoes.length > 0 && (
          <table className="w-full border-collapse mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Chapa</th>
                <th className="p-4 text-left">Funcionário</th>
                <th className="p-4 text-left">Serviço</th>
                <th className="p-4 text-center">Quantidade</th>
                <th className="p-4 text-right">Valor Unit.</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {medicoes.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-4">{m.chapa}</td>
                  <td className="p-4 font-medium">{m.nome}</td>
                  <td className="p-4">{m.servico}</td>
                  <td className="p-4 text-center">
                    <input 
                      type="number" 
                      value={m.quantidade} 
                      onChange={(e) => atualizarQuantidade(m.id, Number(e.target.value) || 0)}
                      className="w-24 text-center border rounded py-2"
                    />
                  </td>
                  <td className="p-4 text-right">R$ {m.valorUnitario.toFixed(2)}</td>
                  <td className="p-4 text-right font-semibold">R$ {m.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Integração e VT Sábado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold mb-3">Integração</h4>
            <div className="flex items-center gap-4">
              <input type="number" value={qtIntegracao} onChange={(e) => setQtIntegracao(Number(e.target.value) || 0)} className="border rounded px-4 py-2 w-28 text-center" />
              <span>× R$ 9,98</span>
            </div>
            <p className="text-right mt-4 font-semibold">Total: R$ {(qtIntegracao * 9.98).toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold mb-3">VT Sábado</h4>
            <div className="flex items-center gap-4">
              <input type="number" value={qtVTSabado} onChange={(e) => setQtVTSabado(Number(e.target.value) || 0)} className="border rounded px-4 py-2 w-28 text-center" />
              <span>× R$ 19,98</span>
            </div>
            <p className="text-right mt-4 font-semibold">Total: R$ {(qtVTSabado * 19.98).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-10 border-t pt-8 flex justify-between items-center">
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