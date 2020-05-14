/* globals alert, FileReader */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { postCheckpoints } from '../helpers/api'
import { isValidJSON } from '../helpers/json'

export function Checkpoints ({ onUpload }) {
  const { t } = useTranslation()
  const webAppUrl = process.env.REACT_APP_WEB_APP_DOMAIN

  const handleUpload = () => {
    const files = document.getElementById('checkpoint-upload').files
    if (files.length <= 0) {
      return false
    }
    const fr = new FileReader()
    fr.onload = async (e) => {
      if (e && e.target.result && isValidJSON(e.target.result)) {
        const checkpointsJSON = JSON.parse(e.target.result)
        const uploadSuccess = await postCheckpoints(checkpointsJSON)
        if (uploadSuccess) {
          alert(t('upload_success'))
        } else {
          alert(t('upload_fail'))
        }
        document.getElementById('checkpoint-upload-form').reset()
      } else {
        alert(t('upload_fail'))
      }
    }
    fr.readAsText(files.item(0))
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('upload_title')}</h1>
      </div>
      <form id='checkpoint-upload-form'>
        <p>{t('upload_instructions_1')} {webAppUrl}. {t('upload_instructions_2')}</p>
        <p>{t('upload_instructions_3')}</p>
        <div class='alert alert-success' style={{ display: 'none' }} id='upload-success' role='alert'>
          {t('upload_success')}
        </div>
        <input class='btn btn-large btn-warning' type='file' id='checkpoint-upload' onChange={handleUpload} />
      </form>
    </div>
  )
}
