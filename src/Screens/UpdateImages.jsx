import { useState, useEffect } from 'react'
import { 
  Add, 
  Delete, 
  Image as ImageIcon, 
  Category, 
  Description, 
  Star,
  Close,
  CloudUpload
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Alert,
  Snackbar,
  Grid,
  Paper,
  InputAdornment,
  Tooltip
} from '@mui/material'
import Swal from 'sweetalert2'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await resp.json()
  return json
}

function UpdateImages() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  
  const [newImage, setNewImage] = useState({
    file: null,
    preview: null,
    name: '',
    description: '',
    points: '',
    category: ''
  })

  const categories = [
    'Premios Especiales',
    'Reconocimientos',
    'Incentivos',
    'Logros',
    'Otros'
  ]

  const fetchImages = async () => {
    setLoading(true)
    const data = { aksi: "GetImages" }
    try {
      const response = await enviarData(url, data)
      if (response.estado === 'success') {
        setImages(response.data || [])
      } else {
        setSnackbar({
          open: true,
          message: 'Error al cargar las imágenes',
          severity: 'error'
        })
        console.error("Error fetching images:", response.message)
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error de conexión',
        severity: 'error'
      })
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true
    })

    if (result.isConfirmed) {
      const data = { aksi: "DeleteImage", id }
      try {
        const response = await enviarData(url, data)
        if (response.estado === 'success') {
          setImages(images.filter(img => img.id !== id))
          setSnackbar({
            open: true,
            message: 'Imagen eliminada exitosamente',
            severity: 'success'
          })
        } else {
          setSnackbar({
            open: true,
            message: response.mensaje || 'Error al eliminar',
            severity: 'error'
          })
        }
      } catch (error) {
        console.error("Error deleting image:", error)
        setSnackbar({
          open: true,
          message: 'Error de conexión',
          severity: 'error'
        })
      }
    }
  }

  const handleAddImage = async () => {
    if (!newImage.file) {
      setSnackbar({
        open: true,
        message: 'Selecciona una imagen',
        severity: 'warning'
      })
      return
    }

    if (!newImage.name.trim() || !newImage.description.trim() || 
        !newImage.points.trim() || !newImage.category.trim()) {
      setSnackbar({
        open: true,
        message: 'Todos los campos son obligatorios',
        severity: 'warning'
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('aksi', 'AddImage')
    formData.append('file', newImage.file)
    formData.append('name', newImage.name.trim())
    formData.append('description', newImage.description.trim())
    formData.append('points', newImage.points.trim())
    formData.append('category', newImage.category.trim())

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      
      if (result.estado === 'success') {
        setSnackbar({
          open: true,
          message: 'Imagen agregada exitosamente',
          severity: 'success'
        })
        fetchImages()
        resetForm()
        setModalOpen(false)
      } else {
        setSnackbar({
          open: true,
          message: result.mensaje || 'Error al agregar',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error("Error adding image:", error)
      setSnackbar({
        open: true,
        message: 'Error de conexión',
        severity: 'error'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Solo se permiten archivos de imagen',
          severity: 'warning'
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'La imagen no debe exceder 5MB',
          severity: 'warning'
        })
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setNewImage(prev => ({
        ...prev,
        file,
        preview: previewUrl
      }))
    }
  }

  const resetForm = () => {
    if (newImage.preview) {
      URL.revokeObjectURL(newImage.preview)
    }
    setNewImage({
      file: null,
      preview: null,
      name: '',
      description: '',
      points: '',
      category: ''
    })
  }

  const handleCloseModal = () => {
    resetForm()
    setModalOpen(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'premios especiales':
        return 'primary'
      case 'reconocimientos':
        return 'success'
      case 'incentivos':
        return 'warning'
      case 'logros':
        return 'info'
      default:
        return 'default'
    }
  }

  const formatFileName = (filename) => {
    if (!filename) return 'Sin nombre'
    return filename.length > 20 ? filename.substring(0, 20) + '...' : filename
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{
          mb: 6,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          mb: 1,
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          🏆 Gestión de Premios
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Administra las imágenes de premios disponibles en el catálogo
        </Typography>
      </Paper>

      {/* Stats */}
      {!loading && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Paper sx={{ 
            p: 2, 
            minWidth: 120, 
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: '#e3f2fd'
          }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              {images.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              Total Premios
            </Typography>
          </Paper>
          <Paper sx={{ 
            p: 2, 
            minWidth: 120, 
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: '#f3e5f5'
          }}>
            <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
              {new Set(images.map(img => img.categoria)).size}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7b1fa2' }}>
              Categorías
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 400,
          gap: 3
        }}>
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: '#667eea' }}
          />
          <Typography variant="h6" color="text.secondary">
            Cargando catálogo de premios...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Images Grid */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {images.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 8, 
                  textAlign: 'center', 
                  borderRadius: 4,
                  bgcolor: 'background.paper'
                }}>
                  <ImageIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay premios registrados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comienza agregando el primer premio al catálogo
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              images.map((img) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={img.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={`kyspoints/assets/images/${img.image}`}
                        alt={img.nombre}
                        className="rounded-xl h-24 object-cover"
                      />
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8 
                      }}>
                        <Chip
                          label={`${img.puntos} pts`}
                          size="small"
                          sx={{ 
                            bgcolor: '#ff9800',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {img.nombre}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {img.descripcion}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          icon={<Category sx={{ fontSize: 14 }} />}
                          label={img.categoria}
                          size="small"
                          color={getCategoryColor(img.categoria)}
                          variant="outlined"
                        />
                        <Tooltip title="Eliminar premio">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(img.id, img.nombre)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { bgcolor: '#ffebee' }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Add Button */}
          <Tooltip title="Agregar nuevo premio" arrow>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setModalOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                borderRadius: '50%',
                width: 64,
                height: 64,
                minWidth: 0,
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4290 100%)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s',
                zIndex: 1000
              }}
            />
          </Tooltip>
        </>
      )}

      {/* Add Image Dialog */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload /> Agregar Nuevo Premio
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Image Preview */}
            {newImage.preview && (
              <Box sx={{ textAlign: 'center' }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 3,
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <img
                    src={newImage.preview}
                    alt="Vista previa"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 8 
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {formatFileName(newImage.file?.name)}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* File Input */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageIcon />}
              fullWidth
              sx={{ 
                py: 2,
                borderRadius: 3,
                borderStyle: 'dashed',
                borderWidth: 2
              }}
            >
              {newImage.file ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {/* Form Fields */}
            <TextField
              label="Nombre del Premio"
              fullWidth
              value={newImage.name}
              onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Star sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Puntos requeridos"
              type="number"
              fullWidth
              value={newImage.points}
              onChange={(e) => setNewImage({ ...newImage, points: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">🏆</Typography>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              select
              label="Categoría"
              fullWidth
              value={newImage.category}
              onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
              SelectProps={{
                native: true
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }}
            >
              <option value=""></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseModal}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddImage}
            variant="contained"
            disabled={uploading}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Agregando...
              </>
            ) : 'Agregar Premio'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UpdateImages