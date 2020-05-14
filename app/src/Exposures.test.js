/* globals test, expect */
import React from 'react'
import Exposures from '../src/Exposures'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/i18n'

test('Exposures component: not exposed', () => {
  const status = false
  const statusLoaded = true
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Exposures status={status} statusLoaded={statusLoaded} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})

test('Exposures component: exposed', () => {
  const status = true
  const statusLoaded = true
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Exposures status={status} statusLoaded={statusLoaded} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
