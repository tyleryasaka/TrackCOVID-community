/* globals test, expect */
import React from 'react'
import Checkpoints from '../src/Checkpoints'
import TestRenderer from 'react-test-renderer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/i18n'

test('Checkpoints component', () => {
  const status = false
  const statusLoaded = true
  const component = TestRenderer.create(
    <I18nextProvider i18n={i18n}>
      <Checkpoints status={status} statusLoaded={statusLoaded} />
    </I18nextProvider>)
  expect(component).toMatchSnapshot()
})
