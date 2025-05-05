import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import HomePage from './pages/HomePage.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Dashboard from './pages/Dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/homepage",
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: "browse-vehicles",
            element: <Vehicles />
          }
        ]
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
