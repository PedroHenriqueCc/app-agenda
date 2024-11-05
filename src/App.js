import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from './hooks/GlobalContext'; // Importe o GlobalProvider
import Home from './components/Home';
import Header from './components/Header';
import Editor from './components/Editor';
import ViewNote from './components/ViewNote';
import Itens from './components/Itens';
import Funcionarios from './components/Funcionarios';

export default function App() {
  return (
    <div className='app'>
      <GlobalProvider> {/* Envolva a árvore de componentes com GlobalProvider */}
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/editor' element={<Editor />} />
            <Route path="/view/:id" element={<ViewNote />} />
            <Route path='/itens' element={<Itens />} />
            <Route path='/funcionarios' element={<Funcionarios />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </div>
  );
}
