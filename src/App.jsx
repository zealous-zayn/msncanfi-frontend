import './App.css';
import { Navigate, Outlet} from 'react-router-dom';
import { Login } from './pages/Login';

function App() {

  return (
    <>
      <Navigate to="/login" />
      <Outlet/>
    </>
  )
}

export default App
