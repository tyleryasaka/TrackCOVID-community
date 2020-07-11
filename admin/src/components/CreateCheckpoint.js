/* globals */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCountryByCode } from '../helpers/locale'
import { postLocation, fetchLanguages, fetchTranslations, getCountries } from '../helpers/api'

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN

export function CreateCheckpoint () {
  const [hasLoadedCountries, setHasLoadedCountries] = useState(false)
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('')
  const [locale, setLocale] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [map, setMap] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [hasLoadedTranslations, setHasLoadedTranslations] = useState(false)
  const [pdfTranslations, setPdfTranslations] = useState([])
  const [pdfTranslation, setPdfTranslation] = useState('')
  const { t } = useTranslation()

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Française',
    ht: 'Haiti Creole',
    nl: 'Nederlands',
    fj: 'iTaukei/Fijian',
    pap: 'Papiamentu'
  }

  async function loadCountries () {
    const fetchedCountries = await getCountries()
    setHasLoadedCountries(true)
    setCountries(fetchedCountries)
  }

  useEffect(() => {
    if (!hasLoadedCountries) {
      loadCountries()
    }
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
        const newLat = place.geometry.location.lat()
        const newLong = place.geometry.location.lng()
        setLatitude(newLat)
        setLongitude(newLong)
        setMapLocation(newLat, newLong)
      })
    }
    if (!hasLoadedTranslations) {
      fetchLanguages().then(async languages => {
        setHasLoadedTranslations(true)
        const newPDFTranslations = await Promise.all(Object.keys(languages).map(code => {
          return new Promise(async resolve => {
            const translations = await fetchTranslations(code)
            if (translations['pdfTitle']) {
              resolve({
                languageCode: code,
                languageName: languageNames[code] || languages[code].name,
                altTitle: translations['pdfTitle'],
                altHelp: translations['pdfHelp']
              })
            } else {
              resolve(null)
            }
          })
        }))
        setPdfTranslations(newPDFTranslations.filter(t => {
          return (t !== null) && (t.languageCode !== 'en')
        }))
      })
    }
  }, [map, autocomplete, languageNames, hasLoadedCountries])

  function setMapLocation (lat, lng) {
    if (lat !== null && lng !== null) {
      map.setCenter({ lat, lng })
      map.setZoom(16)
    }
  }

  const onSubmitCreateCheckpoint = async (event) => {
    const checkpointKey = await postLocation({ latitude, longitude, country, locale, name, phone, email })
    let queryString = ''
    if (pdfTranslation !== '') {
      const translationObject = pdfTranslations.find(t => t.languageCode === pdfTranslation)
      queryString = `?altTitle=${translationObject.altTitle}&altHelp=${translationObject.altHelp}`
    }
    window.location.href = `${serverUrl}/admin/generate/${checkpointKey}/checkpoint.pdf${queryString}`
  }

  const onchangeLat = (event) => {
    const newLat = Number(event.target.value)
    setLatitude(newLat)
    setMapLocation(newLat, longitude)
  }
  const onchangeLong = (event) => {
    const newLong = Number(event.target.value)
    setLongitude(newLong)
    setMapLocation(latitude, newLong)
  }
  const onchangeCountry = (event) => {
    setLocale('')
    setCountry(event.target.value)
  }
  const onchangeLocale = (event) => {
    setLocale(event.target.value)
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
  const onchangePDFTranslation = (event) => {
    setPdfTranslation(event.target.value)
  }

  const isSubmitDisabled = (latitude === null) || (longitude === null) || !name || !country || !locale
  const countryObj = getCountryByCode(countries, country)
  const localesForCountry = countryObj ? countryObj.locales : []

  const externalMapLink = (latitude !== null) && (longitude !== null)
    ? `http://maps.google.com/?q=${latitude},${longitude}`
    : 'http://maps.google.com'

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('create_checkpoint_title')}</h1>
      </div>
      <input id='search-text-field' type='text' placeholder={t('create_checkpoint_address')} class='form-control' />
      <div id='map-canvas' />
      <a href={externalMapLink} class='btn btn-primary mb-3' target='_blank'>{t('create_checkpoint_external_map')}</a>
      <form class='form-create-checkpoint'>
        <label>{t('create_checkpoint_lat')}</label>
        <input value={latitude || ''} onChange={onchangeLat} type='number' placeholder={t('create_checkpoint_lat')} class='form-control mb-3' />
        <label>{t('create_checkpoint_long')}</label>
        <input value={longitude || ''} onChange={onchangeLong} type='number' placeholder={t('create_checkpoint_long')} class='form-control mb-3' />
        <label>{t('create_checkpoint_country')}</label>
        <select class='custom-select mb-3' onChange={onchangeCountry} value={country}>
          <option value=''>{t('create_checkpoint_country_select')}</option>
          {countries.map((countryOption, index) => {
            return (
              <option key={index} value={countryOption.code}>{countryOption.name} ({countryOption.code})</option>
            )
          })}
        </select>
        <label>{t('create_checkpoint_locale')}</label>
        <select class='custom-select mb-3' onChange={onchangeLocale} value={locale}>
          <option value=''>{t('create_checkpoint_locale_select')}</option>
          {localesForCountry.map(({ code, name }, index) => {
            return (
              <option key={index} value={code}>{name} ({code})</option>
            )
          })}
        </select>
        <label>{t('create_checkpoint_name')}</label>
        <input value={name} onChange={onchangeName} type='text' placeholder={t('create_checkpoint_name')} maxlength='80' class='form-control mb-3' />
        <label>{t('create_checkpoint_phone')}</label>
        <input value={phone} onChange={onchangePhone} type='text' placeholder={t('create_checkpoint_phone')} class='form-control mb-3' />
        <label>{t('create_checkpoint_email')}</label>
        <input value={email} onChange={onchangeEmail} type='text' placeholder={t('create_checkpoint_email')} class='form-control mb-3' />
        <label>{t('create_checkpoint_additional_language')}</label>
        <select class='custom-select mb-3' onChange={onchangePDFTranslation} value={pdfTranslation}>
          <option value=''>{t('create_checkpoint_additional_language_none')}</option>
          {pdfTranslations.map((pdfTranslation, index) => {
            return (
              <option key={index} value={pdfTranslation.languageCode}>English + {pdfTranslation.languageName}</option>
            )
          })}
        </select>
      </form>
      <button class='btn btn-lg btn-warning btn-block mt-3 mb-3' onClick={onSubmitCreateCheckpoint} disabled={isSubmitDisabled}>{t('create_checkpoint_submit')}</button>
    </div>
  )
}
