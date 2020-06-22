/* globals window */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCountries, createCountry, updateCountry, deleteCountry } from '../helpers/api'

// const serverUrl = process.env.REACT_APP_SERVER_DOMAIN

export function Countries () {
  const [hasLoadedCountries, setHasLoadedCountries] = useState(false)
  const [countries, setCountries] = useState([])
  const [isEditing, setIsEditing] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingLocale, setIsCreatingLocale] = useState(false)
  const [newCountry, setNewCountry] = useState({ name: '', code: '', locales: [] })
  const [newLocale, setNewLocale] = useState({ name: '', code: '' })
  const { t } = useTranslation()
  const isEditingSomething = isCreating || isEditing.filter(c => c).length > 0

  async function loadCountries () {
    const fetchedCountries = await getCountries()
    setCountries(fetchedCountries)
    setIsEditing(fetchedCountries.map(c => false))
    setIsCreating(false)
    setHasLoadedCountries(true)
    setNewCountry({ name: '', code: '', locales: [] })
  }

  useEffect(() => {
    if (!hasLoadedCountries) {
      loadCountries()
    }
  })

  const editCountry = (countryIndex) => {
    setIsEditing(isEditing.map((country, index) => {
      return countryIndex === index
    }))
    setNewLocale({ name: '', code: '' })
  }

  const onchangeCountryName = (index, name) => {
    const updated = JSON.parse(JSON.stringify(countries))
    updated[index].name = name
    setCountries(updated)
  }
  const onchangeNewCountryName = (name) => {
    const updated = JSON.parse(JSON.stringify(newCountry))
    updated.name = name
    setNewCountry(updated)
  }
  const onchangeCountryCode = (index, code) => {
    const updated = JSON.parse(JSON.stringify(countries))
    updated[index].code = code
    setCountries(updated)
  }
  const onchangeNewCountryCode = (code) => {
    const updated = JSON.parse(JSON.stringify(newCountry))
    updated.code = code
    setNewCountry(updated)
  }

  const onSaveCountry = async (country) => {
    await updateCountry(country)
    loadCountries()
  }
  const onSaveNewCountry = async () => {
    await createCountry(newCountry)
    loadCountries()
  }

  const onDeleteCountry = async (country) => {
    if (window.confirm(t('countries_delete_confirm'))) {
      await deleteCountry(country)
      loadCountries()
    }
  }

  const onchangeNewLocaleName = (name) => {
    const updated = JSON.parse(JSON.stringify(newLocale))
    updated.name = name
    setNewLocale(updated)
  }
  const onchangeNewLocaleCode = (code) => {
    const updated = JSON.parse(JSON.stringify(newLocale))
    updated.code = code
    setNewLocale(updated)
  }
  const onSaveNewLocale = async (index) => {
    const updated = JSON.parse(JSON.stringify(countries))
    updated[index].locales.push(newLocale)
    setCountries(updated)
    setNewLocale({ name: '', code: '' })
    setIsCreatingLocale(false)
  }
  const onDeleteLocale = async (countryIndex, localeIndex) => {
    const updated = JSON.parse(JSON.stringify(countries))
    updated[countryIndex].locales = updated[countryIndex].locales.filter((l, index) => index !== localeIndex)
    setCountries(updated)
  }

  return (
    <div>
      <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='h2'>{t('countries_title')}</h1>
      </div>
      <table className='table mt-3'>
        <thead>
          <tr>
            <th scope='col' />
            <th scope='col'>{t('countries_country_code')}</th>
            <th scope='col'>{t('countries_country_name')}</th>
            <th scope='col'>{t('countries_country_locales')}</th>
            <th scope='col' />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {isCreating ? (
                <div>
                  <button onClick={onSaveNewCountry} className='btn btn-primary mr-2'>{t('countries_save')}</button>
                  <button onClick={loadCountries} className='btn btn-secondary mr-2'>{t('countries_discard')}</button>
                </div>
              ) : (
                <button onClick={() => setIsCreating(true)} disabled={isEditingSomething} className='btn btn-primary mr-2'>{t('countries_create')}</button>
              ) }
            </td>
            <td scope='row'>
              {isCreating && (
                <input type='text' maxLength='4' value={newCountry.code} style={{ width: '50px' }} onChange={(event) => onchangeNewCountryCode(event.target.value)} />
              ) }
            </td>
            <td scope='row'>
              {isCreating && (
                <input type='text' value={newCountry.name} onChange={(event) => onchangeNewCountryName(event.target.value)} />
              ) }
            </td>
            <td />
            <td />
          </tr>
          {countries.map((country, countryIndex) => {
            return (
              <tr key={countryIndex}>
                <td>
                  {isEditing[countryIndex] ? (
                    <div>
                      <button className='btn btn-primary mr-2' disabled={isCreatingLocale} onClick={() => onSaveCountry(country)}>{t('countries_save')}</button>
                      <button onClick={loadCountries} className='btn btn-secondary mr-2'>{t('countries_discard')}</button>
                    </div>
                  ) : (
                    <button className='btn btn-primary mr-2' disabled={isEditingSomething} onClick={() => editCountry(countryIndex)}>{t('countries_edit')}</button>
                  ) }
                </td>
                <td scope='row'>
                  {isEditing[countryIndex] ? (
                    <input type='text' value={country.code} style={{ width: '50px' }} onChange={(event) => onchangeCountryCode(countryIndex, event.target.value)} />
                  ) : country.code }
                </td>
                <td scope='row'>
                  {isEditing[countryIndex] ? (
                    <input type='text' value={country.name} onChange={(event) => onchangeCountryName(countryIndex, event.target.value)} />
                  ) : country.name }
                </td>
                <td scope='row'>
                  {country.locales.map((locale, localeIndex) => {
                    return (
                      <div>
                        {locale.code}: {locale.name}
                        {isEditing[countryIndex] && (
                          <button onClick={() => onDeleteLocale(countryIndex, localeIndex)} className='btn btn-danger ml-2 mt-2'>{t('countries_locale_delete')}</button>
                        ) }
                      </div>
                    )
                  })}
                  {isEditing[countryIndex] && (
                    <div>
                      {isCreatingLocale ? (
                        <div>
                          <input type='text' value={newLocale.code} placeholder={t('countries_locale_code')} style={{ width: '50px' }} className='mr-1' onChange={(event) => onchangeNewLocaleCode(event.target.value)} />
                          <input type='text' value={newLocale.name} placeholder={t('countries_locale_name')} style={{ width: '150px' }} className='mr-1' onChange={(event) => onchangeNewLocaleName(event.target.value)} />
                          <button onClick={() => onSaveNewLocale(countryIndex)} className='btn btn-primary mr-1'>{t('countries_locale_save')}</button>
                          <button onClick={() => setIsCreatingLocale(false)} className='btn btn-secondary'>{t('countries_locale_discard')}</button>
                        </div>
                      ) : (
                        <button onClick={() => setIsCreatingLocale(true)} className='btn btn-primary mr-2'>{t('countries_locale_create')}</button>
                      )}
                    </div>
                  ) }
                </td>
                <td scope='row'>
                  <button onClick={() => onDeleteCountry(country)} disabled={isEditingSomething} className='btn btn-danger mr-2'>{t('countries_delete')}</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
