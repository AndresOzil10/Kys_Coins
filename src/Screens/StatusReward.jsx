import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
  TableFooter
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Datos de ejemplo - en un caso real vendrían de una API
const mockRewardsData = [
  { 
    id: 1, 
    solicitudId: 'SOL-2024-001', 
    empleado: 'Juan Pérez', 
    nomina: 'EMP001', 
    area: 'Ventas', 
    premio: 'Tarjeta de regalo Amazon $500', 
    fechaSolicitud: '2024-01-15', 
    status: 'pendiente',
    comentarios: 'Premio por cumplimiento de metas del Q4'
  },
  { 
    id: 2, 
    solicitudId: 'SOL-2024-002', 
    empleado: 'María García', 
    nomina: 'EMP002', 
    area: 'Recursos Humanos', 
    premio: 'Días adicionales de vacaciones', 
    fechaSolicitud: '2024-01-18', 
    status: 'aprobado',
    comentarios: 'Reconocimiento por años de servicio'
  },
  { 
    id: 3, 
    solicitudId: 'SOL-2024-003', 
    empleado: 'Carlos López', 
    nomina: 'EMP003', 
    area: 'TI', 
    premio: 'Certificado de reconocimiento', 
    fechaSolicitud: '2024-01-20', 
    status: 'en_camino',
    comentarios: 'Premio por proyecto destacado'
  },
  { 
    id: 4, 
    solicitudId: 'SOL-2024-004', 
    empleado: 'Ana Rodríguez', 
    nomina: 'EMP004', 
    area: 'Finanzas', 
    premio: 'Bono monetario $1000', 
    fechaSolicitud: '2024-01-22', 
    status: 'entregado',
    comentarios: 'Premio por excelencia operativa'
  },
  { 
    id: 5, 
    solicitudId: 'SOL-2024-005', 
    empleado: 'Pedro Martínez', 
    nomina: 'EMP005', 
    area: 'Marketing', 
    premio: 'Curso de especialización', 
    fechaSolicitud: '2024-01-25', 
    status: 'pendiente',
    comentarios: 'Desarrollo profesional'
  },
  { 
    id: 6, 
    solicitudId: 'SOL-2024-006', 
    empleado: 'Laura Sánchez', 
    nomina: 'EMP006', 
    area: 'Operaciones', 
    premio: 'Team lunch patrocinado', 
    fechaSolicitud: '2024-01-28', 
    status: 'aprobado',
    comentarios: 'Premio de equipo'
  },
  { 
    id: 7, 
    solicitudId: 'SOL-2024-007', 
    empleado: 'Miguel Torres', 
    nomina: 'EMP007', 
    area: 'Logística', 
    premio: 'Smartwatch', 
    fechaSolicitud: '2024-02-01', 
    status: 'en_camino',
    comentarios: 'Premio por innovación'
  },
  { 
    id: 8, 
    solicitudId: 'SOL-2024-008', 
    empleado: 'Sofía Ramírez', 
    nomina: 'EMP008', 
    area: 'Calidad', 
    premio: 'Libro especializado', 
    fechaSolicitud: '2024-02-03', 
    status: 'entregado',
    comentarios: 'Premio por certificación'
  },
  { 
    id: 9, 
    solicitudId: 'SOL-2024-009', 
    empleado: 'Diego Hernández', 
    nomina: 'EMP009', 
    area: 'Ventas', 
    premio: 'Tablet', 
    fechaSolicitud: '2024-02-05', 
    status: 'pendiente',
    comentarios: 'Premio por superar metas'
  },
  { 
    id: 10, 
    solicitudId: 'SOL-2024-010', 
    empleado: 'Elena Castro', 
    nomina: 'EMP010', 
    area: 'TI', 
    premio: 'Auriculares inalámbricos', 
    fechaSolicitud: '2024-02-08', 
    status: 'en_camino',
    comentarios: 'Premio por implementación exitosa'
  },
  { 
    id: 11, 
    solicitudId: 'SOL-2024-011', 
    empleado: 'Jorge Flores', 
    nomina: 'EMP011', 
    area: 'Recursos Humanos', 
    premio: 'Reloj inteligente', 
    fechaSolicitud: '2024-02-10', 
    status: 'aprobado',
    comentarios: 'Reconocimiento por liderazgo'
  },
  { 
    id: 12, 
    solicitudId: 'SOL-2024-012', 
    empleado: 'Patricia Ruiz', 
    nomina: 'EMP012', 
    area: 'Finanzas', 
    premio: 'Licencia de software', 
    fechaSolicitud: '2024-02-12', 
    status: 'entregado',
    comentarios: 'Premio por eficiencia'
  },
];

// Componente para mostrar el estado con colores
const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pendiente':
        return {
          label: 'Pendiente',
          color: 'warning',
          icon: <InventoryIcon fontSize="small" />,
          bgColor: '#fff3cd',
          textColor: '#856404'
        };
      case 'aprobado':
        return {
          label: 'Aprobado',
          color: 'info',
          icon: <CheckCircleIcon fontSize="small" />,
          bgColor: '#d1ecf1',
          textColor: '#0c5460'
        };
      case 'en_camino':
        return {
          label: 'En Camino',
          color: 'primary',
          icon: <LocalShippingIcon fontSize="small" />,
          bgColor: '#cce5ff',
          textColor: '#004085'
        };
      case 'entregado':
        return {
          label: 'Entregado',
          color: 'success',
          icon: <CheckCircleIcon fontSize="small" />,
          bgColor: '#d4edda',
          textColor: '#155724'
        };
      case 'rechazado':
        return {
          label: 'Rechazado',
          color: 'error',
          icon: <CloseIcon fontSize="small" />,
          bgColor: '#f8d7da',
          textColor: '#721c24'
        };
      default:
        return {
          label: 'Desconocido',
          color: 'default',
          icon: null,
          bgColor: '#e2e3e5',
          textColor: '#383d41'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      icon={config.icon}
      size="small"
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontWeight: '600',
        border: `1px solid ${config.textColor}20`,
        '& .MuiChip-icon': {
          color: config.textColor
        }
      }}
    />
  );
};

function StatusReward() {
  // Estados
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedReward, setSelectedReward] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Inicializar datos
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setRewards(mockRewardsData);
      setFilteredRewards(mockRewardsData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar datos
  useEffect(() => {
    let filtered = rewards;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reward =>
        reward.empleado.toLowerCase().includes(term) ||
        reward.nomina.toLowerCase().includes(term) ||
        reward.solicitudId.toLowerCase().includes(term) ||
        reward.premio.toLowerCase().includes(term) ||
        reward.area.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(reward => reward.status === statusFilter);
    }

    setFilteredRewards(filtered);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  }, [searchTerm, statusFilter, rewards]);

  // Calcular datos paginados
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRewards.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRewards.length / rowsPerPage);

  // Manejar cambio de página
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Estadísticas
  const stats = {
    total: rewards.length,
    pendiente: rewards.filter(r => r.status === 'pendiente').length,
    aprobado: rewards.filter(r => r.status === 'aprobado').length,
    en_camino: rewards.filter(r => r.status === 'en_camino').length,
    entregado: rewards.filter(r => r.status === 'entregado').length,
  };

  // Abrir diálogo para cambiar estado
  const handleOpenStatusDialog = (reward) => {
    setSelectedReward(reward);
    setNewStatus(reward.status);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReward(null);
    setNewStatus('');
  };

  // Actualizar estado del premio
  const handleUpdateStatus = () => {
    if (!selectedReward || !newStatus) return;

    // Simular actualización en API
    setRewards(prevRewards =>
      prevRewards.map(reward =>
        reward.id === selectedReward.id
          ? { ...reward, status: newStatus }
          : reward
      )
    );

    // Mostrar notificación
    setSnackbar({
      open: true,
      message: `Estado de la solicitud ${selectedReward.solicitudId} actualizado a ${newStatus}`,
      severity: 'success'
    });

    handleCloseDialog();
  };

  // Refrescar datos
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setRewards([...mockRewardsData]); // Simular recarga
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Datos actualizados correctamente',
        severity: 'info'
      });
    }, 800);
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto pt-6">
        
        {/* Header */}
        <div className="mb-8 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Premios</h1>
              <p className="text-gray-600 mt-2">Administra y actualiza el estado de las solicitudes de premios</p>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-4 md:px-6 lg:px-8">
            <Card sx={{ backgroundColor: '#e8f4fd' }}>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-blue-600">
                  {stats.total}
                </Typography>
                <Typography variant="body2" className="text-blue-700">
                  Total Solicitudes
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#fff3cd' }}>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-amber-600">
                  {stats.pendiente}
                </Typography>
                <Typography variant="body2" className="text-amber-700">
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#d1ecf1' }}>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-cyan-600">
                  {stats.aprobado}
                </Typography>
                <Typography variant="body2" className="text-cyan-700">
                  Aprobados
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#cce5ff' }}>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-indigo-600">
                  {stats.en_camino}
                </Typography>
                <Typography variant="body2" className="text-indigo-700">
                  En Camino
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: '#d4edda' }}>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-emerald-600">
                  {stats.entregado}
                </Typography>
                <Typography variant="body2" className="text-emerald-700">
                  Entregados
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-6 px-4 md:px-6 lg:px-8">
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por empleado, nómina, solicitud o premio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filtrar por estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon className="text-gray-400" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="todos">Todos los estados</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="aprobado">Aprobado</MenuItem>
                  <MenuItem value="en_camino">En Camino</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Paper>
        </div>

        {/* Tabla de premios - CON MARGIN BOTTOM DE 15px */}
        <div className="px-4 md:px-6 lg:px-8 mb-15">
            <Paper 
            elevation={0} 
            sx={{ 
                borderRadius: 3, 
                overflow: 'hidden', 
                mb: '15px'  // Cambié de mb: 3 a mb: '15px'
            }}
            >
            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow sx={{ 
                    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '& th': {
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        py: 2
                    }
                    }}>
                    <TableCell>ID Solicitud</TableCell>
                    <TableCell>Empleado</TableCell>
                    <TableCell>Área</TableCell>
                    <TableCell>Premio</TableCell>
                    <TableCell>Fecha Solicitud</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                    <TableRow>
                        <TableCell colSpan={7}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                        </TableCell>
                    </TableRow>
                    ) : currentRows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7}>
                        <Box sx={{ textAlign: 'center', py: 8, color: 'gray.500' }}>
                            <Typography variant="h6">No se encontraron solicitudes</Typography>
                            <Typography variant="body2">Intenta con otros filtros de búsqueda</Typography>
                        </Box>
                        </TableCell>
                    </TableRow>
                    ) : (
                    currentRows.map((reward) => (
                        <TableRow 
                        key={reward.id}
                        hover
                        sx={{ 
                            '&:hover': { backgroundColor: '#f8fafc' },
                            '&:last-child td': { borderBottom: 0 }
                        }}
                        >
                        <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: '600', color: '#1f2937' }}>
                            {reward.solicitudId}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <div>
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>
                                {reward.empleado}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'gray.600' }}>
                                Nómina: {reward.nomina}
                            </Typography>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Chip 
                            label={reward.area} 
                            size="small" 
                            sx={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}
                            />
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">
                            {reward.premio}
                            </Typography>
                            {reward.comentarios && (
                            <Typography variant="caption" sx={{ color: 'gray.600', display: 'block', mt: 0.5 }}>
                                {reward.comentarios}
                            </Typography>
                            )}
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2">
                            {formatDate(reward.fechaSolicitud)}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <StatusChip status={reward.status} />
                        </TableCell>
                        <TableCell align="center">
                            <div className="flex justify-center gap-1">
                            <Tooltip title="Ver detalles">
                                <IconButton size="small" sx={{ color: '#4f46e5' }}>
                                <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cambiar estado">
                                <IconButton 
                                size="small" 
                                sx={{ color: '#059669' }}
                                onClick={() => handleOpenStatusDialog(reward)}
                                >
                                <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </TableContainer>

            {/* Footer con paginación */}
            {filteredRewards.length > 0 && (
                <Box sx={{ 
                p: 3, 
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
                }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Mostrando <strong>{indexOfFirstRow + 1}-{Math.min(indexOfLastRow, filteredRewards.length)}</strong> de{' '}
                    <strong>{filteredRewards.length}</strong> solicitudes
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                        '& .MuiPaginationItem-root': {
                        borderRadius: '8px',
                        margin: '0 2px',
                        fontSize: '0.875rem',
                        '&.Mui-selected': {
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                            backgroundColor: '#4338ca'
                            }
                        },
                        '&:hover': {
                            backgroundColor: '#e5e7eb'
                        }
                        }
                    }}
                    />
                </Box>
                </Box>
            )}
            </Paper>
        </div>

        {/* Diálogo para cambiar estado */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
            <div className="flex items-center justify-between">
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Cambiar Estado del Premio
              </Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            {selectedReward && (
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    ID de Solicitud
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '600' }}>
                    {selectedReward.solicitudId}
                  </Typography>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Empleado
                    </Typography>
                    <Typography variant="body1">
                      {selectedReward.empleado}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Premio
                    </Typography>
                    <Typography variant="body1">
                      {selectedReward.premio}
                    </Typography>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap=4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Estado Actual
                    </Typography>
                    <div className="mt-1">
                      <StatusChip status={selectedReward.status} />
                    </div>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel>Nuevo Estado</InputLabel>
                      <Select
                        value={newStatus}
                        label="Nuevo Estado"
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="aprobado">Aprobado</MenuItem>
                        <MenuItem value="en_camino">En Camino</MenuItem>
                        <MenuItem value="entregado">Entregado</MenuItem>
                        <MenuItem value="rechazado">Rechazado</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Comentarios
                  </Typography>
                  <Typography variant="body1">
                    {selectedReward.comentarios || 'Sin comentarios'}
                  </Typography>
                </div>
              </div>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateStatus}
              disabled={!newStatus || newStatus === selectedReward?.status}
              sx={{
                backgroundColor: '#4f46e5',
                '&:hover': { backgroundColor: '#4338ca' }
              }}
            >
              Actualizar Estado
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default StatusReward;