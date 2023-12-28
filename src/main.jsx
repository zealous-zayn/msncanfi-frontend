import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { Home } from './pages/Home.jsx';
import { AuthProvider } from './utilities/Auth.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
)
