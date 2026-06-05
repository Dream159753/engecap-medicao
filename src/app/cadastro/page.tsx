'use client';

import { useState } from 'react';

export default function CadastroObra() {
  const [obra, setObra] = useState({ nome: "Faena", numero: "325" });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Cadastro de Obra</h2>
      
      <div className="bg-white rounded-2xl shadow p-8 max-w-4xl">
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

        <div className="border-t pt-8">
          <p className="text-gray-500 text-center py-20">
            Tela de Cadastro de Obra (em construção)<br />
            Vamos melhorar isso juntos agora.
          </p>
        </div>

        <div className="mt-10 flex justify-end">
          <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg">
            Salvar Obra Completa
          </button>
        </div>
      </div>
    </div>
  );
}