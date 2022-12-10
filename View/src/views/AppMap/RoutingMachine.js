/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import { useMap } from "react-leaflet"
import depot from '../../assets/images/icons/Depot.png'
import mcp from '../../assets/images/icons/recycling-place.png'
import treat from '../../assets/images/icons/recycling-plant.png'
import truck from '../../assets/images/icons/truck.png'
import { checkIsDepot, checkIsTreat } from 'src/utils/utils'
import PropTypes from 'prop-types'
import { DEPOT, TREAT } from './AppMap'


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
const iconTRUCK = L.icon({
    iconUrl: truck,
    iconSize: [35, 35],
})
export { iconDEPOT, iconTREAT, iconMCP }

const getLinePopUp = (params) => {
    return `
    <div><strong>ID:</strong> ${params.id}</div>
    <div><strong>Load:</strong> ${params.load} kg</div>
    <div><strong>Distance:</strong> ${params.distance / 1000} km</div>
  `
}
const getMarkerMCPPopup = (params) => {
    return `
    <div><strong>ID:</strong> ${params.asset_id}</div>
    <div><strong>Load:</strong> ${params.load} kg</div>
    <div><strong>Filled:</strong> ${params.percentage * 100} %</div>
    <div><strong>Population:</strong> ${params.pop_density} p/sq.km</div>
    <div><strong>Janitors:</strong> ${params.janitor_count} p</div>
  `
}


const Routing = ({ routeInfo, route, ...props }) => {
    const map = useMap();
    function getRoute(x) {
        let res = []
        res.push(L.latLng(DEPOT.latitude, DEPOT.longtitude))
        for (let i = 0; i < x.length; ++i)
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
                addWaypoints: false,
                styles: [{ color: "#FD4F4F", weight: 4 }]
            },
            createMarker: (i, waypoint, n) => {
                if (i == 0) {
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: iconDEPOT,
                    })
                }
                else if (i == n - 1) {
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: iconTREAT,
                    })
                }
                return L.marker(waypoint.latLng, {
                    draggable: true,
                    icon: iconMCP,
                }).bindPopup(getMarkerMCPPopup(routeInfo[i - 1]))
            },
            routeLine: function (road) {
                let line = L.Routing.line(road, {
                    addWaypoints: false
                })
                line.eachLayer((l) => {
                    l.bindPopup(getLinePopUp(route))
                })
                return line
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
    routeInfo: PropTypes.arrayOf(PropTypes.element),
    route: PropTypes.object
}
export default Routing

const SimulatorRouting = ({ op, veh, ro, ...props }) => {
    const smap = useMap()
    const [vehicle, setVehicle] = useState(veh)
    const vmarker = L.marker([vehicle.latitude, vehicle.longtitude], { icon: iconTRUCK }).addTo(smap)
    const [oproute, setRoute] = useState(op)
    const index = 0
    const [indox, setIndox] = useState(0)
    const [rControl, setRControl] = useState(null)

    function getRoute(x) {
        let res = []
        res.push(L.latLng(DEPOT.latitude, DEPOT.longtitude))
        for (let i = 0; i < x.length; ++i)
            res.push(L.latLng(x[i].latitude, x[i].longtitude))
        res.push(L.latLng(TREAT.latitude, TREAT.longtitude))
        return res
    }
    const waypointss = getRoute(oproute) // set up the full route

    useEffect(() => {
        if (!smap) return
        setRControl(L.Routing.control({
            waypoints: waypointss,
            lineOptions: {
                addWaypoints: false,
                styles: [{ color: "#FD4F4F", weight: 4 }]
            },
            createMarker: (i, waypoint, n) => {
                if (i == 0) {
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: iconDEPOT,
                    })
                }
                else if (i == n - 1) {
                    return L.marker(waypoint.latLng, {
                        draggable: true,
                        icon: iconTREAT,
                    })
                }
                return L.marker(waypoint.latLng, {
                    draggable: true,
                    icon: iconMCP,
                }).bindPopup(getMarkerMCPPopup(oproute[i - 1]))
            },
            routeLine: function (road) {
                let line = L.Routing.line(road, {
                    addWaypoints: false
                })
                line.eachLayer((l) => {
                    l.bindPopup(getLinePopUp(ro))
                })
                return line
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: false,
            showAlternatives: false,
        }).addTo(smap))
    }, [smap])

    useEffect(() => {
        if (indox >= oproute.length) return
        smap.removeControl(rControl)
        setRControl(prev => {
            return prev.on('routesfound', function (e) {
                // find the stoppoint
                let tem = Infinity
                let smp = -1 // waypoint index
                e.routes[0].coordinates.forEach(function (coor, ind) {
                    let dist = coor.distanceTo(waypointss[indox + 1])
                    if (dist < tem) {
                        smp = ind
                        tem = dist
                    }
                })
                // simulate the movement
                for (let i = index; i < smp; ++i) {
                    let coor = e.routes[0].coordinates[i]
                    setTimeout(() => {
                        vmarker.setLatLng([coor.lat, coor.lng])
                    }, 100 * i)
                }
                if (vehicle.capacity - vehicle.load >= oproute[indox].load) {
                    setVehicle(prev => {
                        return {
                            ...prev,
                            load: prev.load + oproute[indox].load
                        }
                    })
                    setRoute(items => {
                        return [
                            ...items.slice(0, indox),
                            {
                                ...items[indox],
                                load: 0
                            },
                            ...items.slice(indox + 1)
                        ]
                    })
                }
                else {
                    setRoute(items => {
                        return [
                            ...items.slice(0, indox),
                            {
                                ...items[indox],
                                load: items[indox].load - vehicle.capacity + vehicle.load
                            },
                            ...items.slice(indox + 1)
                        ]
                    })
                    setVehicle(prev => {
                        return {
                            ...prev,
                            load: prev.capacity
                        }
                    })

                }
                index = smp + 1
                indox += 1

            }).addTo(smap)
        })
    }, [indox])
}
SimulatorRouting.propTypes = {
    op: PropTypes.arrayOf(PropTypes.element),
    veh: PropTypes.object,
    ro: PropTypes.object
}
export { SimulatorRouting }
