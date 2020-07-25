/* globals alert, FileReader */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { postCheckpoints } from '../helpers/api'
import { isValidJSON } from '../helpers/json'

const oneHour = 1000 * 60 * 60
const oneDay = oneHour * 24
const twoDays = 2 * oneDay

export function Checkpoints ({ onUpload }) {
  const [symptomStart, setSymptomStart] = useState('')
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
        const symptomStartDate = new Date(symptomStart)
        symptomStartDate.setHours(24, 0, 0, 0)
        const recentCheckpoints = checkpointsJSON.filter(checkpoint => {
          return checkpoint.timestamp >= (symptomStartDate.getTime() - twoDays)
        })
        const uploadSuccess = await postCheckpoints(recentCheckpoints, symptomStartDate.getTime())
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

  const handleChangeSymptomStart = (e) => {
    setSymptomStart(e.target.value)
  }

  return (
    <div>
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='h2'>{t('upload_title')}</h1>
      </div>
      <form id='checkpoint-upload-form'>
        <p>{t('upload_instructions_1')} {webAppUrl}. {t('upload_instructions_2')}</p>
        <p>{t('upload_instructions_3')}</p>
        <div className='alert alert-success' style={{ display: 'none' }} id='upload-success' role='alert'>
          {t('upload_success')}
        </div>
        <span className='mr-2'>{t('upload_instructions_date')}:</span>
        <input className='mb-2' type='date' id='start' name='symptom-start' value={symptomStart} onChange={handleChangeSymptomStart} />
        <br />
        <input className='btn btn-large btn-warning' type='file' id='checkpoint-upload' disabled={symptomStart === ''} onChange={handleUpload} />
      </form>
    </div>
  )
}
