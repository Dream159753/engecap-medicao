'use client';

import { useState, useRef, useEffect } from 'react';

export default function AssinaturaMedicao() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [assinaturaFeita, setAssinaturaFeita] = useState(false);
  const [medicaoAtual, setMedicaoAtual] = useState<any>(null);

  useEffect(() => {
    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo) {
      const medicoes = JSON.parse(salvo);
      if (medicoes.length > 0) {
        setMedicaoAtual(medicoes[medicoes.length - 1]);
      }
    }
  }, []);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
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
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setAssinaturaFeita(true);
  };

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

    // Remove a medição assinada da lista de aguardando
    const salvo = localStorage.getItem('medicoesAguardandoAssinatura');
    if (salvo && medicaoAtual) {
      let medicoes = JSON.parse(salvo);
      medicoes = medicoes.filter((m: any) => m.id !== medicaoAtual.id);
      localStorage.setItem('medicoesAguardandoAssinatura', JSON.stringify(medicoes));
    }

    alert("✅ Assinatura salva com sucesso!\nMedição finalizada.");
    window.location.href = "/assinaturas";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Assinatura da Medição</h2>

        {medicaoAtual && (
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            <h3 className="font-semibold mb-4">Resumo da Medição</h3>
            <p><strong>Funcionário:</strong> {medicaoAtual.nome}</p>
            <p><strong>Trecho:</strong> {medicaoAtual.servico}</p>
            <p><strong>Quantidade:</strong> {medicaoAtual.quantidade} m³</p>
            <p><strong>Total:</strong> R$ {medicaoAtual.total}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-8">
          <p className="text-center mb-6 text-lg font-medium">Assine abaixo com o dedo (tablet/celular):</p>

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border-2 border-gray-400 rounded-xl mx-auto block bg-white cursor-crosshair touch-action-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={limparCanvas}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg"
            >
              Limpar Assinatura
            </button>
            <button 
              onClick={salvarAssinatura}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-semibold"
            >
              Confirmar e Salvar Assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}