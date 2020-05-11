/* globals alert */
import React, { useEffect, useState } from 'react'
import { sendRequest } from '../helpers/request'

const superPrivilegeLevel = 1

export function Users ({ onUpload }) {
  const [users, setUsers] = useState(undefined)

  useEffect(() => {
    if (typeof users === 'undefined') {
      sendRequest('/admin/api/users').then(res => {
        if (res && res.users) {
          setUsers(res.users)
        }
      })
    }
  })

  const usersList = users || []

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>Users</h1>
      </div>
      <ul class='list-group'>
        {usersList.map(user => {
          const canManage = user.privilege === superPrivilegeLevel
          return (
            <li class='list-group-item'>
              <strong>{user.username}</strong>
              {canManage && ' (can manage users)'}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
