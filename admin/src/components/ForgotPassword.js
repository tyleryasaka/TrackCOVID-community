/* globals alert */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resetPasswordRequest } from '../helpers/api'

export function ForgotPassword () {
  const [username, setUsername] = useState('')
  const { t } = useTranslation()

  const onSubmit = async (event) => {
    event.preventDefault()
    const resetSuccessful = await resetPasswordRequest({ username })
    if (resetSuccessful) {
      alert(t('reset_password_request_success'))
    } else {
      alert(t('reset_password_request_fail'))
    }
  }

  const onchangeUsername = (event) => {
    setUsername(event.target.value)
  }

  return (
    <form class='form-signin' onSubmit={onSubmit}>
      <h1 class='h3 mb-3 font-weight-normal'>{t('reset_password_request_title')}</h1>
      <label for='email' class='sr-only'>{t('login_username')}:</label><br />
      <input value={username} onChange={onchangeUsername} type='email' id='email' name='email' placeholder={t('login_username')} class='form-control' /><br />
      <button class='btn btn-lg btn-warning btn-block' type='submit'>{t('reset_password_request_submit')}</button>
      <p class='mt-5 mb-3 text-muted'>{process.env.REACT_APP_NAME} {t('admin')}</p>
      <p class='mt-5'>
        <Link class='link text-warning' to={'/login'}>{t('reset_password_cancel')}</Link>
      </p>
    </form>
  )
}
