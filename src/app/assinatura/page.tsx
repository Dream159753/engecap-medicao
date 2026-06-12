'use client';

import { useState, useRef, useEffect } from 'react';

export default function AssinaturaMedicao() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [assinaturaFeita, setAssinaturaFeita] = useState(false);
  const [medicoesDoFuncionario, setMedicoesDoFuncionario] = useState<any[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chapa = urlParams.get('chapa');

    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo && chapa) {
      const todas = JSON.parse(salvo);
      const doFuncionario = todas.filter((m: any) => m.chapa === chapa);
      setMedicoesDoFuncionario(doFuncionario);
    }
  }, []);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setAssinaturaFeita(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX || e.touches[0].offsetX, e.nativeEvent.offsetY || e.touches[0].offsetY);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = e.nativeEvent.offsetX || e.touches[0].offsetX;
    const y = e.nativeEvent.offsetY || e.touches[0].offsetY;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const limparCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinaturaFeita(false);
  };

  const salvarAssinatura = () => {
    if (!assinaturaFeita) {
      alert("Por favor, faça a assinatura antes de salvar.");
      return;
    }

    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo && medicoesDoFuncionario.length > 0) {
      let todas = JSON.parse(salvo);
      // Remove todas as medições deste funcionário
      todas = todas.filter((m: any) => m.chapa !== medicoesDoFuncionario[0].chapa);
      localStorage.setItem('medicoesAguardandoAssinatura', JSON.stringify(todas));
    }

    alert("✅ Assinatura salva com sucesso!\nTodas as medições deste funcionário foram finalizadas.");
    window.location.href = "/assinaturas";
  };

  const totalGeral = medicoesDoFuncionario.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">Assinatura da Medição</h2>

        {medicoesDoFuncionario.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
            <h3 className="font-semibold mb-6 text-center text-2xl border-b pb-4">Resumo da Medição</h3>
            <div className="grid grid-cols-2 gap-y-4 text-lg">
              <div><strong>Funcionário:</strong> {medicoesDoFuncionario[0].nome}</div>
              <div><strong>Chapa:</strong> {medicoesDoFuncionario[0].chapa}</div>
              <div className="col-span-2">
                <strong>Trechos:</strong><br/>
                {medicoesDoFuncionario.map((m, i) => (
                  <div key={i} className="ml-4">• {m.servico} — {m.quantidade} m³</div>
                ))}
              </div>
              <div><strong>Quantidade Total:</strong> <span className="text-blue-600 font-bold">{medicoesDoFuncionario.reduce((sum, m) => sum + m.quantidade, 0)} m³</span></div>
              <div><strong>Total Geral:</strong> <span className="text-green-600 font-bold">R$ {totalGeral}</span></div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="text-center mb-6 text-xl font-medium">Assine abaixo com o dedo ou stylus:</p>

          <div className="border-4 border-gray-300 rounded-3xl overflow-hidden bg-white shadow-inner">
            <canvas
              ref={canvasRef}
              width={1100}
              height={580}
              className="mx-auto block bg-white cursor-crosshair touch-action-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex justify-center gap-6 mt-10">
            <button 
              onClick={limparCanvas}
              className="bg-gray-600 hover:bg-gray-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition"
            >
              Limpar Assinatura
            </button>
            <button 
              onClick={salvarAssinatura}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition"
            >
              ✅ Confirmar e Salvar Assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}