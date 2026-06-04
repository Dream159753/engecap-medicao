'use client';

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Bom dia, Jhony!</h1>
          <p className="text-gray-600 mt-1">Obra: Faena - 325 • Segunda-feira, 01 de Junho</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Progresso Geral da Obra</p>
          <p className="text-3xl font-bold text-blue-600">42%</p>
        </div>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Serviços Liberados</p>
          <p className="text-4xl font-bold text-green-600 mt-2">18</p>
          <p className="text-sm text-green-600">de 34 trechos</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Medições Pendentes</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">7</p>
          <p className="text-sm text-orange-600">Aguardando lançamento</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Medições Aprovadas</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">12</p>
          <p className="text-sm text-blue-600">Esta semana</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Valor Total Previsto</p>
          <p className="text-4xl font-bold text-green-600 mt-2">R$ 184k</p>
          <p className="text-sm text-green-600">+12% este mês</p>
        </div>
      </div>

      {/* Progresso por Torre */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Progresso por Seção</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Torre A</span>
                <span>68%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-blue-600 w-[68%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Periferia</span>
                <span>35%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-blue-600 w-[35%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Últimas Medições</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium">Forma + Armação - Torre A / 4º Pav.</p>
                <p className="text-gray-500">28/05/2026 • R$ 27.360,00</p>
              </div>
              <span className="text-green-600 font-medium">Aprovado</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium">Desforma - Torre A / 3º Pav.</p>
                <p className="text-gray-500">27/05/2026 • R$ 8.450,00</p>
              </div>
              <span className="text-orange-600 font-medium">Pendente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        Use o menu lateral para acessar Cadastro, Liberação ou Medição
      </div>
    </div>
  );
}