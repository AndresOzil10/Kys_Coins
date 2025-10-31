import React, { useState, useRef, useEffect } from 'react'

const ShoppStore = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Agenda', price: 20, image: '/assets/images/agenda.jpg', description: 'Agenda.' },
    { id: 2, name: 'Alexa Echo Dot', price: 50, image: '/assets/images/alexa.jpg', description: 'Bocina Inteligente Echo Dot 5 Wifi Bluetooth tipo esfera Negro' },
    { id: 3, name: 'Asador', price: 120, image: '/assets/images/asador.webp', description: 'Asador de Carbón Avera Tipo Barril 70cm Acb02/Acero Inoxidable' },
    { id: 4, name: 'Audifonos', price: 100, image: '/assets/images/audifonos.webp', description: 'Audifonos Inalálambricos JBL Harman Live Flex3' },
    { id: 5, name: 'Teléfono', price: 110, image: '/assets/images/celular.webp', description: 'Moto G54 %G DualSim 256GB Glacier Blue 8GB RAM Liberado Motorola.' },
    { id: 6, name: 'Alexa PRO', price: 70, image: '/assets/images/echoDot.jpeg', description: 'Asistente Alexa ECHO Dot 4° Generacion con reloj led azul.' },
    { id: 7, name: 'Kit de herramientas', price: 90, image: '/assets/images/herramientas.jpg', description: 'Realtek Kit de Herramientas mecánicas de 100 pzs.' },
    { id: 8, name: 'Laptop HP', price: 130, image: '/assets/images/laptop.webp', description: 'Laptop HP 15-FC0001LA AMD Ryzen3 8GB RAM 512GB SSD.' },
    { id: 9, name: 'Mochila Camping', price: 50, image: '/assets/images/mochila.jpg', description: 'Mochila táctica militar para Camping Negro.' },
    { id: 10, name: 'Mochila', price: 40, image: '/assets/images/mochilaLap.jpg', description: 'Mochila Lenovo B210 para Laptop de hasta 15.6´´.' },
    { id: 11, name: 'Pantalla 55´´', price: 150, image: '/assets/images/pantalla.webp', description: 'TV Samsung 55 pulgadas 4K Ultra HD SMART TV Led.' },
    { id: 12, name: 'Paraguas', price: 30, image: '/assets/images/paraguas.webp', description: 'Paraguas.' },
    { id: 13, name: 'Refrigerdor.', price: 130, image: '/assets/images/refrigerador.webp', description: 'Refrigerador Semiautomático ATVI 6.6 pies con despachador Color Silver.' },
    { id: 14, name: 'Reloj Inteligente.', price: 60, image: '/assets/images/smartwatch.webp', description: 'Reloj inteligente Smartwatch Bluetooth llamada Negro Bloosom.' },
    { id: 15, name: 'Barra de sonido.', price: 180, image: '/assets/images/sonido.jpg', description: 'Samsung-HW-Q800a Barra de Sonido de 3.1.2 Canales con Dolby Atmos.' },
    { id: 16, name: 'Soporte para telefono.', price: 10, image: '/assets/images/soporte.webp', description: 'Soporte de telefono retrovisor.' },
    { id: 17, name: 'Tablet.', price: 100, image: '/assets/images/tablet.jpg', description: 'Tablet Samsung Tab A9 + 4GB RAM 64GB Silver.' },
    { id: 18, name: 'Termo.', price: 30, image: '/assets/images/termo.webp', description: 'Termo de Acero Inoxidable Vercort Abre Facil 500ml.' },
    { id: 19, name: 'Kit de toppers.', price: 60, image: '/assets/images/tuppers.webp', description: 'Juego de 12 contenedores Topper de vidrio con 12 tapas herméticas antiderrames Styrka.' },
    { id: 20, name: 'Tarjeta de regalo Pluxee.', price: 50, image: '/assets/images/tarjeta_regalo.webp', description: 'Tarjeta de regalo con monto equivalente a $800 MX' },
    { id: 21, name: 'Hospedaje para viaje.', price: 150, image: '/assets/images/Hospedaje.png', description: 'Hospedaje para viajes (Monto Maximo $8000 MXN)' },
    { id: 22, name: 'Boletos para el estadio.', price: 60, image: '/assets/images/boletos.png', description: 'Dos Boletos para el Estadio.' },
  ])

  const [cart, setCart] = useState([]) // Estado para el carrito
  const [isCartOpen, setIsCartOpen] = useState(false) // Estado para el modal del carrito (opcional, si quieres mantener el modal)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false) // Estado para el tooltip del carrito
  const [loadedImages, setLoadedImages] = useState(new Set()) // Estado para rastrear imágenes cargadas
  const [searchTerm, setSearchTerm] = useState('') // Estado para el término de búsqueda
  const [sortOrder, setSortOrder] = useState('')
  const tooltipRef = useRef(null) // Ref para el tooltip

  // Agregar al carrito
  const addToCart = (item) => {
    setCart([...cart, item]);
  }

  // Eliminar del carrito
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  }

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  }

  // Función para manejar carga de imagen
  const handleImageLoad = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId]));
  }

  // Función para manejar error de imagen (tratar como cargada para evitar bloqueo)
  const handleImageError = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId]));
  }

  // Función para abrir el tooltip
  const openTooltip = () => {
    setIsTooltipOpen(true);
  }

  // Función para cerrar el tooltip
  const closeTooltip = () => {
    setIsTooltipOpen(false);
  }

  // useEffect para detectar clics fuera del tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        closeTooltip();
      }
    };

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipOpen]);

  // Filtrar items basados en el término de búsqueda
  const filteredAndSortedItems = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else if (sortOrder === 'desc') {
        return b.price - a.price;
      }
      return 0; // Sin orden
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative mb-12"> {/* Relative para posicionar el botón flotante */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tienda Kayser Points</h1>
        <p className="text-gray-600">Elige y compra artículos con tus puntos</p>
         {/* Buscador y Filtro */}
        <div className="mt-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered ml-4"
          >
            <option value="">Sin orden</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
              </header>

              {/* Pre-cargar imágenes ocultas para rastrear carga */}
      <div style={{ display: 'none' }}>
        {items.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.name}
            onLoad={() => handleImageLoad(item.id)}
            onError={() => handleImageError(item.id)}
          />
        ))}
      </div>

      {/* Mostrar loading si no todas las imágenes están cargadas */}
      {loadedImages.size === items.length ? (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredAndSortedItems.map((item) => (
            <div key={item.id} className="card shadow-md hover:shadow-lg transition-shadow">
              <figure>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-max object-cover rounded-t-lg"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-md font-bold mt-2">{item.price} pts.</p>
                <button 
                  className="btn btn-primary mt-2 w-full"
                  onClick={() => addToCart(item)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Contenedor para el botón y tooltip */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="btn btn-primary btn-circle"
          onMouseEnter={openTooltip} // Abre el tooltip al pasar el cursor
          onClick={toggleCart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && <span className="badge badge-secondary badge-xs absolute top-[-10px] right-[-5px]">{cart.length}</span>}
        </button>

        {/* Tooltip del carrito */}
        {isTooltipOpen && cart.length > 0 && (
          <div ref={tooltipRef} className="absolute bottom-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-64 overflow-y-auto">
            <h3 className="font-bold text-lg mb-2">Carrito</h3>
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center space-x-2">
                  <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                  <span className="text-sm">{item.name} - {item.price} pts.</span>
                  <button 
                    className="btn btn-error btn-xs ml-auto"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total: {total} pts.</p>
            <button 
              className="btn btn-success btn-sm mt-2 w-full"
              onClick={() => alert('Procesando compra...')} // Simulación
            >
              Comprar
            </button>
            <button 
              className="btn btn-ghost btn-sm mt-2 w-full"
              onClick={closeTooltip} // Cierra el tooltip
            >
              Cerrar
            </button>
          </div>
        )}
        {isTooltipOpen && cart.length === 0 && (
          <div ref={tooltipRef} className="absolute bottom-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-40">
            <p className="text-sm">No hay productos en el carrito.</p>
            <button 
              className="btn btn-ghost btn-sm mt-2 w-full"
              onClick={closeTooltip} // Cierra el tooltip
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Modal para carrito (opcional, si quieres mantenerlo para clic) */}
      {isCartOpen && (
        <div className="fixed inset-0 flex bg-black  items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Carrito</h2>
              <ul className="menu">
                {cart.map((item) => (
                  <li key={item.id}>
                    <div className="flex justify-between items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <span>{item.name} - {item.price} pts.</span>
                      <button 
                        className="btn btn-error btn-xs"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-bold">Total: {total} pts.</p>
              <button 
                className="btn btn-success mt-2 w-full"
                onClick={() => alert('Procesando compra...')} // Simulación
              >
                Comprar
              </button>
              <button 
                className="btn btn-ghost mt-2"
                onClick={toggleCart} // Cierra el modal
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppStore
