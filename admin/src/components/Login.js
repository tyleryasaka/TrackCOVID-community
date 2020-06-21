import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { login } from '../helpers/api'

export function Login ({ onLoginRequest, onClickResetPassword }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { t } = useTranslation()

  const onSubmitLogin = async (event) => {
    event.preventDefault()
    const loginSuccessful = await login(username, password)
    onLoginRequest(loginSuccessful)
  }

  const onchangeUsername = (event) => {
    setUsername(event.target.value)
  }

  const onchangePassword = (event) => {
    setPassword(event.target.value)
  }

  return (
    <form class='form-signin' onSubmit={onSubmitLogin}>
      <h1 class='h3 mb-3 font-weight-normal'>{t('login_title')}</h1>
      <label for='email' class='sr-only'>{t('login_username')}:</label><br />
      <input value={username} onChange={onchangeUsername} type='email' id='email' name='email' placeholder={t('login_username')} class='form-control' /><br />
      <label for='password' class='sr-only'>{t('login_password')}:</label><br />
      <input value={password} onChange={onchangePassword} type='password' id='password' name='password' placeholder={t('login_password')} class='form-control' /><br /><br />
      <button class='btn btn-lg btn-warning btn-block' type='submit'>{t('login_submit_button')}</button>
      <p class='mt-5'>
        <a class='link text-warning' onClick={onClickResetPassword}>{t('login_forgot_password')}</a>
      </p>
      {process.env.REACT_APP_REGISTRATION_URL && (
        <p class='mt-2 mb-3 text-muted'>
          {t('login_no_account_1')} <a onClick={onClickResetPassword} href={process.env.REACT_APP_REGISTRATION_URL} target='_blank' class='text-warning'>{t('login_no_account_2')}</a>.
        </p>
      )}
      <p class='mt-5 mb-3 text-muted'>{process.env.REACT_APP_NAME} {t('admin')}</p>
    </form>
  )
}
