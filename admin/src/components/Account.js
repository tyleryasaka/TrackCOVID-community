/* globals alert */
import React, { useState } from 'react'
import { sendRequest } from '../helpers/request'

export function Account () {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const onSubmitNewPassword = async (event) => {
    event.preventDefault()
    const passwordRegex = /^[\w!@#$%^&*]{8,}$/
    if (passwordRegex.test(newPassword)) {
      const res = await sendRequest(
        '/admin/api/account',
        'PUT',
        { currentPassword, newPassword }
      )
      if (res.error) {
        alert('Current password is incorrect.')
      } else {
        alert('Your password was updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
      }
    } else {
      alert('New password is not valid.')
    }
  }

  const onchangeCurrentPassword = (event) => {
    setCurrentPassword(event.target.value)
  }

  const onchangeNewPassword = (event) => {
    setNewPassword(event.target.value)
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>Account</h1>
      </div>
      <form class='form-signin' onSubmit={onSubmitNewPassword}>
        <h2 class='h3 mb-3 font-weight-normal'>Update password</h2>
        <p>Passwords must be at least 8 characters long.</p>
        <label for='current-password' class='sr-only'>Current password:</label>
        <input value={currentPassword} onChange={onchangeCurrentPassword} type='password' id='username' name='current-password' placeholder='Current password' class='form-control' />
        <label for='new-password' class='sr-only'>New password:</label>
        <input value={newPassword} onChange={onchangeNewPassword} type='password' id='username' name='new-password' placeholder='New password' class='form-control' />
        <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>Update</button>
      </form>
    </div>
  )
}
