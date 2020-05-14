/* globals test, expect */
import React from 'react'
import StatusAlert from '../src/StatusAlert'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/i18n'

test('StatusAlert component: on exposures tab, not exposed', () => {
  const status = false
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <StatusAlert status={status} onExposuresTab />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})

test('StatusAlert component: on exposures tab, exposed', () => {
  const status = true
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <StatusAlert status={status} onExposuresTab />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})

test('StatusAlert component: not on exposures tab, not exposed', () => {
  const status = false
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <StatusAlert status={status} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})

test('StatusAlert component: not on exposures tab, exposed', () => {
  const status = true
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <StatusAlert status={status} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
