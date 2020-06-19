/* globals */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchCheckpointLocations } from '../helpers/api'

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN
let markers = []

export function Reports () {
  const [map, setMap] = useState(null)
  const [checkpoints, setCheckpoints] = useState([])
  const [checkpointsDisplay, setCheckpointsDisplay] = useState([])
  const [locationCounts, setLocationCounts] = useState({})
  const { t } = useTranslation()

  async function init () {
    const fetchedCheckpoints = await fetchCheckpointLocations()
    const uniqueLocationFlags = {}
    const uniqueCheckpoints = fetchedCheckpoints.filter(cp => {
      const isUnique = !uniqueLocationFlags[cp.key]
      uniqueLocationFlags[cp.key] = uniqueLocationFlags[cp.key]
        ? uniqueLocationFlags[cp.key] + 1
        : 1
      return isUnique
    })
    setLocationCounts(uniqueLocationFlags)
    setCheckpointsDisplay(uniqueCheckpoints.map(() => true))
    setCheckpoints(uniqueCheckpoints)
    const myOptions = {
      mapTypeControl: false,
      navigationControl: false,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    }
    const newMap = new window.google.maps.Map(document.getElementById('map-canvas'), myOptions)
    setMap(newMap)
    updateMap(newMap)
  }

  async function updateMap (newMap) {
    const googleMap = map || newMap
    const bounds = new window.google.maps.LatLngBounds()

    const locations = checkpoints.map(checkpoint => {
      return [checkpoint.location.name, checkpoint.location.latitude, checkpoint.location.longitude]
    }).filter((checkpoint, index) => checkpointsDisplay[index])

    var infowindow = new window.google.maps.InfoWindow()
    var marker, i

    markers.forEach((m) => {
      m.setMap(null)
    })
    markers = []

    for (i = 0; i < locations.length; i++) {
      marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(locations[i][1], locations[i][2]),
        map: googleMap
      })
      markers.push(marker)
      bounds.extend(marker.position)
      window.google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0])
          infowindow.open(googleMap, marker)
        }
      })(marker, i))
    }
    googleMap.fitBounds(bounds)
    if (locations.length === 1) {
      googleMap.setZoom(16)
    }
  }

  useEffect(() => {
    if (!map) {
      init()
    } else {
      updateMap()
    }
  }, [map, checkpoints, checkpointsDisplay])

  function onChangeDisplay (index) {
    setCheckpointsDisplay(checkpointsDisplay.map((display, i) => {
      if (i === index) {
        return !display
      } else {
        return display
      }
    }))
  }

  function selectAll () {
    setCheckpointsDisplay(checkpoints.map(() => true))
  }

  function unselectAll () {
    setCheckpointsDisplay(checkpoints.map(() => false))
  }

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('reports_title')}</h1>
      </div>
      <div id='map-canvas' />
      <button class='btn btn-primary mr-2' onClick={selectAll}>Select All</button>
      <button class='btn btn-secondary' onClick={unselectAll}>Unselect All</button>
      <table class='table mt-3'>
        <thead>
          <tr>
            <th scope='col'>Show on map</th>
            <th scope='col'>Location</th>
            <th scope='col'>Phone</th>
            <th scope='col'>Email</th>
            <th scope='col'>Exposures</th>
          </tr>
        </thead>
        <tbody>
          {checkpoints.map((checkpoint, checkpointIndex) => {
            return (
              <tr key={checkpointIndex}>
                <th scope='row'>
                  <div class='form-check'>
                    <input class='form-check-input' type='checkbox' checked={checkpointsDisplay[checkpointIndex]} onChange={() => onChangeDisplay(checkpointIndex)} />
                  </div>
                </th>
                <td>{checkpoint.location.name}</td>
                <td>{checkpoint.location.phone}</td>
                <td>{checkpoint.location.email}</td>
                <td>{locationCounts[checkpoint.key]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <a class='btn btn-lg btn-warning btn-block mt-3 mb-3' href={`${serverUrl}/admin/hotspots.csv`}>{t('reports_csv')}</a>
    </div>
  )
}
