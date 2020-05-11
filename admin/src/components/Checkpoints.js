/* globals alert, FileReader */
import React from 'react'
import { sendRequest } from '../helpers/request'
import { isValidJSON } from '../helpers/json'

export function Checkpoints ({ onUpload }) {
  const handleUpload = () => {
    const files = document.getElementById('checkpoint-upload').files
    if (files.length <= 0) {
      return false
    }
    const fr = new FileReader()
    fr.onload = async (e) => {
      if (e && e.target.result && isValidJSON(e.target.result)) {
        const result = JSON.parse(e.target.result)
        const res = await sendRequest(
          '/admin/api/checkpoints',
          'POST',
          { checkpoints: result }
        )
        if (res && !res.error) {
          alert('The checkpoints were uploaded successfully.')
        } else {
          alert('Oops, that upload failed.')
        }
        document.getElementById('checkpoint-upload-form').reset()
      } else {
        alert('Oops, that upload failed.')
      }
    }
    fr.readAsText(files.item(0))
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>Upload Checkpoints</h1>
      </div>
      <form id='checkpoint-upload-form'>
        <p>Click the button to upload a checkpoint history file.</p>
        <p>A patient with a positive test can download this from the web app and email it to you to be uploaded here.</p>
        <div class='alert alert-success' style={{ display: 'none' }} id='upload-success' role='alert'>
          The checkpoints were uploaded successfully.
        </div>
        <input class='btn btn-large btn-warning' type='file' id='checkpoint-upload' onChange={handleUpload} />
      </form>
    </div>
  )
}
