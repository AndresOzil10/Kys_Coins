import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, IconButton, TextField, InputAdornment, Tabs, Tab, Button, LinearProgress, Paper, List, ListItem, ListItemText, ListItemAvatar, Collapse } from '@mui/material';
import { Search, FilterList, LocalShipping, CheckCircle, PendingActions, ShoppingBag, Work, Star, CalendarToday, ExpandMore, Loyalty, ExpandLess } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

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
      throw new Error('Error en la respuesta de la API');
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

// Animación para las tarjetas
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`

// Componente Styled para tarjetas - CORREGIDO
const OrderCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'color'
})(({ theme, color }) => ({
  height: '100%',
  border: `2px solid ${color}20`,
  borderRadius: 16,
  transition: 'all 0.3s ease',
  background: `linear-gradient(145deg, ${color}08, ${color}02)`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${color}20`,
    borderColor: `${color}40`,
    animation: `${floatAnimation} 2s ease-in-out infinite`
  }
}))

// Componente para barra de progreso
const ProgressBar = styled(LinearProgress)(({ theme, color }) => ({
  height: 10,
  borderRadius: 10,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 10,
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
    boxShadow: `0 0 10px ${color}40`
  }
}))

// Componente para el estado
const StatusChip = ({ status }) => {
  const statusConfig = {
    'Entregado': {
      label: 'Entregado',
      color: '#4caf50',
      icon: <CheckCircle fontSize="small" />,
      bgColor: '#4caf5015'
    },
    'En Camino': {
      label: 'En Camino',
      color: '#2196f3',
      icon: <LocalShipping fontSize="small" />,
      bgColor: '#2196f315'
    },
    'Pendiente': {
      label: 'Pendiente',
      color: '#ff9800',
      icon: <PendingActions fontSize="small" />,
      bgColor: '#ff980015'
    }
  };

  const config = statusConfig[status] || statusConfig.pendiente;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}30`,
        fontWeight: 700,
        fontSize: '0.75rem',
        padding: '4px 8px',
        '& .MuiChip-icon': { color: config.color }
      }}
    />
  );
}

// Componente para puntos
const PointsDisplay = ({ points }) => (
  <Box sx={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  }}>
    <Loyalty sx={{ fontSize: 16, mr: 0.5 }} />
    {points.toLocaleString()} pts
  </Box>
)

function Orders() {
  const location = useLocation();
  const { nomina } = location.state || {}
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

   const RequestData = async () => {
      setLoading(true)
      const dataToSend = {
        aksi: "GetRequests",
        nn: nomina
      }
      try {
        const response = await enviarData(url, dataToSend);
        setOrders(response.data);
      } catch (error) {
        console.error("Error al solicitar los datos:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    RequestData();
  }, [])

// Filtrar órdenes - CON BÚSQUEDA EN ITEMS
const filteredOrders = orders.filter(order => {
  // Validar que la orden exista
  if (!order) return false;
  
  const searchTermLower = String(searchTerm || '').toLowerCase().trim();
  
  // Si no hay término de búsqueda, solo aplicar filtro de estado
  if (!searchTermLower) {
    return statusFilter === 'todos' || order.estatus === statusFilter;
  }
  
  // Búsqueda en campos principales
  const mainFieldsMatch = 
    (order.id?.toString() || '').toLowerCase().includes(searchTermLower) ||
    (order.nn?.toString() || '').toLowerCase().includes(searchTermLower);
  
  // Búsqueda en items del pedido (si existen)
  const itemsMatch = order.items?.some(item => 
    (item.descripcionImagen?.toLowerCase() || '').includes(searchTermLower) ||
    (item.nombreImagen?.toLowerCase() || '').includes(searchTermLower)
  ) || false;
  
  const matchesSearch = mainFieldsMatch || itemsMatch;
  const matchesStatus = statusFilter === 'todos' || order.estatus === statusFilter;
  
  return matchesSearch && matchesStatus;
});

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      bgcolor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Typography component="div" variant="h4" fontWeight="bold" gutterBottom>
                Mis Pedidos
              </Typography>
              <Typography component="div" variant="body1" sx={{ opacity: 0.9 }}>
                Da seguimiento a todos tus pedidos realizados con tus KysPoints.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      {/* Barra de búsqueda y filtros */}
      <Paper sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por número de pedido, nómina o artículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              size="medium"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Tabs
                value={activeTab}
                onChange={(e, value) => {
                  setActiveTab(value);
                  const statusMap = ['todos', 'Pendiente', 'En Camino', 'Entregado'];
                  setStatusFilter(statusMap[value]);
                }}
                sx={{ 
                  '& .MuiTab-root': { 
                    minHeight: 40,
                    fontWeight: 600 
                  }
                }}
              >
                <Tab label="Todos" />
                <Tab label="Pendientes" />
                <Tab label="En Camino" />
                <Tab label="Entregados" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Contador de resultados - CORREGIDO */}
      <Typography component="div" variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        {Array.isArray(filteredOrders) ? filteredOrders.length : 0} 
        pedido{filteredOrders.length !== 1 ? 's' : ''} 
        encontrado{filteredOrders.length !== 1 ? 's' : ''}
      </Typography>

      {/* Grid de pedidos */}
      <Grid container spacing={3}>
        {filteredOrders.map((order, index) => (
          <Grid item xs={12} key={order.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <OrderCard color={order.color}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Header del pedido - CORREGIDO */}
                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                      }}>
                        <Box>
                          <Typography component="div" variant="h6" fontWeight="bold">
                            {order.id}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Pedido: {order.fechaSolicitud} • Entrega: {order.fechaEntrega}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <StatusChip status={order.estatus} />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Información del empleado - CORREGIDO */}
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box>
                            <Typography component="div" variant="subtitle2" fontWeight="bold">
                              {order.nombreCompleto}
                            </Typography>
                            <Typography component="div" variant="caption" color="text.secondary">
                              {order.areaNombre}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Work fontSize="small" sx={{ color: 'text.secondary' }} />
                          <Typography component="span" variant="body2">
                            Nómina: <strong>{order.nn}</strong>
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Artículos - CORREGIDO */}
                    <Grid item xs={12} md={5}>
                      <Box sx={{ pl: { xs: 0, md: 2 } }}>
                        <Typography component="div" variant="subtitle2" fontWeight="bold" gutterBottom>
                          Artículo{order.items.length > 1 ? 's' : ''} ({order.items.length})
                        </Typography>
                        <List dense disablePadding>
                          {order.items.map((item, idx) => (
                            <ListItem 
                              key={idx}
                              sx={{ 
                                px: 0,
                                '&:not(:last-child)': { mb: 1 }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar 
                                  src={`kyspoints/assets/images/${item.image}`}
                                  variant="rounded"
                                  sx={{ 
                                    width: 60, 
                                    height: 60,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <ShoppingBag />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography component="div" variant="subtitle2" fontWeight="medium">
                                    {item.descripcionImagen}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>

                    {/* Puntos y acciones - CORREGIDO */}
                    <Grid item xs={12} md={3}>
                      <Paper sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        height: '100%'
                      }}>
                        <Typography component="div" variant="subtitle2" fontWeight="bold" gutterBottom>
                          Puntos Gastados
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: 60 
                        }}>
                          <Typography component="div" variant="h4" fontWeight="bold" color="primary">
                            150,000pts
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            pts
                          </Typography>
                        </Box>
                        
                        <Typography component="div" variant="caption" color="text.secondary" display="block" gutterBottom>
                          Valor: $1,500.00
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Barra de progreso - CORREGIDO */}
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography component="span" variant="caption" fontWeight="medium">
                            Progreso de entrega: 
                          </Typography>
                          <Typography component="span" variant="caption" fontWeight="bold" color={order.color}>
                            {order.progreso}%
                          </Typography>
                        </Box>
                        <ProgressBar 
                          variant="determinate" 
                          value={order.progreso}
                          sx={{
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: order.color
                            }
                          }}
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          mt: 1 
                        }}>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {order.estatus === 'Pendiente' ? 'En preparación' : 
                             order.estatus === 'En Camino' ? order.currentLocation : 
                             'Entregado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </OrderCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Si no hay resultados - CORREGIDO */}
      {filteredOrders.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <ShoppingBag sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
          <Typography component="div" variant="h6" color="text.secondary" gutterBottom>
            No se encontraron pedidos
          </Typography>
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no tienes pedidos registrados'}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ShoppingBag />}
            sx={{ borderRadius: 2 }}
          >
            Ver Catálogo de Productos
          </Button>
        </Box>
      )}

      {/* Footer informativo - CORREGIDO */}
      <Box sx={{ 
        mt: 4, 
        pt: 3, 
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        mb: 15
      }}>
        <Typography component="div" variant="body2" color="text.secondary" gutterBottom>
          Kys Points • Todos los pedidos son canjeados con puntos acumulados
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary">
         Última actualización: {new Date().toLocaleDateString('es-ES')}
        </Typography>
      </Box>
    </Box>
  );
}

export default Orders