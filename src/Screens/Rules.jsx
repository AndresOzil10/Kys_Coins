import React from 'react';
import ViewPdf from '../components/Personal/ViewPdf'; // Asume que existe; si no, usa el ejemplo abajo
function Rules() {
  const pdfUrl = '/assets/files/Reglamento.pdf'; // Corregido: Ruta absoluta desde public
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-2 sm:p-4"> {/* Responsivo: Padding adaptativo, altura completa */}
      {/* Header con título */}
      {/* <header className="text-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 underline decoration-[#bf2a23] decoration-2">
          Reglamento Kayser Points
        </h1>
        <p className="text-sm text-gray-600 mt-2">Lee las reglas completas del programa</p>
      </header> */}
      {/* Contenido principal: PDF centrado */}
      <main className="flex-1 flex items-center justify-center pb-20"> {/* pb-20 para bottom nav; flex para centrar */}
        <div className="w-full max-w-4xl h-[100vh] sm:h-[106vh]"> {/* Altura responsiva: 70vh en móvil, 80vh en sm+ */}
          <ViewPdf pdfUrl={pdfUrl} />
        </div>
      </main>
    </div>
  )
}
export default Rules