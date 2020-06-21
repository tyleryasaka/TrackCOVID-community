/* globals alert */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchUsers, createUser, deleteUser, updateUser } from '../helpers/api'

const ViewEnum = {
  list: 1,
  new: 2
}

export function Users ({ currentUser }) {
  const [users, setUsers] = useState(undefined)
  const [view, setView] = useState(ViewEnum.list)
  const [newUsername, setNewUsername] = useState('')
  const [newCanUpload, setNewCanUpload] = useState(true)
  const [newCanCreate, setNewCanCreate] = useState(false)
  const [newCanManage, setNewCanManage] = useState(false)
  const [newCanAccessReports, setNewCanAccessReports] = useState(false)
  const [createdUsername, setCreatedUsername] = useState('')
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
    const usernameRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (usernameRegex.test(String(newUsername).toLowerCase())) {
      const createdUser = await createUser({
        username: newUsername,
        canUploadCheckpoints: newCanUpload,
        canCreateCheckpoints: newCanCreate,
        canManageUsers: newCanManage,
        canAccessReports: newCanAccessReports
      })
      if (typeof createdUser === 'undefined') {
        alert(t('user_create_fail'))
      } else {
        setCreatedUsername(createdUser.username)
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

  const onchangeNewCanUpload = () => {
    setNewCanUpload(!newCanUpload)
  }
  const onchangeNewCanCreate = () => {
    setNewCanCreate(!newCanCreate)
  }
  const onchangeNewCanManage = () => {
    setNewCanManage(!newCanManage)
  }
  const onchangeNewCanAccessReports = () => {
    setNewCanAccessReports(!newCanAccessReports)
  }
  const onEditUser = async (user, prop) => {
    const newUser = {
      userId: user.id,
      canUploadCheckpoints: user.canUploadCheckpoints,
      canCreateCheckpoints: user.canCreateCheckpoints,
      canManageUsers: user.canManageUsers,
      canAccessReports: user.canAccessReports
    }
    newUser[prop] = !user[prop]
    if (await updateUser(newUser)) {
      loadUsers()
    } else {
      alert('Oops, something went wrong.')
    }
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
          <table class='table mt-3'>
            <thead>
              <tr>
                <th scope='col'>{t('login_username')}</th>
                <th scope='col'>{t('user_create_can_upload_checkpoints')}</th>
                <th scope='col'>{t('user_create_can_create_checkpoints')}</th>
                <th scope='col'>{t('user_create_can_manage_users')}</th>
                <th scope='col'>{t('user_create_can_access_reports')}</th>
                <th scope='col' />
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, userIndex) => {
                const canEdit = user.id !== currentUser.id
                return (
                  <tr key={userIndex}>
                    <td>{user.username}</td>
                    <td>
                      {canEdit && (
                        <div class='form-check'>
                          <input class='form-check-input' type='checkbox' checked={user.canUploadCheckpoints} onChange={() => onEditUser(user, 'canUploadCheckpoints')} />
                        </div>
                      )}
                    </td>
                    <td>
                      {canEdit && (
                        <div class='form-check'>
                          <input class='form-check-input' type='checkbox' checked={user.canCreateCheckpoints} onChange={() => onEditUser(user, 'canCreateCheckpoints')} />
                        </div>
                      )}
                    </td>
                    <td>
                      {canEdit && (
                        <div class='form-check'>
                          <input class='form-check-input' type='checkbox' checked={user.canManageUsers} onChange={() => onEditUser(user, 'canManageUsers')} />
                        </div>
                      )}
                    </td>
                    <td>
                      {canEdit && (
                        <div class='form-check'>
                          <input class='form-check-input' type='checkbox' checked={user.canAccessReports} onChange={() => onEditUser(user, 'canAccessReports')} />
                        </div>
                      )}
                    </td>
                    <td>
                      {canEdit && (
                        <a onClick={() => handleDelete(user.id, user.username)} class='btn btn-danger text-light user-delete'>
                          {t('user_delete_button')}
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {view === ViewEnum.new && (
        <form class='form-signin' onSubmit={onSubmitNewUser}>
          <h2 class='h3 mb-3 font-weight-normal'>{t('user_create_title')}</h2>
          <label for='email' class='sr-only'>{t('user_create_username')}:</label>
          <input value={newUsername} onChange={onchangeUsername} type='email' id='email' name='email' placeholder={t('user_create_username')} class='form-control mb-3' />
          <div class='form-check'>
            <input checked={newCanUpload} onChange={onchangeNewCanUpload} class='form-check-input' type='checkbox' id='can-upload' />
            <label class='form-check-label' for='can-upload'>
              {t('user_create_can_upload_checkpoints')}
            </label>
          </div>
          <div class='form-check'>
            <input checked={newCanCreate} onChange={onchangeNewCanCreate} class='form-check-input' type='checkbox' id='can-create' />
            <label class='form-check-label' for='can-create'>
              {t('user_create_can_create_checkpoints')}
            </label>
          </div>
          <div class='form-check'>
            <input checked={newCanManage} onChange={onchangeNewCanManage} class='form-check-input' type='checkbox' id='can-manage' />
            <label class='form-check-label' for='can-manage'>
              {t('user_create_can_manage_users')}
            </label>
          </div>
          <div class='form-check'>
            <input checked={newCanAccessReports} onChange={onchangeNewCanAccessReports} class='form-check-input' type='checkbox' id='can-access-reports' />
            <label class='form-check-label' for='can-access-reports'>
              {t('user_create_can_access_reports')}
            </label>
          </div>
          <button class='btn btn-lg btn-warning btn-block mt-3' type='submit'>{t('user_create_submit')}</button>
        </form>
      )}
      {view === ViewEnum.created && (
        <div>
          <p class='mb-3 font-weight-normal'>{t('user_create_success')}</p>
          <p>{t('user_create_username')}: <strong>{createdUsername}</strong></p>
          <a class='btn btn-dark text-light mt-2' onClick={() => setView(ViewEnum.list)}>
            {t('user_create_exit')}
          </a>
        </div>
      )}
    </div>
  )
}
