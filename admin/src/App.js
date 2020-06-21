/* globals alert */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, NavLink, Redirect, withRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { useTranslation } from 'react-i18next'
import './App.css'
import { fetchCurrentUser } from './helpers/api'
import { Login } from './components/Login'
import { ForgotPassword } from './components/ForgotPassword'
import { Checkpoints } from './components/Checkpoints'
import { CreateCheckpoint } from './components/CreateCheckpoint'
import { Reports } from './components/Reports'
import { Users } from './components/Users'
import { Account } from './components/Account'

const ViewEnum = {
  checkpoints: '/checkpoints/upload',
  users: '/users',
  account: '/account',
  createCheckpoint: '/checkpoints/new',
  reports: '/reports',
  login: '/login',
  resetPassword: '/reset-password'
}

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN
const basename = '/admin'

function AppContainer ({ history }) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined)
  const [currentUser, setCurrentUser] = useState({})
  const canUploadCheckpoints = currentUser && Boolean(currentUser.canUploadCheckpoints)
  const canCreateCheckpoints = currentUser && Boolean(currentUser.canCreateCheckpoints)
  const canManageUsers = currentUser && Boolean(currentUser.canManageUsers)
  const canAccessReports = currentUser && Boolean(currentUser.canAccessReports)
  const { t } = useTranslation()

  const loadCurrentUser = async () => {
    const user = await fetchCurrentUser()
    if (typeof user !== 'undefined') {
      history.push(getDefaultRoute(true, user))
      setIsLoggedIn(true)
      setCurrentUser(user)
    } else {
      setIsLoggedIn(false)
      history.push(getDefaultRoute(false, user))
    }
  }

  useEffect(() => {
    if (typeof isLoggedIn === 'undefined') {
      loadCurrentUser()
    }
  }, [isLoggedIn])

  const getDefaultRoute = (isLoggedIn, user) => {
    return isLoggedIn
      ? user.canUploadCheckpoints
        ? ViewEnum.checkpoints
        : user.canCreateCheckpoints
          ? ViewEnum.createCheckpoint
          : user.canManageUsers
            ? ViewEnum.users
            : user.canAccessReports
              ? ViewEnum.reports
              : ViewEnum.account
      : ViewEnum.login
  }

  const onSubmitLogin = async (loginSuccessful) => {
    if (loginSuccessful) {
      loadCurrentUser()
    } else {
      alert('Login failed')
    }
  }

  const renderContext = (isLoggedIn, ChildComponent) => {
    return (
      isLoggedIn
        ? (
          <div className='App'>
            <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
              <a className='navbar-brand col-sm-3 col-md-2 mr-0' href='/admin'>{process.env.REACT_APP_NAME} {t('admin')}</a>
              <div className='text-light'>{t('welcome')}: {currentUser.username}</div>
              <ul className='navbar-nav px-3'>
                <li className='nav-item text-nowrap'>
                  <a className='nav-link' href={`${serverUrl}/admin/logout`}>{t('logout_button')}</a>
                </li>
              </ul>
            </nav>

            <div className='container-fluid'>
              <div className='row'>
                <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
                  <div className='sidebar-sticky'>
                    <ul className='nav flex-column'>
                      {canUploadCheckpoints && (
                        <li className='nav-item'>
                          <NavLink className='nav-link' activeClassName='nav-link active' to={ViewEnum.checkpoints}>
                            {t('menu_checkpoints')}
                          </NavLink>
                        </li>
                      )}
                      {canCreateCheckpoints && (
                        <li className='nav-item'>
                          <NavLink className='nav-link' activeClassName='active' to={ViewEnum.createCheckpoint}>
                            {t('menu_checkpoint_pdf')}
                          </NavLink>
                        </li>
                      )}
                      {canAccessReports && (
                        <li className='nav-item'>
                          <NavLink className='nav-link' activeClassName='active' to={ViewEnum.reports}>
                            {t('menu_reports')}
                          </NavLink>
                        </li>
                      )}
                      {canManageUsers && (
                        <li className='nav-item'>
                          <NavLink className='nav-link' activeClassName='active' to={ViewEnum.users}>
                            {t('menu_users')}
                          </NavLink>
                        </li>
                      )}
                      <li className='nav-item'>
                        <NavLink className='nav-link' activeClassName='active' to={ViewEnum.account}>
                          {t('menu_account')}
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </nav>

                <main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-4'>
                  <ChildComponent />
                </main>
              </div>
            </div>
          </div>
        ) : (
          <div className='login-container bg-dark text-center text-light'>
            <ChildComponent />
          </div>
        )
    )
  }

  return (
    <div>
      <Route path={ViewEnum.login} component={() => renderContext(isLoggedIn, () => <Login onLoginRequest={onSubmitLogin} />)} />
      <Route path={ViewEnum.resetPassword} component={() => renderContext(isLoggedIn, () => <ForgotPassword />)} />
      <Route path={ViewEnum.checkpoints} component={() => renderContext(isLoggedIn, Checkpoints)} />
      <Route path={ViewEnum.createCheckpoint} component={() => renderContext(isLoggedIn, CreateCheckpoint)} />
      <Route path={ViewEnum.reports} component={() => renderContext(isLoggedIn, Reports)} />
      <Route path={ViewEnum.users} component={() => renderContext(isLoggedIn, () => <Users currentUser={currentUser} />)} />
      <Route path={ViewEnum.account} component={() => renderContext(isLoggedIn, Account)} />
      { ((history.location.pathname === '/') || (history.location.pathname === '/admin')) && (
        <Redirect from='/' to={getDefaultRoute()} />
      )}
    </div>
  )
}

function App () {
  const history = createBrowserHistory()
  const AppContainerWithRouter = withRouter(AppContainer)
  return (
    <Router basename={basename}>
      <AppContainerWithRouter history={history} />
    </Router>
  )
}

export default App
