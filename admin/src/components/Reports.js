/* globals */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchCheckpointLocations } from '../helpers/api'

const serverUrl = process.env.REACT_APP_SERVER_DOMAIN

export function Reports () {
  const [map, setMap] = useState(null)
  const { t } = useTranslation()

  async function initMap () {
    const checkpoints = await fetchCheckpointLocations()
    const bounds = new window.google.maps.LatLngBounds()
    const myOptions = {
      mapTypeControl: false,
      navigationControl: false,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    }
    const newMap = new window.google.maps.Map(document.getElementById('map-canvas'), myOptions)
    setMap(newMap)

    const locations = checkpoints.map(checkpoint => {
      return [checkpoint.location.name, checkpoint.location.latitude, checkpoint.location.longitude]
    })

    var infowindow = new window.google.maps.InfoWindow()
    var marker, i

    for (i = 0; i < locations.length; i++) {
      marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(locations[i][1], locations[i][2]),
        map: newMap
      })
      bounds.extend(marker.position)
      window.google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0])
          infowindow.open(newMap, marker)
        }
      })(marker, i))
    }
    newMap.fitBounds(bounds)
  }

  useEffect(() => {
    if (!map) {
      initMap()
    }
  }, [map])

  return (
    <div>
      <div class='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-left pt-3 pb-2 mb-3 border-bottom'>
        <h1 class='h2'>{t('reports_title')}</h1>
      </div>
      <div id='map-canvas' />
      <a class='btn btn-lg btn-warning btn-block mt-3' href={`${serverUrl}/admin/hotspots.csv`}>{t('reports_csv')}</a>
    </div>
  )
}
