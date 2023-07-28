import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { LoginScreen } from './Auth/Login.tsx'
import PanelLayout from './Panel/Layout.tsx'
import PanelIndex from './Panel/Index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      authName='v4yauth'
      authType='cookie'
      children={
        <BrowserRouter>
          <Routes>
            <Route path='/auth' element={ <LoginScreen></LoginScreen> }></Route>
            <Route path='/panel' element={
              <RequireAuth loginPath='/auth'>
                <Routes>
                  <Route path='/' element={ <PanelLayout/> }>
                    <Route path='/' element={ <PanelIndex/> }></Route>
                  </Route>
                </Routes>
              </RequireAuth>
            }></Route>
          </Routes>
        </BrowserRouter>
      }
    ></AuthProvider>
  </React.StrictMode>,
)
