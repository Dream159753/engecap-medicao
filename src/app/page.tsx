'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SistemaEngecap() {
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  // Persiste o login mesmo se voltar a página
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  const fazerLogin = (role: 'engenheiro' | 'adm') => {
    const usuario = {
      nome: role === 'engenheiro' ? "Jhony" : "Fulano ADM",
      role
    };
    setUsuarioLogado(usuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  };

  const logout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('usuarioLogado');
  };

  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">Engecap Medição</h1>
          <p className="text-gray-600 mb-10">Sistema de Medição de Serviços</p>
          
          <button onClick={() => fazerLogin('engenheiro')} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-xl mb-4">
            👷 Engenheiro
          </button>
          <button onClick={() => fazerLogin('adm')} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-xl">
            📋 Administrador
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 bg-blue-950 text-white flex flex-col">
        <div className="p-6 border-b border-blue-900">
          <h1 className="text-2xl font-bold">Engecap Medição</h1>
          <p className="text-blue-300 text-sm">Faena - 325</p>
        </div>

        <div className="p-4 border-b border-blue-900">
          <p className="text-sm text-blue-300">Logado como:</p>
          <p className="font-medium">{usuarioLogado.nome}</p>
          <p className="text-xs capitalize text-blue-400">({usuarioLogado.role})</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" className="block py-3 px-4 rounded hover:bg-blue-900">🏠 Dashboard</Link>
          {usuarioLogado.role === 'engenheiro' && (
            <>
              <Link href="/cadastro" className="block py-3 px-4 rounded hover:bg-blue-900">🏗️ Cadastro de Obra</Link>
              <Link href="/liberacao" className="block py-3 px-4 rounded hover:bg-blue-900">✅ Liberação de Tarefas</Link>
            </>
          )}
          {usuarioLogado.role === 'adm' && (
            <Link href="/medicao" className="block py-3 px-4 rounded hover:bg-blue-900">📊 Lançar Medição</Link>
          )}
          <button onClick={logout} className="block w-full text-left py-3 px-4 rounded hover:bg-red-900 text-red-300 mt-8">Sair</button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Bem-vindo, {usuarioLogado.nome}!</h1>
        <p className="text-gray-600">Use o menu lateral.</p>
      </div>
    </div>
  );
}