/* globals alert */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { sendRequest } from './helpers/request'
import { Login } from './components/Login'
import { Checkpoints } from './components/Checkpoints'
import { Users } from './components/Users'
import { Account } from './components/Account'

const ViewEnum = {
  checkpoints: 1,
  users: 2,
  account: 3
}

const superPrivilegeLevel = 1

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined)
  const [currentUser, setCurrentUser] = useState({})
  const [view, setView] = useState(ViewEnum.checkpoints)
  const { t } = useTranslation()
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
          <a class='navbar-brand col-sm-3 col-md-2 mr-0' href='/admin'>{process.env.REACT_APP_NAME} {t('admin')}</a>
          <ul class='navbar-nav px-3'>
            <li class='nav-item text-nowrap'>
              <a class='nav-link' href='/admin/logout'>{t('logout_button')}</a>
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
                      {t('menu_checkpoints')}
                    </a>
                  </li>
                  {hasSuperPrivilege && (
                    <li class='nav-item'>
                      <a class='nav-link' onClick={() => setView(ViewEnum.users)}>
                        {t('menu_users')}
                      </a>
                    </li>
                  )}
                  <li class='nav-item'>
                    <a class='nav-link' onClick={() => setView(ViewEnum.account)}>
                      {t('menu_account')}
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <main role='main' class='col-md-9 ml-sm-auto col-lg-10 px-4'>
              <p class='mt-3'>{t('welcome')}, {currentUser.username}.</p>
              {view === ViewEnum.checkpoints && (
                <Checkpoints />
              )}
              {hasSuperPrivilege && view === ViewEnum.users && (
                <Users currentUser={currentUser} />
              )}
              {view === ViewEnum.account && (
                <Account />
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
