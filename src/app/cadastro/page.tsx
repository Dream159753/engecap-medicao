'use client';

import { useState, useEffect } from 'react';

type Andar = { nome: string; volume: number; area: number };
type Secao = { nome: string; andares: Andar[] };

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

  // ... (o resto do código de adicionar/remover etc. permanece igual)

  const atualizarAndar = (indexSecao: number, indexAndar: number, campo: 'nome' | 'volume' | 'area', valor: string) => {
    const novas = [...secoes];
    if (campo === 'nome') novas[indexSecao].andares[indexAndar].nome = valor;
    else if (campo === 'volume') novas[indexSecao].andares[indexAndar].volume = Number(valor) || 0;
    else novas[indexSecao].andares[indexAndar].area = Number(valor) || 0;
    salvarNoStorage(novas);
  };

  // ... resto do código (adicionarNovaSecao, adicionarAndar, etc.)

  return (
    <div className="p-8">
      {/* ... o resto da tela igual ao anterior, mas com o atualizarAndar funcionando */}
    </div>
  );
}