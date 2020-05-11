import React, { useState } from 'react'
import { sendRequest } from '../helpers/request'

export function Login ({ onLoginRequest }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitLogin = async (event) => {
    event.preventDefault()
    const res = await sendRequest('/admin/login', 'POST', { username, password })
    onLoginRequest(res && res.isLoggedIn)
  }

  const onchangeUsername = (event) => {
    setUsername(event.target.value)
  }

  const onchangePassword = (event) => {
    setPassword(event.target.value)
  }

  return (
    <form class='form-signin' onSubmit={onSubmitLogin}>
      <h1 class='h3 mb-3 font-weight-normal'>Please sign in</h1>
      <label for='username' class='sr-only'>Username:</label><br />
      <input value={username} onChange={onchangeUsername} type='text' id='username' name='username' placeholder='Username' class='form-control' /><br />
      <label for='password' class='sr-only'>Password:</label><br />
      <input value={password} onChange={onchangePassword} type='password' id='password' name='password' placeholder='Password' class='form-control' /><br /><br />
      <button class='btn btn-lg btn-warning btn-block' type='submit'>Sign in</button>
      <p class='mt-5 mb-3 text-muted'>TrackCOVID Admin</p>
    </form>
  )
}
