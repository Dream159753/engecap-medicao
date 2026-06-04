'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Andar = { nome: string; volume: number; area: number };
type Secao = { nome: string; andares: Andar[] };
type ServicoLiberado = { id: number; secao: string; andar: string; servico: string; liberado: boolean };

type ObraContextType = {
  secoes: Secao[];
  setSecoes: (secoes: Secao[]) => void;
  servicosLiberados: ServicoLiberado[];
  setServicosLiberados: (servicos: ServicoLiberado[]) => void;
};

const ObraContext = createContext<ObraContextType | undefined>(undefined);

export function ObraProvider({ children }: { children: ReactNode }) {
  const [secoes, setSecoes] = useState<Secao[]>([]);
  const [servicosLiberados, setServicosLiberados] = useState<ServicoLiberado[]>([]);

  return (
    <ObraContext.Provider value={{ secoes, setSecoes, servicosLiberados, setServicosLiberados }}>
      {children}
    </ObraContext.Provider>
  );
}

export const useObra = () => {
  const context = useContext(ObraContext);
  if (!context) throw new Error("useObra deve ser usado dentro de um ObraProvider");
  return context;
};