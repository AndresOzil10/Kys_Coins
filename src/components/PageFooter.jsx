import logo from "../assets/images/kayser_logo.webp";

function PageFooter() {
  return (
    <footer className="footer footer-center bg-base-100 text-base-content p-6 border-t border-gray-200">
        <aside className="grid grid-flow-col gap-4">
          <img 
            src={logo} 
            className="w-12 h-auto" 
            alt="Logo Kayser" 
          />
          <p className="text-sm">
            Copyright © {new Date().getFullYear()} - All rights reserved by <br />
            <span className="font-semibold">Kayser Automotive Systems</span>
          </p>
        </aside>
      </footer>
  )
}

export default PageFooter