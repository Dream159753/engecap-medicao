'use client';

import { useState } from 'react';

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

  const adicionarNovaSecao = () => {
    if (!nomeNovaSecao.trim()) return alert("Digite o nome da seção!");
    
    setSecoes([...secoes, { 
      nome: nomeNovaSecao.trim(), 
      andares: [{ nome: "Térreo", volume: 0, area: 0 }] 
    }]);
    
    setNomeNovaSecao("");
    setMostrarInputNovaSecao(false);
  };

  const adicionarAndar = (indexSecao: number) => {
    const novasSecoes = [...secoes];
    const proximo = novasSecoes[indexSecao].andares.length + 1;
    
    novasSecoes[indexSecao].andares.push({
      nome: `${proximo}º Pavimento`,
      volume: 0,
      area: 0
    });
    setSecoes(novasSecoes);
  };

  const removerSecao = (index: number) => {
    if (confirm("Excluir esta seção?")) {
      setSecoes(secoes.filter((_, i) => i !== index));
    }
  };

  const removerAndar = (indexSecao: number, indexAndar: number) => {
    if (confirm("Excluir este andar?")) {
      const novas = [...secoes];
      novas[indexSecao].andares.splice(indexAndar, 1);
      setSecoes(novas);
    }
  };

  const salvarObra = () => {
    if (secoes.length === 0) return alert("Adicione pelo menos uma seção!");
    alert(`✅ Obra "${obra.nome}" (Código: ${obra.numero}) salva com sucesso!`);
    console.log("Obra salva:", { obra, secoes });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Cadastro de Obra</h2>
      
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Obra</label>
            <input 
              type="text" 
              value={obra.nome} 
              onChange={(e) => setObra({...obra, nome: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Código da Obra</label>
            <input 
              type="text" 
              value={obra.numero} 
              onChange={(e) => setObra({...obra, numero: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3" 
            />
          </div>
        </div>

        <h4 className="text-xl font-semibold mb-6">Seções da Obra (Torres / Periferia)</h4>

        {secoes.length === 0 && (
          <p className="text-gray-500 text-center py-12">Nenhuma seção cadastrada ainda.<br />Clique em "+ Nova Seção" abaixo.</p>
        )}

        {secoes.map((secao, indexSecao) => (
          <div key={indexSecao} className="mb-10 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">🏗️ {secao.nome}</h5>
              <button onClick={() => removerSecao(indexSecao)} className="text-red-600 hover:text-red-700 text-sm">Excluir Seção</button>
            </div>
            
            {secao.andares.map((andar, indexAndar) => (
              <div key={indexAndar} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border">
                <div>
                  <label className="text-sm">Nome do Andar</label>
                  <input 
                    type="text" 
                    value={andar.nome}
                    onChange={(e) => {
                      const novas = [...secoes];
                      novas[indexSecao].andares[indexAndar].nome = e.target.value;
                      setSecoes(novas);
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm">Volume (m³)</label>
                  <input 
                    type="number" 
                    value={andar.volume}
                    onChange={(e) => {
                      const novas = [...secoes];
                      novas[indexSecao].andares[indexAndar].volume = Number(e.target.value);
                      setSecoes(novas);
                    }}
                    className="w-full border rounded-lg px-3 py-2" 
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-sm">Área (m²)</label>
                    <input 
                      type="number" 
                      value={andar.area}
                      onChange={(e) => {
                        const novas = [...secoes];
                        novas[indexSecao].andares[indexAndar].area = Number(e.target.value);
                        setSecoes(novas);
                      }}
                      className="w-full border rounded-lg px-3 py-2" 
                    />
                  </div>
                  <button onClick={() => removerAndar(indexSecao, indexAndar)} className="text-red-600 hover:text-red-700 text-sm pb-1">Excluir</button>
                </div>
              </div>
            ))}

            <button 
              onClick={() => adicionarAndar(indexSecao)} 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Adicionar Andar
            </button>
          </div>
        ))}

        <div className="mt-6">
          {!mostrarInputNovaSecao ? (
            <button 
              onClick={() => setMostrarInputNovaSecao(true)} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              + Nova Seção (Torre / Periferia)
            </button>
          ) : (
            <div className="flex gap-3">
              <input 
                type="text" 
                value={nomeNovaSecao}
                onChange={(e) => setNomeNovaSecao(e.target.value)}
                placeholder="Ex: Torre B, Periferia..."
                className="border border-gray-300 rounded-lg px-4 py-3 flex-1"
              />
              <button onClick={adicionarNovaSecao} className="bg-green-600 text-white px-6 py-3 rounded-lg">Adicionar</button>
              <button onClick={() => {setMostrarInputNovaSecao(false); setNomeNovaSecao("");}} className="bg-gray-300 px-6 py-3 rounded-lg">Cancelar</button>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            onClick={salvarObra} 
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg"
          >
            Salvar Obra Completa
          </button>
        </div>
      </div>
    </div>
  );
}