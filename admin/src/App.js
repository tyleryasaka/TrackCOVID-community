import React, { useEffect, useState } from 'react'
import './App.css'
import { sendRequest } from './helpers/request'
import { Login } from './components/Login'
import { Checkpoints } from './components/Checkpoints'

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined)

  useEffect(() => {
    if (typeof isLoggedIn === 'undefined') {
      sendRequest('/admin/api/status').then(res => {
        setIsLoggedIn(res && res.isLoggedIn)
      })
    }
  })

  const onSubmitLogin = async (loginSuccessful) => {
    setIsLoggedIn(loginSuccessful)
  }

  if (isLoggedIn) {
    return (
      <div className='App'>
        <nav class='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
          <a class='navbar-brand col-sm-3 col-md-2 mr-0' href='/admin'>TrackCOVID Admin</a>
          <ul class='navbar-nav px-3'>
            <li class='nav-item text-nowrap'>
              <a class='nav-link' href='/admin/logout'>Sign out</a>
            </li>
          </ul>
        </nav>

        <div class='container-fluid'>
          <div class='row'>
            <nav class='col-md-2 d-none d-md-block bg-light sidebar'>
              <div class='sidebar-sticky'>
                <ul class='nav flex-column'>
                  <li class='nav-item'>
                    <a class='nav-link'>
                      <span data-feather='home' />
                      Checkpoints
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <main role='main' class='col-md-9 ml-sm-auto col-lg-10 px-4'>
              <Checkpoints />
            </main>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div class='login-container bg-dark text-center text-light'>
        <Login onLoginRequest={onSubmitLogin} />
      </div>
    )
  }
}

export default App
