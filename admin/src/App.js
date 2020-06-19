/* globals alert */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { fetchCurrentUser } from './helpers/api'
import { Login } from './components/Login'
import { Checkpoints } from './components/Checkpoints'
import { CreateCheckpoint } from './components/CreateCheckpoint'
import { Reports } from './components/Reports'
import { Users } from './components/Users'
import { Account } from './components/Account'

const ViewEnum = {
  checkpoints: 1,
  users: 2,
  account: 3,
  createCheckpoint: 4,
  reports: 5
}

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined)
  const [currentUser, setCurrentUser] = useState({})
  const canUploadCheckpoints = currentUser && Boolean(currentUser.canUploadCheckpoints)
  const canCreateCheckpoints = currentUser && Boolean(currentUser.canCreateCheckpoints)
  const canManageUsers = currentUser && Boolean(currentUser.canManageUsers)
  const canAccessReports = currentUser && Boolean(currentUser.canAccessReports)
  const [view, setView] = useState(null)
  const { t } = useTranslation()

  const loadCurrentUser = async () => {
    const user = await fetchCurrentUser()
    if (typeof user !== 'undefined') {
      setIsLoggedIn(true)
      setCurrentUser(user)
      setView(user.canUploadCheckpoints
        ? ViewEnum.checkpoints
        : user.canCreateCheckpoints
          ? ViewEnum.createCheckpoint
          : user.canManageUsers
            ? ViewEnum.users
            : user.canAccessReports
              ? ViewEnum.reports
              : ViewEnum.account)
    }
  }

  useEffect(() => {
    if (typeof isLoggedIn === 'undefined') {
      loadCurrentUser()
    }
  })

  const onSubmitLogin = async (loginSuccessful) => {
    if (loginSuccessful) {
      loadCurrentUser()
    } else {
      alert('Login failed')
    }
  }

  if (isLoggedIn) {
    return (
      <div className='App'>
        <nav class='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
          <a class='navbar-brand col-sm-3 col-md-2 mr-0' href='/admin'>{process.env.REACT_APP_NAME} {t('admin')}</a>
          <div class='text-light'>{t('welcome')}, {currentUser.username}.</div>
          <ul class='navbar-nav px-3'>
            <li class='nav-item text-nowrap'>
              <a class='nav-link' href={`${serverUrl}/admin/logout`}>{t('logout_button')}</a>
            </li>
          </ul>
        </nav>

        <div class='container-fluid'>
          <div class='row'>
            <nav class='col-md-2 d-none d-md-block bg-light sidebar'>
              <div class='sidebar-sticky'>
                <ul class='nav flex-column'>
                  {canUploadCheckpoints && (
                    <li class='nav-item'>
                      <a class='nav-link' onClick={() => setView(ViewEnum.checkpoints)}>
                        {t('menu_checkpoints')}
                      </a>
                    </li>
                  )}
                  {canCreateCheckpoints && (
                    <li class='nav-item'>
                      <a class='nav-link' onClick={() => setView(ViewEnum.createCheckpoint)}>
                        {t('menu_checkpoint_pdf')}
                      </a>
                    </li>
                  )}
                  {canAccessReports && (
                    <li class='nav-item'>
                      <a class='nav-link' onClick={() => setView(ViewEnum.reports)}>
                        {t('menu_reports')}
                      </a>
                    </li>
                  )}
                  {canManageUsers && (
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
              {canUploadCheckpoints && (view === ViewEnum.checkpoints) && (
                <Checkpoints />
              )}
              {canCreateCheckpoints && (view === ViewEnum.createCheckpoint) && (
                <CreateCheckpoint />
              )}
              {canAccessReports && (view === ViewEnum.reports) && (
                <Reports />
              )}
              {canManageUsers && (view === ViewEnum.users) && (
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
