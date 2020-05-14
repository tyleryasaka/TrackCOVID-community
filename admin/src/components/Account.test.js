/* globals test, expect */
import React from 'react'
import { Account } from './Account'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

test('Account component', () => {
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Account />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
