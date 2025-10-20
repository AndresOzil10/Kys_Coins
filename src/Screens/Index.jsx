import { useNavigate } from "react-router-dom"
import logo from "../assets/images/kayser_logo.webp"
import Carousel from "../components/Carousel"
import PageFooter from "../components/PageFooter"

function Index() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleQuestions = () => {
    navigate("/questions")
  }

  return (
    <>
      <div className="hero min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Logo */}
        <header className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
          <img
            src={logo}
            alt="Logo de Kayser Automotive Systems"
            className="w-40 md:w-48 lg:w-56 h-auto"
          />
        </header>

        <div className="hero-overlay bg-white/20"></div>

        <main className="hero-content flex flex-col justify-between max-w-4xl w-full px-6 py-12 mx-auto text-center gap-10 md:gap-16">
          {/* Texto principal */}
          <section className="max-w-md mx-auto space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              ¿Tienes una idea? <br />
              <span className="italic font-semibold">¡Compártela, mejoremos juntos!</span>
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700 italic">
              Tú conoces el proceso, tú puedes mejorarlo.
            </h2>
          </section>

          {/* Carrusel */}
          <section className="mx-auto w-full max-w-md">
            <Carousel />
          </section>

          {/* Botones */}
          <section className="flex flex-col gap-4 max-w-md mx-auto w-full">
            <button
              onClick={handleLoginClick}
              className="btn btn-primary btn-block btn-lg shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Iniciar sesión en Kayser Coins"
              type="button"
            >
              Iniciar sesión
            </button>

            <button
              onClick={handleQuestions}
              className="btn bg-white text-black border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              aria-label="Preguntas frecuentes"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
              </svg>
              FAQ's
            </button>
          </section>

          {/* Footer text */}
          <footer className="pt-6 border-t border-gray-200 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800">
              One World. One Family. One KAYSER.
            </h3>
          </footer>
        </main>
      </div>

      <PageFooter />
    </>
  );
}

export default Index