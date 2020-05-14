/* globals test, expect */
import React from 'react'
import App from '../src/App'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

test('App component', () => {
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
