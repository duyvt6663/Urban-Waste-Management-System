/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import { useMap } from "react-leaflet"
import depot from '../../assets/images/icons/Depot.png'
import mcp from '../../assets/images/icons/recycling-place.png'
import treat from '../../assets/images/icons/recycling-plant.png'
import {checkIsDepot, checkIsTreat} from 'src/utils/utils'
import PropTypes from 'prop-types'
import {DEPOT, TREAT} from './AppMap'


const iconDEPOT = L.icon({
  iconUrl: depot,
  iconSize: [40, 40],
})
const iconTREAT = L.icon({
  iconUrl: treat,
  iconSize: [40, 40],
})
const iconMCP = L.icon({
  iconUrl: mcp,
  iconSize: [40, 40],
})
export {iconDEPOT, iconTREAT, iconMCP}

const getMarkerMCPPopup = (params) => {
  return `
    <div><strong>ID:</strong> ${params.asset_id}</div>
    <div><strong>Load:</strong> ${params.load} kg</div>
    <div><strong>Filled:</strong> ${params.percentage*100} %</div>
    <div><strong>Population:</strong> ${params.pop_density} p/sq.km</div>
    <div><strong>Janitors:</strong> ${params.janitor_count} p</div>
  `
}


const Routing = ({routeInfo,...props}) => {
  const map = useMap();
  function getRoute(x){
    let res = []
    res.push(L.latLng(DEPOT.latitude, DEPOT.longtitude))
    for(let i = 0; i < x.length; ++i) 
      res.push(L.latLng(x[i].latitude, x[i].longtitude))
    res.push(L.latLng(TREAT.latitude, TREAT.longtitude))
    return res
  }
  const waypointss = getRoute(routeInfo)

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: waypointss,
      lineOptions: {
        styles: [{ color: "#FD4F4F", weight: 4 }]
      },
      createMarker: (i, waypoint, n) => {
        if (i == 0) {
          return L.marker(waypoint.latLng, {
            draggable: true,
            icon: iconDEPOT,
          })
        }
        else if(i == n-1) {
          return L.marker(waypoint.latLng, {
            draggable: true,
            icon: iconTREAT,
          })
        }
        return L.marker(waypoint.latLng, {
          draggable: true,
          icon: iconMCP,
        }).bindPopup(getMarkerMCPPopup(routeInfo[i-1]))
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map]);

  return null
}
Routing.propTypes = {
  routeInfo: PropTypes.arrayOf(PropTypes.element)
}
export default Routing
