import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Screens/Login"
import Panel from "./Screens/personalPanel"
import Index from "./Screens/Index"
import Questions from "./components/Questions"
import ManagerPanel from "./Screens/managerPanel"

const App = () => { 
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/personal" element={<Panel />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/manager" element={<ManagerPanel />} />
      </Routes>
    </BrowserRouter>
  )
 }

export default App