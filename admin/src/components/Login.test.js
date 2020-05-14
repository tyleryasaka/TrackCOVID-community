/* globals test, expect */
import React from 'react'
import { Login } from './Login'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

test('Login component', () => {
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Login />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
