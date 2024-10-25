import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Editor from './components/Editor';
import ViewNote from './components/ViewNote';
import Itens from './components/Itens';
import Funcionarios from './components/Funcionarios';  

export default function App() {
  return (
    <div className='app'>
      <Router>
        <Header /> {/* Mova o Header para fora das rotas, se ele for o mesmo em todas as páginas */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/editor' element={<Editor />} />
          <Route path="/view/:id" element={<ViewNote />} />
          <Route path='/itens' element={<Itens />} /> 
          <Route path='/funcionarios' element={<Funcionarios />} /> {/* Adicionada a rota para Funcionários */}
        </Routes>
      </Router>
    </div>
  )
}
