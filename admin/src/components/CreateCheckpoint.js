/* globals */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { postLocation } from '../helpers/api'

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN

export function CreateCheckpoint () {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [map, setMap] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!map) {
      const myOptions = {
        zoom: 3,
        center: new window.google.maps.LatLng(37.09024, -95.712891),
        mapTypeControl: false,
        navigationControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      }
      const newMap = new window.google.maps.Map(document.getElementById('map-canvas'), myOptions)
      setMap(newMap)
    }
    if (map && !autocomplete) {
      const input = document.getElementById('search-text-field')
      const newAutocomplete = new window.google.maps.places.Autocomplete(input)
      setAutocomplete(newAutocomplete)
      window.google.maps.event.addListener(newAutocomplete, 'place_changed', function () {
        const place = newAutocomplete.getPlace()
        setLatitude(place.geometry.location.lat())
        setLongitude(place.geometry.location.lng())
        map.setCenter(place.geometry.location)
        map.setZoom(16)
      })
    }
  }, [map, autocomplete])

  const onSubmitCreateCheckpoint = async (event) => {
    const checkpointKey = await postLocation(latitude, longitude, name, phone, email)
    window.location.href = `${serverUrl}/admin/generate/${checkpointKey}/checkpoint.pdf`
  }

  const onchangeName = (event) => {
    setName(event.target.value)
  }
  const onchangePhone = (event) => {
    setPhone(event.target.value)
  }
  const onchangeEmail = (event) => {
    setEmail(event.target.value)
  }

  const isSubmitDisabled = !latitude || !longitude || !name

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('create_checkpoint_title')}</h1>
      </div>
      <input id='search-text-field' type='text' placeholder={t('create_checkpoint_address')} class='form-control' />
      <div id='map-canvas' />
      <form class='form-create-checkpoint'>
        <input value={name} onChange={onchangeName} type='text' placeholder={t('create_checkpoint_name')} class='form-control' />
        <input value={phone} onChange={onchangePhone} type='text' placeholder={t('create_checkpoint_phone')} class='form-control mt-3' />
        <input value={email} onChange={onchangeEmail} type='text' placeholder={t('create_checkpoint_email')} class='form-control mt-3' />
      </form>
      <button class='btn btn-lg btn-warning btn-block mt-3' onClick={onSubmitCreateCheckpoint} disabled={isSubmitDisabled}>{t('create_checkpoint_submit')}</button>
    </div>
  )
}
