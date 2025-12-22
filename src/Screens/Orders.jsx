import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Button,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Collapse
} from '@mui/material';
import {
  Search,
  FilterList,
  LocalShipping,
  CheckCircle,
  PendingActions,
  ShoppingBag,
  Work,
  Star,
  CalendarToday,
  ExpandMore,
  Loyalty,
  ExpandLess
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Animación para las tarjetas
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Datos de ejemplo para pedidos (mantenido igual)
const ordersData = [
  {
    id: '#ORD-001',
    orderNumber: 'ORD20240115001',
    nomina: 'NOM-234567',
    customerName: 'María González',
    customerEmail: 'maria.gonzalez@empresa.com',
    customerAvatar: 'MG',
    department: 'Recursos Humanos',
    items: [
      {
        id: 1,
        name: 'Laptop Dell XPS 15',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop',
        points: 85000,
        originalPrice: 24999.99,
        quantity: 1,
        rating: 4.8,
        description: 'Laptop de alta gama para trabajo profesional'
      }
    ],
    totalPoints: 85000,
    totalAmount: 24999.99,
    date: '2024-01-15',
    expectedDelivery: '2024-01-22',
    actualDelivery: '2024-01-21 14:30',
    status: 'entregado',
    deliveryDate: '2024-01-21',
    address: 'Oficina Central, Piso 3, Cubículo 45',
    deliveryNotes: 'Entregado en recepción de RH',
    progress: 100,
    color: '#4caf50',
    trackingNumber: 'TRK789456123',
    carrier: 'DHL Express',
    currentLocation: 'Entregado',
    review: {
      rating: 5,
      comment: 'Excelente producto, llegó antes de lo esperado',
      date: '2024-01-22'
    }
  },
  {
    id: '#ORD-002',
    orderNumber: 'ORD20240114001',
    nomina: 'NOM-345678',
    customerName: 'Carlos López',
    customerEmail: 'carlos.lopez@empresa.com',
    customerAvatar: 'CL',
    department: 'Ventas',
    items: [
      {
        id: 1,
        name: 'Smartwatch Apple Watch Series 9',
        category: 'Electrónica',
        image: 'https://images.unsplash.com/photo-1434493650001-5d43a6fea0a6?w=150&h=150&fit=crop',
        points: 35000,
        originalPrice: 8999.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Audífonos Sony WH-1000XM5',
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=150&fit=crop',
        points: 22000,
        originalPrice: 6499.99,
        quantity: 1
      }
    ],
    totalPoints: 57000,
    totalAmount: 15499.98,
    date: '2024-01-14',
    expectedDelivery: '2024-01-18',
    actualDelivery: null,
    status: 'en camino',
    deliveryDate: '2024-01-18',
    address: 'Edificio B, Departamento de Ventas',
    deliveryNotes: 'Entregar después de las 10:00 AM',
    progress: 75,
    color: '#2196f3',
    trackingNumber: 'TRK321654987',
    carrier: 'FedEx',
    currentLocation: 'En distribución local',
    eta: '2-3 días hábiles'
  },
  {
    id: '#ORD-003',
    orderNumber: 'ORD20240115002',
    nomina: 'NOM-456789',
    customerName: 'Ana Martínez',
    customerEmail: 'ana.martinez@empresa.com',
    customerAvatar: 'AM',
    department: 'Marketing',
    items: [
      {
        id: 1,
        name: 'Silla Ergonómica Ejecutiva',
        category: 'Mobiliario',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop',
        points: 42000,
        originalPrice: 7499.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Escritorio de Madera',
        category: 'Mobiliario',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop',
        points: 38000,
        originalPrice: 5999.99,
        quantity: 1
      }
    ],
    totalPoints: 80000,
    totalAmount: 13499.98,
    date: '2024-01-15',
    expectedDelivery: '2024-01-25',
    actualDelivery: null,
    status: 'pendiente',
    deliveryDate: '2024-01-25',
    address: 'Área Creativa, Piso 2',
    deliveryNotes: 'Requiere ensamblaje',
    progress: 30,
    color: '#ff9800',
    trackingNumber: 'TRK147258369',
    carrier: 'UPS',
    currentLocation: 'En preparación',
    preparationTime: '5-7 días hábiles'
  },
  {
    id: '#ORD-004',
    orderNumber: 'ORD20240113001',
    nomina: 'NOM-567890',
    customerName: 'Pedro Ramírez',
    customerEmail: 'pedro.ramirez@empresa.com',
    customerAvatar: 'PR',
    department: 'TI',
    items: [
      {
        id: 1,
        name: 'Monitor Curvo 34" 4K',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=150&h=150&fit=crop',
        points: 65000,
        originalPrice: 12999.99,
        quantity: 1
      }
    ],
    totalPoints: 65000,
    totalAmount: 12999.99,
    date: '2024-01-13',
    expectedDelivery: '2024-01-15',
    actualDelivery: '2024-01-15 11:15',
    status: 'entregado',
    deliveryDate: '2024-01-15',
    address: 'Centro de Datos, Nivel 1',
    deliveryNotes: 'Instalado en estación de trabajo',
    progress: 100,
    color: '#4caf50',
    trackingNumber: 'TRK963852741',
    carrier: 'DHL',
    currentLocation: 'Entregado',
    review: {
      rating: 4,
      comment: 'Buen producto, calidad excelente',
      date: '2024-01-16'
    }
  },
  {
    id: '#ORD-005',
    orderNumber: 'ORD20240114002',
    nomina: 'NOM-678901',
    customerName: 'Laura Sánchez',
    customerEmail: 'laura.sanchez@empresa.com',
    customerAvatar: 'LS',
    department: 'Finanzas',
    items: [
      {
        id: 1,
        name: 'Tablet iPad Pro 12.9"',
        category: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop',
        points: 72000,
        originalPrice: 18999.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Teclado Apple Magic Keyboard',
        category: 'Accesorios',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&h=150&fit=crop',
        points: 15000,
        originalPrice: 3499.99,
        quantity: 1
      }
    ],
    totalPoints: 87000,
    totalAmount: 22499.98,
    date: '2024-01-14',
    expectedDelivery: '2024-01-19',
    actualDelivery: null,
    status: 'en camino',
    deliveryDate: '2024-01-19',
    address: 'Departamento de Contabilidad',
    deliveryNotes: 'Firmar en recepción',
    progress: 85,
    color: '#2196f3',
    trackingNumber: 'TRK258369147',
    carrier: 'Estafeta',
    currentLocation: 'En tránsito',
    eta: '1-2 días hábiles'
  },
  {
    id: '#ORD-006',
    orderNumber: 'ORD20240115003',
    nomina: 'NOM-789012',
    customerName: 'Jorge Hernández',
    customerEmail: 'jorge.hernandez@empresa.com',
    customerAvatar: 'JH',
    department: 'Operaciones',
    items: [
      {
        id: 1,
        name: 'Kit de Herramientas Profesionales',
        category: 'Herramientas',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop',
        points: 28000,
        originalPrice: 4599.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Organizador de Herramientas',
        category: 'Organización',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150&h=150&fit=crop',
        points: 12000,
        originalPrice: 1999.99,
        quantity: 1
      }
    ],
    totalPoints: 40000,
    totalAmount: 6599.98,
    date: '2024-01-15',
    expectedDelivery: '2024-01-26',
    actualDelivery: null,
    status: 'pendiente',
    deliveryDate: '2024-01-26',
    address: 'Almacén Principal',
    deliveryNotes: 'Producto en espera de stock',
    progress: 20,
    color: '#ff9800',
    trackingNumber: 'TRK369147258',
    carrier: 'UPS',
    currentLocation: 'Procesando',
    preparationTime: '7-10 días hábiles'
  }
];

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
}));

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
}));

// Componente para el estado
const StatusChip = ({ status }) => {
  const statusConfig = {
    entregado: {
      label: 'Entregado',
      color: '#4caf50',
      icon: <CheckCircle fontSize="small" />,
      bgColor: '#4caf5015'
    },
    'en camino': {
      label: 'En Camino',
      color: '#2196f3',
      icon: <LocalShipping fontSize="small" />,
      bgColor: '#2196f315'
    },
    pendiente: {
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
};

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
);

function Orders() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nomina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'todos' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Expandir/Contraer detalles
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
                  const statusMap = ['todos', 'pendiente', 'en camino', 'entregado'];
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
              
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 2 }}
              >
                Filtros
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Contador de resultados */}
      <Typography component="div" variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
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
                            {order.orderNumber}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Pedido: {order.date} • Entrega: {order.expectedDelivery}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <StatusChip status={order.status} />
                          <IconButton 
                            size="small" 
                            onClick={() => toggleExpand(order.id)}
                            sx={{ 
                              transform: expandedOrder === order.id ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.3s'
                            }}
                          >
                            {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Información del empleado - CORREGIDO */}
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {order.customerAvatar}
                          </Avatar>
                          <Box>
                            <Typography component="div" variant="subtitle2" fontWeight="bold">
                              {order.customerName}
                            </Typography>
                            <Typography component="div" variant="caption" color="text.secondary">
                              {order.department}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Work fontSize="small" sx={{ color: 'text.secondary' }} />
                          <Typography component="span" variant="body2">
                            Nómina: <strong>{order.nomina}</strong>
                          </Typography>
                        </Box>
                        <Typography component="div" variant="caption" color="text.secondary">
                          {order.customerEmail}
                        </Typography>
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
                              key={item.id}
                              sx={{ 
                                px: 0,
                                '&:not(:last-child)': { mb: 1 }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar 
                                  src={item.image}
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
                                    {item.name}
                                  </Typography>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Typography component="div" variant="caption" display="block">
                                      {item.category}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                      <PointsDisplay points={item.points} />
                                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        (${item.originalPrice.toFixed(2)})
                                      </Typography>
                                    </Box>
                                  </React.Fragment>
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
                            {order.totalPoints.toLocaleString()}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            pts
                          </Typography>
                        </Box>
                        
                        <Typography component="div" variant="caption" color="text.secondary" display="block" gutterBottom>
                          Valor: ${order.totalAmount.toFixed(2)}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Barra de progreso - CORREGIDO */}
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography component="span" variant="caption" fontWeight="medium">
                            Progreso de entrega
                          </Typography>
                          <Typography component="span" variant="caption" fontWeight="bold" color={order.color}>
                            {order.progress}%
                          </Typography>
                        </Box>
                        <ProgressBar 
                          variant="determinate" 
                          value={order.progress}
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
                            {order.status === 'pendiente' ? 'En preparación' : 
                             order.status === 'en camino' ? order.currentLocation : 
                             'Entregado'}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {order.carrier} • {order.trackingNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Detalles expandidos */}
                    <Grid item xs={12}>
                      <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography component="div" variant="subtitle2" fontWeight="bold" gutterBottom>
                                Información de Entrega
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                  <Work fontSize="small" />
                                  <Typography component="span" variant="body2">
                                    <strong>Nómina:</strong> {order.nomina}
                                  </Typography>
                                </Box>
                                <Typography component="div" variant="body2" color="text.secondary">
                                  <strong>Dirección:</strong> {order.address}
                                </Typography>
                                <Typography component="div" variant="body2" color="text.secondary">
                                  <strong>Transportista:</strong> {order.carrier}
                                </Typography>
                                <Typography component="div" variant="body2" color="text.secondary">
                                  <strong>Número de rastreo:</strong> {order.trackingNumber}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography component="div" variant="subtitle2" fontWeight="bold" gutterBottom>
                                Notas de entrega
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Typography component="div" variant="body2" color="text.secondary">
                                  {order.deliveryNotes}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
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
          Sistema de Puntos por Nómina • Todos los pedidos son canjeados con puntos acumulados
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary">
          Para asistencia, contacta al departamento de Recursos Humanos • Última actualización: {new Date().toLocaleDateString('es-ES')}
        </Typography>
      </Box>
    </Box>
  );
}

export default Orders