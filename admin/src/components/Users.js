/* globals alert */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchUsers, createUser, deleteUser } from '../helpers/api'

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
  const { t } = useTranslation()
  const usersList = users || []

  const loadUsers = async () => {
    const users = await fetchUsers()
    if (typeof users !== 'undefined') {
      setUsers(users)
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
      const createdUser = await createUser(newUsername, privilege)
      if (typeof createdUser === 'undefined') {
        alert(t('user_create_fail'))
      } else {
        setCreatedUsername(createdUser.username)
        setCreatedPassword(createdUser.password)
        setView(ViewEnum.created)
        loadUsers()
      }
      setNewUsername('')
      setNewCanManage(false)
    } else {
      alert(t('user_create_invalid_username'))
    }
  }

  const onchangeUsername = (event) => {
    setNewUsername(event.target.value)
  }

  const onchangeNewCanManage = () => {
    setNewCanManage(!newCanManage)
  }

  const handleDelete = async (userId, username) => {
    if (window.confirm(`${t('user_delete_confirm')}: ${username}?`)) {
      const deletedUserSuccessfully = await deleteUser(userId)
      if (deletedUserSuccessfully) {
        loadUsers()
      } else {
        alert(t('user_delete_fail'))
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
          <h2 class='h3 mb-3 font-weight-normal'>{t('user_create_title')}</h2>
          <label for='username' class='sr-only'>{t('user_create_username')}:</label>
          <input value={newUsername} onChange={onchangeUsername} type='text' id='username' name='username' placeholder={t('user_create_username')} class='form-control' />
          <div class='form-check'>
            <input checked={newCanManage} onChange={onchangeNewCanManage} class='form-check-input' type='checkbox' id='can-manage' />
            <label class='form-check-label' for='can-manage'>
              {t('user_create_can_manage_users')}
            </label>
          </div>
          <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>{t('user_create_submit')}</button>
        </form>
      )}
      {view === ViewEnum.created && (
        <div>
          <h2 class='h3 mb-3 font-weight-normal'>{t('user_create_success')}:</h2>
          <p>{t('user_create_username')}: <strong>{createdUsername}</strong></p>
          <p>{t('user_create_password')}: <strong>{createdPassword}</strong></p>
          <p>{t('user_create_credential_delivery')}</p>
          <a class='btn btn-dark text-light mt-2' onClick={() => setView(ViewEnum.list)}>
            {t('user_create_exit')}
          </a>
        </div>
      )}
    </div>
  )
}
