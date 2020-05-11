/* globals alert */
import React, { useEffect, useState } from 'react'
import { sendRequest } from '../helpers/request'

const superPrivilegeLevel = 1
const defaultPrivilegeLevel = 2

const ViewEnum = {
  list: 1,
  new: 2
}

export function Users ({ currentUser }) {
  const [users, setUsers] = useState(undefined)
  const [view, setView] = useState(ViewEnum.list)
  const [newUsername, setNewUsername] = useState('')
  const [newCanManage, setNewCanManage] = useState(false)
  const [createdUsername, setCreatedUsername] = useState('')
  const [createdPassword, setCreatedPassword] = useState('')
  const usersList = users || []

  const loadUsers = async () => {
    const res = await sendRequest('/admin/api/users')
    if (res && res.users) {
      setUsers(res.users)
    }
  }

  useEffect(() => {
    if (typeof users === 'undefined') {
      loadUsers()
    }
  })

  const onSubmitNewUser = async (event) => {
    event.preventDefault()
    const usernameRegex = /((^[a-z]+)|(^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i
    if (usernameRegex.test(newUsername)) {
      const privilege = newCanManage ? superPrivilegeLevel : defaultPrivilegeLevel
      const res = await sendRequest(
        '/admin/api/users',
        'POST',
        { username: newUsername, privilege }
      )
      if (res.error) {
        alert('Oops, there was an error creating this user.')
      } else {
        setCreatedUsername(res.user.username)
        setCreatedPassword(res.user.password)
        setView(ViewEnum.created)
        loadUsers()
      }
      setNewUsername('')
      setNewCanManage(false)
    } else {
      alert('Only letters and numbers are allowed in a username.')
    }
  }

  const onchangeUsername = (event) => {
    setNewUsername(event.target.value)
  }

  const onchangeNewCanManage = () => {
    setNewCanManage(!newCanManage)
  }

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Delete user: ${username}?`)) {
      const res = await sendRequest(`/admin/api/users/${userId}`, 'DELETE')
      if (res && !res.error) {
        loadUsers()
      } else {
        alert('Oops, something went wrong.')
      }
    }
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>Users</h1>
      </div>
      {view === ViewEnum.list && (
        <div>
          <a class='btn btn-dark text-light mb-2' onClick={() => setView(ViewEnum.new)}>
            New user
          </a>
          <ul class='list-group'>
            {usersList.map(user => {
              const canManage = user.privilege === superPrivilegeLevel
              const canDelete = user.id !== currentUser.id
              return (
                <li class='list-group-item user-list'>
                  <strong>{user.username}</strong>
                  {canManage && (
                    <span> (can manage users)</span>
                  )}
                  {canDelete && (
                    <a onClick={() => handleDelete(user.id, user.username)} class='btn btn-danger text-light user-delete'>
                      Delete
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {view === ViewEnum.new && (
        <form class='form-signin' onSubmit={onSubmitNewUser}>
          <h2 class='h3 mb-3 font-weight-normal'>Create a new user</h2>
          <label for='username' class='sr-only'>Username:</label>
          <input value={newUsername} onChange={onchangeUsername} type='text' id='username' name='username' placeholder='Username' class='form-control' />
          <div class='form-check'>
            <input checked={newCanManage} onChange={onchangeNewCanManage} class='form-check-input' type='checkbox' id='can-manage' />
            <label class='form-check-label' for='can-manage'>
              Can manage other users
            </label>
          </div>
          <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>Create</button>
        </form>
      )}
      {view === ViewEnum.created && (
        <div>
          <h2 class='h3 mb-3 font-weight-normal'>A new user was created with the following credentials:</h2>
          <p>Username: <strong>{createdUsername}</strong></p>
          <p>Temporary password: <strong>{createdPassword}</strong></p>
          <p>Please provide these credentials to the user and instruct them to change their password once they log in.</p>
          <a class='btn btn-dark text-light mt-2' onClick={() => setView(ViewEnum.list)}>
            Return to all users
          </a>
        </div>
      )}
    </div>
  )
}
