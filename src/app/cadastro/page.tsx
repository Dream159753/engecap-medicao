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
    novas[indexSecao].andares.push({ nome: `${novas[indexSecao].andares.length + 1}º Pavimento`, servicos: [] });
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
    if (campo === 'volume') serv.volume = Number(valor) || 0;
    if (campo === 'area') serv.area = Number(valor) || 0;
    if (campo === 'usaVolume') serv.usaVolume = valor;
    if (campo === 'usaArea') serv.usaArea = valor;
    salvarNoStorage(novas);
  };

  const removerServico = (indexSecao: number, indexAndar: number, indexServico: number) => {
    if (confirm("Excluir serviço?")) {
      const novas = [...secoes];
      novas[indexSecao].andares[indexAndar].servicos.splice(indexServico, 1);
      salvarNoStorage(novas);
    }
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

        <h4 className="text-xl font-semibold mb-6">Seções / Torres</h4>

        {secoes.map((secao, i) => (
          <div key={i} className="mb-10 border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h5 className="text-lg font-semibold mb-4">🏗️ {secao.nome}</h5>

            {secao.andares.map((andar, j) => (
              <div key={j} className="mb-8 p-5 bg-white rounded-lg border">
                <h6 className="font-medium mb-4">{andar.nome}</h6>

                {andar.servicos.map((serv, k) => (
                  <div key={k} className="grid grid-cols-12 gap-4 mb-6 p-4 border rounded-lg">
                    <div className="col-span-5">
                      <label className="text-sm block mb-1">Nome do Serviço / Tarefa</label>
                      <input 
                        type="text" 
                        value={serv.nome} 
                        onChange={(e) => atualizarServico(i, j, k, 'nome', e.target.value)} 
                        className="w-full border rounded-lg px-4 py-3"
                        placeholder="Ex: Concretagem, Desforma, Alvenaria..."
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm flex items-center gap-2 mb-1">Volume (m³) <input type="checkbox" checked={serv.usaVolume} onChange={(e) => atualizarServico(i, j, k, 'usaVolume', e.target.checked)} /></label>
                      <input type="number" value={serv.volume} onChange={(e) => atualizarServico(i, j, k, 'volume', e.target.value)} disabled={!serv.usaVolume} className="w-full border rounded-lg px-4 py-3" />
                    </div>
                    <div className="col-span-3">
                      <label className="text-sm flex items-center gap-2 mb-1">Área (m²) <input type="checkbox" checked={serv.usaArea} onChange={(e) => atualizarServico(i, j, k, 'usaArea', e.target.checked)} /></label>
                      <input type="number" value={serv.area} onChange={(e) => atualizarServico(i, j, k, 'area', e.target.value)} disabled={!serv.usaArea} className="w-full border rounded-lg px-4 py-3" />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <button onClick={() => removerServico(i, j, k)} className="text-red-600 text-3xl">×</button>
                    </div>
                  </div>
                ))}

                <button onClick={() => adicionarServico(i, j)} className="text-blue-600">+ Adicionar Serviço</button>
              </div>
            ))}

            <button onClick={() => adicionarAndar(i)} className="text-blue-600">+ Adicionar Andar</button>
          </div>
        ))}

        <div className="mt-8">
          <button onClick={() => setMostrarInputNovaSecao(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg">+ Nova Seção</button>
        </div>

        <div className="mt-10 flex justify-end">
          <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg">Salvar Obra Completa</button>
        </div>
      </div>
    </div>
  );
}