/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import depot from '../../assets/images/icons/Depot.png'
import mcp from '../../assets/images/icons/recycling-place.png'

import { checkIsOfficeAddress } from 'src/utils/utils'
const DEPOT={
  latitude: 10.811756,
  longtitude: 106.628212
};
const TREAT={
  latitude: 10.810676,
  longtitude: 106.625786
};

const icon = L.icon({
  iconUrl: depot,
  iconSize: [40, 40],
})

const iconMCP = L.icon({
  iconUrl: mcp,
  iconSize: [40, 40],
})

const getMarkerMCPPopup = (params) => {
  return `
    <div><strong>Location:</strong> ${params.address}</div>
    <div><strong>Capacity:</strong> ${params.capacity}</div>
    <div><strong>Last time:</strong> ${params.capacity}</div>
  `
}

const getMarkerOfficePopup = (params) => {
  return `
    <div><strong>Location:</strong> ${params.address}</div>
  `
}

const createRoutineMachineLayer = ({ routeInfo, ...props }) => {
  function getRoute(routeInfo){
    let res = []
    res.push(L.latLng(DEPOT.latitude, DEPOT.longtitude))
    for(let i = 0; i < routeInfo.length; ++i) {
      res.push(L.latLng(routeInfo[i].latitude, routeInfo[i].longtitude))
    }
    res.push(L.latLng(TREAT.latitude, TREAT.longtitude))
    console.log(res)
    return res
  }
  const waypointss = getRoute(routeInfo)


  // const waypoints = [
  //   L.latLng(routeInfo.vertex[0].lati, routeInfo.vertex[0].longti),
  //   L.latLng(routeInfo.vertex[1].lati, routeInfo.vertex[1].longti),
  //   L.latLng(10.747325095957946, 106.64353901039668),
  // ]


  const instance = L.Routing.control({
    waypoints: waypointss,
    router: L.Routing.graphHopper(process.env.REACT_APP_GRAPHHOPPER_API),
    routeLine: function (route) {
      console.log(route)
      var line = L.Routing.line(route, {
        addWaypoints: false,
        extendToWaypoints: false,
        routeWhileDragging: false,
        autoRoute: true,
        useZoomParameter: false,
        draggableWaypoints: false,
        styles: [{ color: routeInfo.color, weight: 4 }],
      })
      line.eachLayer(function (l) {
        l.on('click', function (e) {
          console.log(e)
        })
      })

      return line
    },
    createMarker: (i, waypoint, n) => {
      if (checkIsOfficeAddress(waypoint.latLng.lat, waypoint.latLng.lng)) {
        return L.marker(waypoint.latLng, {
          draggable: true,
          icon: icon,
        }).bindPopup(getMarkerOfficePopup({address: 1}))
      }
      return L.marker(waypoint.latLng, {
        draggable: true,
        icon: iconMCP,
      }).bindPopup(getMarkerMCPPopup({address: 1}))
    },
    show: true,
    addWaypoints: false,
    routeWhileDragging: false,
    fitSelectedRoutes: false,
    showAlternatives: false,
  })

  return instance
}

const RoutingMachine = createControlComponent(createRoutineMachineLayer)

export default RoutingMachine
