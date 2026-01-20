import React, { useState, useRef, useEffect } from 'react'
import TablePay from '../components/Personal/TablePay';
import { useLocation } from 'react-router-dom';
import {Card,CardContent,CardMedia,Typography,Button,IconButton,Badge,Chip,TextField,MenuItem,Select,
  InputAdornment,Box,CircularProgress,Alert,Grid,Slide,Dialog,DialogContent,DialogTitle,
  DialogActions,Tooltip,Avatar,List,ListItem,ListItemAvatar,ListItemText,Divider
} from '@mui/material';
import {ShoppingCart as CartIcon,Search as SearchIcon, Add as AddIcon, Remove as RemoveIcon, 
  Delete as DeleteIcon,Close as CloseIcon,ArrowBack as ArrowBackIcon, LocalMall as StoreIcon, 
  Star as StarIcon, Category as CategoryIcon,CurrencyExchange as PointsIcon, Verified as VerifiedIcon,
  AddShoppingCart as AddCartIcon, ShoppingBag as BagIcon, Redeem as GiftIcon 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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

const ShoppStore = () => {
  const location = useLocation()
  const { nomina } = location.state || {}

  const [cart, setCart] = useState([])
  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const tooltipRef = useRef(null)
  const [ModalPay, setModalPay] = useState(false)

  const setDataItems = async () => {
    setLoading(true)
    setError(null)
    const dataToSend = {
      aksi: "GetImagesStore",
    }
    try {
      const data = await enviarData(url, dataToSend);
      const itemsData = data.data || []
      setItems(itemsData)
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(itemsData.map(item => item.categoria || 'General'))]
      setCategories(['all', ...uniqueCategories])
    } catch (error) {
      console.error('Error fetching items:', error)
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  // Agregar al carrito con cantidad
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  // Eliminar del carrito
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  // Actualizar cantidad en carrito
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.puntos * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const toggleModalPay = () => {
    setIsCartOpen(false)
    setModalPay(!ModalPay)
  }

  // const handleImageLoad = (itemId) => {
  //   setLoadedImages(prev => new Set([...prev, itemId]))
  // }

  // const handleImageError = (itemId) => {
  //   setLoadedImages(prev => new Set([...prev, itemId]))
  // }

  const openTooltip = () => {
    setIsTooltipOpen(true)
  }

  const closeTooltip = () => {
    setIsTooltipOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        closeTooltip()
      }
    }

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTooltipOpen])

  useEffect(() => {
    setDataItems()
  }, [])

  // Filtrar y ordenar items
  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || 
        item.categoria === filterCategory || 
        (filterCategory === 'General' && !item.categoria)
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.puntos - b.puntos
      } else if (sortOrder === 'desc') {
        return b.puntos - a.puntos
      } else if (sortOrder === 'popular') {
        return (b.popularidad || 0) - (a.popularidad || 0)
      }
      return 0
    })

  const getCategoryColor = (category) => {
    const colors = {
      'Hogar': '#10B981',
      'Otros': '#8B5CF6',
      'General': '#6B7280',
      'Tecnologia': '#050505',
      'Telefonia': '#F59E0B',
      'Herramientas': '#EF4444'
    }
    return colors[category] || '#6B7280'
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)',
      p: { xs: 2, md: 4 }
    }}>
      {/* Header Mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
          borderRadius: 4,
          mb: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}>
                <StoreIcon sx={{ fontSize: 48, mr: 2, color: '#fbbf24' }} />
                <Typography variant="h3" sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Tienda Kayser Points
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Transforma tus puntos en experiencias inolvidables
              </Typography>

              {/* Buscador y Filtros */}
              <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.5)'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    displayEmpty
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '& .MuiSelect-icon': {
                        color: 'white'
                      }
                    }}
                  >
                    <MenuItem value="">Sin orden</MenuItem>
                    <MenuItem value="asc">Menor precio</MenuItem>
                    <MenuItem value="desc">Mayor precio</MenuItem>
                  </Select>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '& .MuiSelect-icon': {
                        color: 'white'
                      }
                    }}
                  >
                    <MenuItem value="all">Todas las categorías</MenuItem>
                    {categories.filter(c => c !== 'all').map(category => (
                      <MenuItem key={category} value={category}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon sx={{ fontSize: 16, color: getCategoryColor(category) }} />
                          {category}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              borderRadius: 3,
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productos
                </Typography>
                <Typography variant="h3">
                  {items.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              borderRadius: 3,
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  En tu carrito
                </Typography>
                <Typography variant="h3">
                  {itemCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: 3,
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Puntos totales
                </Typography>
                <Typography variant="h3">
                  {total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: 3,
              color: 'white'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Categorías
                </Typography>
                <Typography variant="h3">
                  {categories.length - 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Productos */}
      <Box sx={{ mb: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <AnimatePresence>
            <Grid container spacing={3}>
              {filteredAndSortedItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-8px)'
                      }
                    }}>
                      {/* Imagen del producto */}
                      <Box sx={{ position: 'relative', height: 200 }}>
                        <CardMedia
                          component="img"
                          image={`kyspoints/assets/images/${item.image}`}
                          alt={item.nombre}
                          sx={{
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        
                        {/* Badge de categoría */}
                        <Chip
                          label={item.categoria || 'General'}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: getCategoryColor(item.categoria || 'General'),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        
                        {/* Overlay de acción */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<AddCartIcon />}
                            onClick={() => addToCart(item)}
                            sx={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }}
                          >
                            Agregar
                          </Button>
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {item.nombre}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                          {item.descripcion}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PointsIcon sx={{ color: '#f59e0b' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                              {item.puntos}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              pts
                            </Typography>
                          </Box>
                          
                          <Chip
                            icon={<StarIcon sx={{ fontSize: 16 }} />}
                            label={item.popularidad || 'Nuevo'}
                            size="small"
                            color="warning"
                          />
                        </Box>
                      </CardContent>
                      
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<AddCartIcon />}
                          onClick={() => addToCart(item)}
                          sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }
                          }}
                        >
                          Agregar al carrito
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
        
        {filteredAndSortedItems.length === 0 && !loading && (
          <Card sx={{ textAlign: 'center', p: 6, borderRadius: 3 }}>
            <BagIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No se encontraron productos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prueba con otros términos de búsqueda o categorías
            </Typography>
          </Card>
        )}
      </Box>

      {/* Botón del carrito flotante */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
      >
        <Tooltip title="Ver carrito" arrow>
          <IconButton
            onMouseEnter={openTooltip}
            onClick={toggleCart}
            sx={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Badge badgeContent={itemCount} color="error" max={99}>
              <CartIcon sx={{ fontSize: 28 }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </motion.div>

      {/* Tooltip del carrito */}
      {isTooltipOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          ref={tooltipRef}
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 999
          }}
        >
          <Card sx={{
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CartIcon />
                  Carrito
                </Typography>
                <IconButton size="small" onClick={closeTooltip}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {cart.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CartIcon sx={{ fontSize: 60, color: '#9ca3af', mb: 2 }} />
                  <Typography color="text.secondary">
                    Tu carrito está vacío
                  </Typography>
                </Box>
              ) : (
                <>
                  <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                    {cart.map((item) => (
                      <React.Fragment key={item.id}>
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={`kyspoints/assets/images/${item.image}`}
                              alt={item.nombre}
                              variant="rounded"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box component="div" sx={{ fontWeight: 'medium' }}>
                                {item.nombre}
                              </Box>
                            }
                            secondary={
                              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <Box component="span" sx={{ 
                                  color: 'primary.main', 
                                  fontSize: '0.875rem', 
                                  fontWeight: 500 
                                }}>
                                  {item.puntos} pts × {item.quantity}
                                </Box>
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    sx={{ p: 0.5 }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Box component="span" sx={{ 
                                    fontSize: '0.875rem',
                                    minWidth: '20px',
                                    textAlign: 'center'
                                  }}>
                                    {item.quantity}
                                  </Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    sx={{ p: 0.5 }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {total} pts
                      </Typography>
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VerifiedIcon />}
                      onClick={toggleModalPay}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                        }
                      }}
                    >
                      Proceder al pago
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modal del carrito */}
      <Dialog
        open={isCartOpen}
        onClose={toggleCart}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CartIcon />
            <Typography variant="h6">Carrito de compras</Typography>
            <Chip label={itemCount} size="small" color="error" />
          </Box>
          <IconButton onClick={toggleCart} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CartIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Tu carrito está vacío
              </Typography>
              <Typography color="text.secondary" paragraph>
                Agrega productos para comenzar
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={toggleCart}
              >
                Continuar comprando
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <List>
                {cart.map((item) => (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                          <Avatar
                            src={`kyspoints/assets/images/${item.image}`}
                            alt={item.nombre}
                            sx={{ width: 60, height: 60 }}
                            variant="rounded"
                          />
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.descripcion}
                          </Typography>
                          <Typography variant="body1" color="primary" fontWeight="bold">
                            {item.puntos} pts cada uno
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <RemoveIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={2}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {item.puntos * item.quantity} pts
                            </Typography>
                            <IconButton size="small" onClick={() => removeFromCart(item.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </List>
              
              <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total del carrito</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {total} pts
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        
        {cart.length > 0 && (
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={toggleCart}
              startIcon={<ArrowBackIcon />}
            >
              Seguir comprando
            </Button>
            <Button
              variant="contained"
              onClick={toggleModalPay}
              startIcon={<VerifiedIcon />}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }
              }}
            >
              Proceder al pago ({total} pts)
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Modal de pago */}
      {ModalPay && (
        <TablePay toggleModalPay={toggleModalPay} nomina={nomina} total={total} />
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 3,
          mt: 4,
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <GiftIcon sx={{ mr: 1, color: '#fbbf24' }} />
              <Typography variant="h6">
                Kayser Points Store
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              © {new Date().getFullYear()} Kayser Points. Todos los derechos reservados.
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Transforma tu esfuerzo en recompensas
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default ShoppStore