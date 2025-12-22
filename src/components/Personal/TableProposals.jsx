import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useLocation } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Alert,
  Skeleton
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API')
    }
    return await resp.json()
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

function TableProposals() {
  const location = useLocation()
  const { nomina } = location.state || {}

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totals, setTotals] = useState({
    otorgados: 0,
    usados: 0,
    restantes: 0
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    const dataToSend = {
      aksi: "GetDataPoints",
      nn: nomina
    }

    try { 
      const response = await enviarData(url, dataToSend)
      const data = response.data || []
      setRows(data)
      
      // Calcular totales
      const totals = data.reduce((acc, row) => ({
        otorgados: acc.otorgados + (parseInt(row.puntosOtorgados) || 0),
        usados: acc.usados + (parseInt(row.puntosUsados) || 0),
        restantes: acc.restantes + (parseInt(row.puntosRestantes) || 0)
      }), { otorgados: 0, usados: 0, restantes: 0 })
      
      setTotals(totals)
      
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Error al cargar los datos de puntos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getRowColor = (restantes, otorgados) => {
    const percentage = otorgados > 0 ? (restantes / otorgados) * 100 : 0
    if (percentage >= 75) return 'success'
    if (percentage >= 50) return 'warning'
    return 'error'
  }

  const getUsagePercentage = (usados, otorgados) => {
    if (otorgados === 0) return 0
    return Math.round((usados / otorgados) * 100)
  }

  const getStatusChip = (restantes, otorgados) => {
    const percentage = getUsagePercentage(otorgados - restantes, otorgados)
    
    if (restantes === 0) {
      return (
        <Chip 
          icon={<CheckCircleIcon />}
          label="Agotados"
          size="small"
          color="success"
          variant="outlined"
        />
      )
    }
    
    if (percentage >= 80) {
      return (
        <Chip 
          icon={<TrendingUpIcon />}
          label="Alto uso"
          size="small"
          color="warning"
        />
      )
    }
    
    if (percentage >= 50) {
      return (
        <Chip 
          label="Medio uso"
          size="small"
          color="info"
          variant="outlined"
        />
      )
    }
    
    return (
      <Chip 
        icon={<TrendingDownIcon />}
        label="Bajo uso"
        size="small"
        color="secondary"
        variant="outlined"
      />
    )
  }

  if (loading && rows.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" height={200} className="rounded-2xl" />
        <Skeleton variant="rectangular" height={400} className="rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 rounded-2xl">
        <CardContent className="text-center p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <button 
            onClick={fetchData}
            className="btn btn-outline btn-error mt-4"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 mb-24">

      {/* Tabla */}
      <Card className="border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <TableCell className="text-white font-bold">
                    <div className="flex items-center gap-2">
                      <span>💡</span>
                      Propuesta
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold" align="center">
                    <div className="flex items-center justify-center gap-2">
                      <span>🏆</span>
                      Otorgados
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold" align="center">
                    <div className="flex items-center justify-center gap-2">
                      <span>📊</span>
                      Usados
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold" align="center">
                    <div className="flex items-center justify-center gap-2">
                      <span>💰</span>
                      Restantes
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold" align="center">
                    <div className="flex items-center justify-center gap-2">
                      <span>📈</span>
                      Uso
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-bold" align="center">
                    <div className="flex items-center justify-center gap-2">
                      <span>⚡</span>
                      Estado
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-10">
                      <div className="text-center space-y-4">
                        <div className="text-6xl text-gray-300">📝</div>
                        <Typography variant="h6" color="textSecondary">
                          No hay datos de puntos
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Aún no tienes puntos registrados por propuestas
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const porcentajeUso = getUsagePercentage(
                      parseInt(row.puntosUsados) || 0,
                      parseInt(row.puntosOtorgados) || 1
                    )
                    const puntosRestantes = parseInt(row.puntosRestantes) || 0
                    const puntosOtorgados = parseInt(row.puntosOtorgados) || 1

                    return (
                      <TableRow 
                        key={row.id} 
                        hover
                        className="group hover:bg-indigo-50/30 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-indigo-600">💡</span>
                            </div>
                            <div>
                              <Typography variant="body1" className="font-medium text-gray-800">
                                {row.titulo}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {row.id}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Typography variant="body1" className="font-bold text-green-700">
                            {(parseInt(row.puntosOtorgados) || 0).toLocaleString()}
                            <span className="text-sm font-normal ml-1">pts</span>
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Typography variant="body1" className="font-bold text-blue-700">
                            {(parseInt(row.puntosUsados) || 0).toLocaleString()}
                            <span className="text-sm font-normal ml-1">pts</span>
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Typography variant="body1" className="font-bold text-purple-700">
                            {(parseInt(row.puntosRestantes) || 0).toLocaleString()}
                            <span className="text-sm font-normal ml-1">pts</span>
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-full max-w-[120px]">
                              <LinearProgress 
                                variant="determinate" 
                                value={porcentajeUso}
                                className="h-2 rounded-full"
                                color={getRowColor(puntosRestantes, puntosOtorgados)}
                              />
                            </div>
                            <Typography variant="caption" className="font-medium">
                              {porcentajeUso}%
                            </Typography>
                          </div>
                        </TableCell>
                        
                        <TableCell align="center">
                          {getStatusChip(puntosRestantes, puntosOtorgados)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        className="rounded-2xl border border-blue-200 bg-blue-50"
      >
        <Typography variant="body2">
          <strong>Nota:</strong> Los puntos se otorgan cuando tus propuestas son aprobadas y 
          pueden ser utilizados para canjear recompensas. Los puntos vencen después de 12 meses.
        </Typography>
      </Alert>
    </div>
  )
}

export default TableProposals