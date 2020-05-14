/* globals test, expect */
import React from 'react'
import { Users } from './Users'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

test('Users component', () => {
  const currentUser = {
    username: 'mr_fox',
    privilege: 1,
    id: 'abc123'
  }
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Users currentUser={currentUser} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
