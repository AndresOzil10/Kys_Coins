import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { CircularProgress, Tooltip } from '@mui/material'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API')
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

function Stat() {
  const location = useLocation();

  const { nomina } = location.state || {}
  
  const [points, setPoints] = useState({
    actual: 0,
    nearing: 0,
    lost: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const fetchAllPointsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Hacer todas las llamadas en paralelo
      const [actualRes, nearingRes, lostRes] = await Promise.all([
        enviarData(url, { aksi: "GetPointsStat", nn: nomina }),
        enviarData(url, { aksi: "GetPointsStatN", nn: nomina }),
        enviarData(url, { aksi: "GetPointsStatL", nn: nomina })
      ]);

      const actualPoints = actualRes.data || 0;
      const nearingPoints = nearingRes.data || 0;
      const lostPoints = lostRes.data || 0;

      setPoints({
        actual: actualPoints,
        nearing: nearingPoints,
        lost: lostPoints
      });

      // Calcular puntos totales (actual + próximos a vencer)
      setTotalPoints(actualPoints + nearingPoints);

    } catch (error) {
      console.error('Error fetching points data:', error);
      setError('Error al cargar los datos de puntos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllPointsData();
  }, [nomina]);

  const statCards = [
    {
      id: 'actual',
      title: 'Puntos Activos',
      value: points.actual,
      icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-100',
      iconBg: 'bg-green-100 text-green-600',
      description: 'Puntos disponibles',
      tooltip: 'Puntos que puedes usar ahora mismo'
    },
    {
      id: 'nearing',
      title: 'Próximos a Vencer',
      value: points.nearing,
      icon: <HourglassEmptyIcon sx={{ fontSize: 28 }} />,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-100',
      iconBg: 'bg-amber-100 text-amber-600',
      description: 'Vencen pronto',
      tooltip: 'Puntos que vencerán en los próximos 30 días'
    },
    {
      id: 'lost',
      title: 'Puntos Vencidos',
      value: points.lost,
      icon: <TrendingDownIcon sx={{ fontSize: 28 }} />,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      borderColor: 'border-red-100',
      iconBg: 'bg-red-100 text-red-600',
      description: 'Ya no disponibles',
      tooltip: 'Puntos que han vencido'
    },
    {
      id: 'total',
      title: 'Puntos Totales',
      value: totalPoints,
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      color: 'text-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-violet-50',
      borderColor: 'border-indigo-100',
      iconBg: 'bg-indigo-100 text-indigo-600',
      description: 'Acumulados este año',
      tooltip: 'Suma de puntos activos y próximos a vencer'
    }
  ];

  const getPercentage = (value) => {
    if (totalPoints === 0) return 0;
    return Math.round((value / totalPoints) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center space-y-4">
          <CircularProgress 
            size={60} 
            sx={{ color: '#6366f1' }}
          />
          <p className="text-gray-600 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ {error}</div>
        <button 
          onClick={fetchAllPointsData}
          className="btn btn-outline btn-error btn-sm mt-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de Puntos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualiza y gestiona tus puntos de propuestas. Mantén un seguimiento de tus contribuciones y recompensas.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Tooltip key={stat.id} title={stat.tooltip} arrow placement="top">
            <div 
              className={`
                ${stat.bgColor} 
                ${stat.borderColor}
                rounded-2xl border 
                p-5 
                transition-all 
                duration-300 
                hover:shadow-xl 
                hover:scale-[1.02] 
                hover:border-opacity-50
                cursor-pointer
                group
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} transition-all duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <button 
                  onClick={fetchAllPointsData}
                  className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Actualizar"
                >
                  <AutorenewIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                  <span className="text-sm font-normal ml-2">pts</span>
                </p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
              
              {/* Barra de progreso */}
              {(stat.id === 'actual' || stat.id === 'nearing') && totalPoints > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Proporción</span>
                    <span>{getPercentage(points[stat.id])}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${getPercentage(points[stat.id])}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Resumen */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span> Resumen de Puntos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-gray-700">Disponibilidad total</span>
              <span className="font-bold text-indigo-600">{totalPoints.toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-gray-700">Tasa de utilización</span>
              <span className="font-bold text-green-600">
                {points.actual > 0 ? Math.round((points.actual / totalPoints) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-gray-700">Por vencer</span>
              <span className="font-bold text-amber-600">
                {points.nearing > 0 ? Math.round((points.nearing / totalPoints) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Consejos */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">💡</span> Consejos para tus Puntos
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">1</span>
              </div>
              <p className="text-gray-700 text-sm">
                Usa tus puntos próximos a vencer primero para maximizar tus beneficios
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">2</span>
              </div>
              <p className="text-gray-700 text-sm">
                Cada propuesta aprobada genera nuevos puntos, ¡sigue contribuyendo!
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">3</span>
              </div>
              <p className="text-gray-700 text-sm">
                Revisa periódicamente para no perder puntos por vencimiento
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer con acciones */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p>📅 Última actualización: {new Date().toLocaleTimeString('es-MX')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchAllPointsData}
            className="btn btn-outline btn-primary btn-sm flex items-center gap-2"
          >
            <AutorenewIcon sx={{ fontSize: 18 }} />
            Actualizar
          </button>
          <button 
            className="btn btn-primary btn-sm bg-gradient-to-r from-indigo-500 to-purple-600 border-0 text-white"
            onClick={() => {
              // Navegar a página de canje de puntos si existe
              console.log('Ir a canje de puntos');
            }}
          >
            🎁 Canjear Puntos
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default Stat