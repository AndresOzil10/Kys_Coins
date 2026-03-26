import { useEffect, useState } from 'react'

import regalo from '../assets/images/tarjeta_regalo.png'
import refri from '../assets/images/refrigerador.jpeg'
import celular from '../assets/images/celular.jpg'
import audifonos from '../assets/images/audifonos.jpg'
import smartwatch from '../assets/images/smartwatch.png'
import herramienta from '../assets/images/herramientas.jpg'
import echoDot from '../assets/images/echoDot.jpeg'
import tuppers from '../assets/images/tuppers.jpeg'
import soporte from '../assets/images/soporte.jpg'
import alexa from '../assets/images/alexa.jpg'
import agenda from '../assets/images/agenda.jpg'
import mochila from '../assets/images/mochila.jpg'
import asador from '../assets/images/asador.jpg'
import paraguas from '../assets/images/paraguas.jpg'
import mochilaLap from '../assets/images/mochilaLap.jpg'
import termo from '../assets/images/termo.jpg'
import tablet from '../assets/images/tablet.jpg'
import sonido from '../assets/images/sonido.jpg'
import laptop from '../assets/images/laptop.jpg'
import pantalla from '../assets/images/pantalla.jpg'

const images = [
  { src: regalo, alt: 'Tarjeta de regalo' },
  { src: refri, alt: 'Refrigerador' },
  { src: celular, alt: 'Celular' },
  { src: audifonos, alt: 'Audífonos' },
  { src: smartwatch, alt: 'Smartwatch' },
  { src: herramienta, alt: 'Herramientas' },
  { src: echoDot, alt: 'Echo Dot' },
  { src: tuppers, alt: 'Tuppers' },
  { src: soporte, alt: 'Soporte' },
  { src: alexa, alt: 'Alexa' },
  { src: agenda, alt: 'Agenda' },
  { src: mochila, alt: 'Mochila' },
  { src: asador, alt: 'Asador' },
  { src: paraguas, alt: 'Paraguas' },
  { src: mochilaLap, alt: 'Mochila para laptop' },
  { src: termo, alt: 'Termo' },
  { src: tablet, alt: 'Tablet' },
  { src: sonido, alt: 'Equipo de sonido' },
  { src: laptop, alt: 'Laptop' },
  { src: pantalla, alt: 'Pantalla' },
]

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="carousel rounded-box w-64 shadow-lg">
      <div className="carousel-item w-full">
        <img
          src={images[currentIndex].src}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default Carousel