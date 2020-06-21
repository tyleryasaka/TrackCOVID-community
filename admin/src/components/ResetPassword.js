/* globals alert */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resetPassword } from '../helpers/api'

export function ResetPassword () {
  const [newPassword, setNewPassword] = useState('')
  const { t } = useTranslation()

  const onSubmit = async (event) => {
    event.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const resetSuccessful = await resetPassword({ newPassword, token })
    if (resetSuccessful) {
      alert(t('reset_password_success'))
    } else {
      alert(t('reset_password_fail'))
    }
  }

  const onchangePassword = (event) => {
    setNewPassword(event.target.value)
  }

  return (
    <form class='form-signin' onSubmit={onSubmit}>
      <h1 class='h3 mb-3 font-weight-normal'>{t('reset_password_title')}</h1>
      <label htmlFor='password' class='sr-only'>{t('account_new_password')}:</label><br />
      <input value={newPassword} onChange={onchangePassword} type='password' id='password' name='password' placeholder={t('account_new_password')} class='form-control' /><br />
      <button class='btn btn-lg btn-warning btn-block' type='submit'>{t('reset_password_submit')}</button>
      <p class='mt-5 mb-3 text-muted'>{process.env.REACT_APP_NAME} {t('admin')}</p>
      <p class='mt-5'>
        <Link class='link text-warning' to={'/login'}>{t('reset_password_cancel')}</Link>
      </p>
    </form>
  )
}
