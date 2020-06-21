import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '../helpers/api'

export function Login ({ onLoginRequest }) {
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
    <form className='form-signin' onSubmit={onSubmitLogin}>
      <h1 className='h3 mb-3 font-weight-normal'>{t('login_title')}</h1>
      <label htmlFor='email' className='sr-only'>{t('login_username')}:</label><br />
      <input value={username} onChange={onchangeUsername} type='email' id='email' name='email' placeholder={t('login_username')} className='form-control' /><br />
      <label htmlFor='password' className='sr-only'>{t('login_password')}:</label><br />
      <input value={password} onChange={onchangePassword} type='password' id='password' name='password' placeholder={t('login_password')} className='form-control' /><br /><br />
      <button className='btn btn-lg btn-warning btn-block' type='submit'>{t('login_submit_button')}</button>
      <p className='mt-5'>
        <Link className='link text-warning' to={'/forgot-password'}>{t('login_forgot_password')}</Link>
      </p>
      {process.env.REACT_APP_REGISTRATION_URL && (
        <p className='mt-2 mb-3 text-muted'>
          {t('login_no_account_1')} <a href={process.env.REACT_APP_REGISTRATION_URL} target='_blank' className='text-warning'>{t('login_no_account_2')}</a>.
        </p>
      )}
      <p className='mt-5 mb-3 text-muted'>{process.env.REACT_APP_NAME} {t('admin')}</p>
    </form>
  )
}
