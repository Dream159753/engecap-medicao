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
    ctx.lineWidth = 5;
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Assinatura da Medição</h2>
          <p className="text-gray-600 mt-2">Confirme os dados e assine abaixo</p>
        </div>

        {medicaoAtual && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
            <h3 className="text-2xl font-semibold mb-6 text-center border-b pb-4">Resumo da Medição</h3>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <strong>Funcionário:</strong> {medicaoAtual.nome}
              </div>
              <div>
                <strong>Chapa:</strong> {medicaoAtual.chapa}
              </div>
              <div className="col-span-2">
                <strong>Trecho / Serviço:</strong> {medicaoAtual.servico}
              </div>
              <div>
                <strong>Quantidade:</strong> <span className="text-blue-600 font-bold">{medicaoAtual.quantidade} m³</span>
              </div>
              <div>
                <strong>Total:</strong> <span className="text-green-600 font-bold">R$ {medicaoAtual.total}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <p className="text-center text-xl font-medium mb-6">Assine abaixo com o dedo ou stylus:</p>

          <div className="border-4 border-gray-300 rounded-2xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={900}
              height={450}
              className="mx-auto block cursor-crosshair touch-action-none"
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