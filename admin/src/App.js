/* globals alert */
import React, { useEffect, useState } from 'react'
import './App.css'
import { sendRequest } from './helpers/request'
import { Login } from './components/Login'
import { Checkpoints } from './components/Checkpoints'
import { Users } from './components/Users'

const ViewEnum = {
  checkpoints: 1,
  users: 2
}

const superPrivilegeLevel = 1

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined)
  const [currentUser, setCurrentUser] = useState({})
  const [view, setView] = useState(ViewEnum.checkpoints)
  const hasSuperPrivilege = (currentUser && currentUser.privilege === superPrivilegeLevel)

  const fetchCurrentUser = async () => {
    const res = await sendRequest('/admin/api/status')
    if (res) {
      setIsLoggedIn(res.isLoggedIn)
      setCurrentUser(res.user)
    }
  }

  useEffect(() => {
    if (typeof isLoggedIn === 'undefined') {
      fetchCurrentUser()
    }
  })

  const onSubmitLogin = async (loginSuccessful) => {
    if (loginSuccessful) {
      fetchCurrentUser()
    } else {
      alert('Login failed')
    }
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
                    <a class='nav-link' onClick={() => setView(ViewEnum.checkpoints)}>
                      Checkpoints
                    </a>
                  </li>
                  {hasSuperPrivilege && (
                    <li class='nav-item'>
                      <a class='nav-link' onClick={() => setView(ViewEnum.users)}>
                        Users
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </nav>

            <main role='main' class='col-md-9 ml-sm-auto col-lg-10 px-4'>
              {view === ViewEnum.checkpoints && (
                <Checkpoints />
              )}
              {hasSuperPrivilege && view === ViewEnum.users && (
                <Users currentUser={currentUser} />
              )}
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
