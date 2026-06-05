'use client';

import { useState, useEffect } from 'react';

type Servico = {
  nome: string;
  volume: number;
  area: number;
  usaVolume: boolean;
  usaArea: boolean;
};

type Andar = {
  nome: string;
  servicos: Servico[];
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
      andares: [{ nome: "Térreo", servicos: [] }] 
    }]);
    setNomeNovaSecao("");
    setMostrarInputNovaSecao(false);
  };

  const adicionarAndar = (indexSecao: number) => {
    const novas = [...secoes];
    novas[indexSecao].andares.push({ 
      nome: `${novas[indexSecao].andares.length + 1}º Pavimento`, 
      servicos: [] 
    });
    salvarNoStorage(novas);
  };

  const adicionarServico = (indexSecao: number, indexAndar: number) => {
    const novas = [...secoes];
    novas[indexSecao].andares[indexAndar].servicos.push({
      nome: "Novo Serviço",
      volume: 0,
      area: 0,
      usaVolume: true,
      usaArea: true
    });
    salvarNoStorage(novas);
  };

  const atualizarServico = (indexSecao: number, indexAndar: number, indexServico: number, campo: string, valor: any) => {
    const novas = [...secoes];
    const serv = novas[indexSecao].andares[indexAndar].servicos[indexServico];
    if (campo === 'nome') serv.nome = valor;
    else if (campo === 'volume') serv.volume = Number(valor) || 0;
    else if (campo === 'area') serv.area = Number(valor) || 0;
    else if (campo === 'usaVolume') serv.usaVolume = valor;
    else if (campo === 'usaArea') serv.usaArea = valor;
    salvarNoStorage(novas);
  };

  const removerServico = (indexSecao: number, indexAndar: number, indexServico: number) => {
    if (confirm("Excluir serviço?")) {
      const novas = [...secoes];
      novas[indexSecao].andares[indexAndar].servicos.splice(indexServico, 1);
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

        {secoes.map((secao, i) => (
          <div key={i} className="mb-10 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between mb-4">
              <h5 className="text-lg font-semibold">🏗️ {secao.nome}</h5>
              <button onClick={() => {}} className="text-red-600">Excluir Seção</button>
            </div>

            {secao.andares.map((andar, j) => (
              <div key={j} className="mb-8 p-5 bg-white rounded-lg border">
                <div className="flex justify-between mb-4">
                  <h6 className="font-medium">{andar.nome}</h6>
                  <button onClick={() => {}} className="text-red-600 text-sm">Excluir Andar</button>
                </div>

                {andar.servicos.map((serv, k) => (
                  <div key={k} className="grid grid-cols-12 gap-3 mb-4 p-4 border rounded-lg items-end">
                    <div className="col-span-4">
                      <label className="text-sm">Nome do Serviço</label>
                      <input 
                        type="text" 
                        value={serv.nome} 
                        onChange={(e) => atualizarServico(i, j, k, 'nome', e.target.value)} 
                        className="w-full border rounded px-3 py-2" 
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm flex items-center gap-2">
                        Volume (m³) 
                        <input type="checkbox" checked={serv.usaVolume} onChange={(e) => atualizarServico(i, j, k, 'usaVolume', e.target.checked)} />
                      </label>
                      <input type="number" value={serv.volume} onChange={(e) => atualizarServico(i, j, k, 'volume', e.target.value)} disabled={!serv.usaVolume} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm flex items-center gap-2">
                        Área (m²) 
                        <input type="checkbox" checked={serv.usaArea} onChange={(e) => atualizarServico(i, j, k, 'usaArea', e.target.checked)} />
                      </label>
                      <input type="number" value={serv.area} onChange={(e) => atualizarServico(i, j, k, 'area', e.target.value)} disabled={!serv.usaArea} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <button onClick={() => removerServico(i, j, k)} className="text-red-600">Remover</button>
                    </div>
                  </div>
                ))}

                <button onClick={() => adicionarServico(i, j)} className="text-blue-600 text-sm">+ Adicionar Serviço</button>
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