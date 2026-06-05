'use client';

import { useState, useEffect } from 'react';

type Andar = {
  nome: string;
  volume: number;
  area: number;
};

type Secao = {
  nome: string;
  andares: Andar[];
};

export default function CadastroObra() {
  const [obra, setObra] = useState({ nome: "Faena", numero: "325" });
  const [secoes, setSecoes] = useState<Secao[]>([]);

  const [mostrarInputNovaSecao, setMostrarInputNovaSecao] = useState(false);
  const [nomeNovaSecao, setNomeNovaSecao] = useState("");

  useEffect(() => {
    const salvo = localStorage.getItem('secoesObra');
    if (salvo) setSecoes(JSON.parse(salvo));
  }, []);

  const salvarNoStorage = (novas: Secao[]) => {
    setSecoes(novas);
    localStorage.setItem('secoesObra', JSON.stringify(novas));
  };

  const adicionarNovaSecao = () => {
    if (!nomeNovaSecao.trim()) return alert("Digite o nome da seção!");
    salvarNoStorage([...secoes, { nome: nomeNovaSecao.trim(), andares: [{ nome: "Térreo", volume: 0, area: 0 }] }]);
    setNomeNovaSecao("");
    setMostrarInputNovaSecao(false);
  };

  const adicionarAndar = (indexSecao: number) => {
    const novas = [...secoes];
    novas[indexSecao].andares.push({ nome: `${novas[indexSecao].andares.length + 1}º Pavimento`, volume: 0, area: 0 });
    salvarNoStorage(novas);
  };

  const atualizarAndar = (indexSecao: number, indexAndar: number, campo: string, valor: string) => {
    const novas = [...secoes];
    if (campo === 'nome') novas[indexSecao].andares[indexAndar].nome = valor;
    else if (campo === 'volume') novas[indexSecao].andares[indexAndar].volume = Number(valor) || 0;
    else if (campo === 'area') novas[indexSecao].andares[indexAndar].area = Number(valor) || 0;
    salvarNoStorage(novas);
  };

  const removerSecao = (index: number) => {
    if (confirm("Excluir seção?")) salvarNoStorage(secoes.filter((_, i) => i !== index));
  };

  const removerAndar = (indexSecao: number, indexAndar: number) => {
    if (confirm("Excluir andar?")) {
      const novas = [...secoes];
      novas[indexSecao].andares.splice(indexAndar, 1);
      salvarNoStorage(novas);
    }
  };

  const salvarObra = () => {
    if (secoes.length === 0) return alert("Adicione pelo menos uma seção!");
    alert("✅ Obra salva com sucesso!");
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Cadastro de Obra</h2>
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Obra</label>
            <input type="text" value={obra.nome} onChange={(e) => setObra({...obra, nome: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Código da Obra</label>
            <input type="text" value={obra.numero} onChange={(e) => setObra({...obra, numero: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3" />
          </div>
        </div>

        <h4 className="text-xl font-semibold mb-6">Seções da Obra</h4>

        {secoes.length === 0 && <p className="text-gray-500 py-12 text-center">Nenhuma seção cadastrada.</p>}

        {secoes.map((secao, i) => (
          <div key={i} className="mb-10 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between mb-4">
              <h5 className="text-lg font-semibold">🏗️ {secao.nome}</h5>
              <button onClick={() => removerSecao(i)} className="text-red-600">Excluir</button>
            </div>

            {secao.andares.map((andar, j) => (
              <div key={j} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border">
                <div>
                  <label className="text-sm block mb-1">Nome do Andar</label>
                  <input type="text" value={andar.nome} onChange={(e) => atualizarAndar(i, j, 'nome', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm block mb-1">Volume Total (m³)</label>
                  <input type="number" value={andar.volume || ""} onChange={(e) => atualizarAndar(i, j, 'volume', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm block mb-1">Área Total (m²)</label>
                  <input type="number" value={andar.area || ""} onChange={(e) => atualizarAndar(i, j, 'area', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            ))}

            <button onClick={() => adicionarAndar(i)} className="text-blue-600">+ Adicionar Andar</button>
          </div>
        ))}

        <div className="mt-6">
          {!mostrarInputNovaSecao ? (
            <button onClick={() => setMostrarInputNovaSecao(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg">+ Nova Seção</button>
          ) : (
            <div className="flex gap-3">
              <input value={nomeNovaSecao} onChange={(e) => setNomeNovaSecao(e.target.value)} placeholder="Ex: Torre B" className="border rounded-lg px-4 py-3 flex-1" />
              <button onClick={adicionarNovaSecao} className="bg-green-600 text-white px-6 py-3 rounded-lg">Adicionar</button>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={salvarObra} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg">Salvar Obra Completa</button>
        </div>
      </div>
    </div>
  );
}