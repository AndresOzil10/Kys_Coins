import React from 'react';
import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

const ViewPdf = ({ pdfUrl }) => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl;
    link.download = 'Reglamento.pdf' // Nombre de descarga
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden p-4">
      {/* Iframe para mostrar el PDF */}
      <iframe
        src={pdfUrl}
        width="100%"
        height="80vh" // Altura responsiva; ajusta según necesidad
        className="border-0 rounded-lg flex-1 min-h-[60vh]" // Flex para adaptarse
        title="Visualizador de PDF"
        onLoad={() => console.log('PDF cargado via iframe')} // Debug opcional
        onError={(e) => console.error('Error cargando PDF en iframe:', e)} // Debug
      />
      
      {/* Botón de descarga */}
      <div className="mt-4 flex justify-center">
        <Button 
          variant="outlined" 
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          aria-label="Descargar PDF"
        >
          Descargar PDF
        </Button>
      </div>
    </div>
  );
};

export default ViewPdf
