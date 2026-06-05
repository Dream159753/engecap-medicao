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
    salvarNoStorage([...secoes, { 
      nome: nomeNovaSecao.trim(), 
      andares: [{ nome: "Térreo", volume: 0, usaVolume: true }] 
    }]);
    setNomeNovaSecao("");
    setMostrarInputNovaSecao(false);
  };

  const adicionarAndar = (indexSecao: number) => {
    const novas = [...secoes];
    novas[indexSecao].andares.push({ 
      nome: `${novas[indexSecao].andares.length + 1}º Pavimento`, 
      volume: 0, 
      usaVolume: true 
    });
    salvarNoStorage(novas);
  };

  const atualizarAndar = (indexSecao: number, indexAndar: number, campo: string, valor: any) => {
    const novas = [...secoes];
    const andar = novas[indexSecao].andares[indexAndar];
    
    if (campo === 'nome') andar.nome = valor;
    else if (campo === 'volume') andar.volume = Number(valor) || 0;
    else if (campo === 'usaVolume') andar.usaVolume = valor;

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
            <a href="/cadastro" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">
              📋 Cadastro de Obra
            </a>
            <a href="/liberacao" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">
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

            {secoes.map((secao, i) => (
              <div key={i} className="mb-10 border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <h5 className="text-lg font-semibold">🏗️ {secao.nome}</h5>
                  <button onClick={() => removerSecao(i)} className="text-red-600">Excluir Seção</button>
                </div>

                {secao.andares.map((andar, j) => (
                  <div key={j} className="mb-8 p-5 bg-white rounded-lg border">
                    <div className="flex justify-between mb-4">
                      <h6 className="font-medium">{andar.nome}</h6>
                      <button onClick={() => removerAndar(i, j)} className="text-red-600 text-sm">Excluir Andar</button>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-5">
                        <label className="text-sm block mb-1">Nome do Andar</label>
                        <input type="text" value={andar.nome} onChange={(e) => atualizarAndar(i, j, 'nome', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
                      </div>

                      <div className="col-span-7">
                        <label className="text-sm flex items-center gap-2 mb-1">
                          Volume Total (m³) 
                          <input type="checkbox" checked={andar.usaVolume} onChange={(e) => atualizarAndar(i, j, 'usaVolume', e.target.checked)} className="w-4 h-4" />
                        </label>
                        <input 
                          type="number" 
                          value={andar.volume || ""} 
                          onChange={(e) => atualizarAndar(i, j, 'volume', e.target.value)} 
                          disabled={!andar.usaVolume}
                          className="w-full border rounded-lg px-3 py-2" 
                        />
                      </div>
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
      </div>
    </div>
  );
}