/* globals alert */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { updatePassword, updateUsername } from '../helpers/api'

export function Account () {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const { t } = useTranslation()

  const onSubmitNewPassword = async (event) => {
    event.preventDefault()
    const passwordRegex = /^[\w!@#$%^&*]{8,}$/
    if (passwordRegex.test(newPassword)) {
      const updatePasswordSuccess = await updatePassword(currentPassword, newPassword)
      if (!updatePasswordSuccess) {
        alert(t('account_current_password_incorrect'))
      } else {
        alert(t('account_update_password_success'))
        setCurrentPassword('')
        setNewPassword('')
      }
    } else {
      alert(t('account_new_password_invalid'))
    }
  }

  const onSubmitNewUsername = async (event) => {
    event.preventDefault()
    const updateUsernameSuccess = await updateUsername({ username: newUsername })
    if (!updateUsernameSuccess) {
      alert(t('account_update_username_fail'))
    } else {
      alert(t('account_update_username_success'))
      setCurrentPassword('')
      setNewPassword('')
    }
  }

  const onchangeCurrentPassword = (event) => {
    setCurrentPassword(event.target.value)
  }
  const onchangeNewPassword = (event) => {
    setNewPassword(event.target.value)
  }
  const onchangeNewUsername = (event) => {
    setNewUsername(event.target.value)
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('account_title')}</h1>
      </div>
      <form class='form-signin' onSubmit={onSubmitNewUsername}>
        <h2 class='h3 mb-3 font-weight-normal'>{t('account_update_username_title')}</h2>
        <label for='new-username' class='sr-only'>{t('account_new_username')}:</label>
        <input value={newUsername} onChange={onchangeNewUsername} type='email' id='new-username' name='new-username' placeholder={t('account_new_username')} class='form-control' />
        <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>{t('account_update_username_submit')}</button>
      </form>
      <form class='form-signin' onSubmit={onSubmitNewPassword}>
        <h2 class='h3 mb-3 font-weight-normal'>{t('account_update_password_title')}</h2>
        <p>{t('account_password_instructions')}</p>
        <label for='current-password' class='sr-only'>{t('account_current_password')}:</label>
        <input value={currentPassword} onChange={onchangeCurrentPassword} type='password' id='username' name='current-password' placeholder={t('account_current_password')} class='form-control' />
        <label for='new-password' class='sr-only'>{t('account_new_password')}:</label>
        <input value={newPassword} onChange={onchangeNewPassword} type='password' id='username' name='new-password' placeholder={t('account_new_password')} class='form-control' />
        <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>{t('account_update_password_submit')}</button>
      </form>
    </div>
  )
}
