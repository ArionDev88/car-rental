import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import HomePage from './pages/HomePage.jsx'
import VehicleMarketplace from './pages/VehicleMarketplace.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AllReservations from './pages/AllReservations.jsx'
import CarCreation from './pages/CarCreation.jsx'
import Branches from './pages/Branches.jsx'
import MyReservations from './pages/MyReservations.jsx'
import MyProfile from './pages/MyProfile.jsx'
import PastReservations from './pages/PastReservations.jsx'
import FutureReservations from './pages/FutureReservations.jsx'
import ActiveReservation from './pages/ActiveReservation.jsx'
import Revenues from './pages/Revenues.jsx'
import Expenses from './pages/Expenses.jsx'
import Clients from './pages/Clients.jsx'
import Managers from './pages/Managers.jsx'

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
            element: <Dashboard />, 
            loader: Dashboard.loader
          },
          {
            path: "browse-vehicles",
            element: <VehicleMarketplace />
          },
          {
            path: "all-reservations",
            element: <AllReservations />,
            // loader: AllReservations.loader
          },
          {
            path: "create-car",
            element: <CarCreation />,
          },
          {
            path: "branches",
            element: <Branches />,
          },
          {
            path: "my-reservations",
            element: <MyReservations />,
          },
          {
            path: "my-profile",
            element: <MyProfile />,
          },
          {
            path: "past-reservations",
            element: <PastReservations />,
          },
          {
            path: "future-reservations",
            element: <FutureReservations />,
          },
          {
            path: "active-reservations",
            element: <ActiveReservation />
          },
          {
            path: 'revenues',
            element: <Revenues />,
          },
          {
            path: 'expenses',
            element: <Expenses />,
          },
          {
            path: 'clients',
            element: <Clients />,
          },
          {
            path: 'admins',
            element: <Managers />,
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
