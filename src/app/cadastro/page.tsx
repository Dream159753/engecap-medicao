'use client';

import { useState, useEffect } from 'react';

type Andar = { nome: string; volume: number; area: number };
type Secao = { nome: string; andares: Andar[] };

export default function CadastroObra() {
  const [obra, setObra] = useState({ nome: "Faena", numero: "325" });
  const [secoes, setSecoes] = useState<Secao[]>([]);

  const [mostrarInputNovaSecao, setMostrarInputNovaSecao] = useState(false);
  const [nomeNovaSecao, setNomeNovaSecao] = useState("");

  // Carregar do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem('secoesObra');
    if (salvo) setSecoes(JSON.parse(salvo));
  }, []);

  const salvarNoStorage = (novasSecoes: Secao[]) => {
    setSecoes(novasSecoes);
    localStorage.setItem('secoesObra', JSON.stringify(novasSecoes));
  };

  const adicionarNovaSecao = () => {
    if (!nomeNovaSecao.trim()) return alert("Digite o nome da seção!");
    salvarNoStorage([...secoes, { nome: nomeNovaSecao.trim(), andares: [{ nome: "Térreo", volume: 0, area: 0 }] }]);
    setNomeNovaSecao("");
    setMostrarInputNovaSecao(false);
  };

  const adicionarAndar = (indexSecao: number) => {
    const novas = [...secoes];
    novas[indexSecao].andares.push({
      nome: `${novas[indexSecao].andares.length + 1}º Pavimento`,
      volume: 0,
      area: 0
    });
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
        {/* Campos da obra */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Obra</label>
            <input type="text" value={obra.nome} onChange={(e) => setObra({...obra, nome: e.target.value})} className="w-full border rounded-lg px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Código da Obra</label>
            <input type="text" value={obra.numero} onChange={(e) => setObra({...obra, numero: e.target.value})} className="w-full border rounded-lg px-4 py-3" />
          </div>
        </div>

        <h4 className="text-xl font-semibold mb-6">Seções da Obra</h4>

        {secoes.map((secao, i) => (
          <div key={i} className="mb-8 border rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between mb-4">
              <h5 className="font-semibold text-lg">{secao.nome}</h5>
              <button onClick={() => removerSecao(i)} className="text-red-600">Excluir</button>
            </div>
            {secao.andares.map((andar, j) => (
              <div key={j} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded border">
                <input value={andar.nome} onChange={(e) => {
                  const novas = [...secoes];
                  novas[i].andares[j].nome = e.target.value;
                  salvarNoStorage(novas);
                }} className="border rounded px-3 py-2" />
                <input type="number" placeholder="Volume m³" className="border rounded px-3 py-2" />
                <div className="flex gap-2">
                  <input type="number" placeholder="Área m²" className="border rounded px-3 py-2 flex-1" />
                  <button onClick={() => removerAndar(i, j)} className="text-red-600">Excluir</button>
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
              <input value={nomeNovaSecao} onChange={(e) => setNomeNovaSecao(e.target.value)} placeholder="Nome da seção" className="border rounded-lg px-4 py-3 flex-1" />
              <button onClick={adicionarNovaSecao} className="bg-green-600 text-white px-6 py-3 rounded-lg">Adicionar</button>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={salvarObra} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold">Salvar Obra Completa</button>
        </div>
      </div>
    </div>
  );
}