// eslint-disable prettier/prettie 
import React, { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Routing, { SimulatorRouting } from '../AppMap/RoutingMachine';
// import { iconDEPOT, iconTREAT, iconMCP } from '../AppMap/RoutingMachine'
import { DEPOT, TREAT } from '../AppMap/AppMap'
import { checkIsDepot, checkIsTreat } from 'src/utils/utils';
import L from 'leaflet'
import 'leaflet-routing-machine'
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CButtonGroup,
    CCallout,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'

const EMPLOYEE = '/account/employee/'
const MCP_LIST = '/map/'
const ROUTE_LIST = '/map/route/'
const VEHICLE = '/account/employee/vehicle/'
const position = [10.7724483, 106.6582936]
const maps = {
    base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const WorkLocation = () => {
    const axiosPrivate = useAxiosPrivate()
    const params = useParams()
    const [profile, setProfile] = useState(null)
    const [Markers, setMarkers] = useState(null)
    const [MCPs, setMCPs] = useState([])
    const [Routes, setRoutes] = useState([])
    const [map, setMap] = useState(null)
    const [route, setRoute] = useState(null)

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axiosPrivate.get(`${EMPLOYEE}${params.id}/`)
                setProfile(response.data)
            } catch (err) {
                console.error(err);
            }
        }
        const getMCPs = async () => {
            try {
                const response = await axiosPrivate.get(MCP_LIST);
                setMCPs(response.data[0])

            } catch (err) {
                console.error(err);
            }
        }
        const getRoutes = async () => {
            try {
                const response = await axiosPrivate.get(ROUTE_LIST);
                setRoutes(response.data)
            } catch (err) {
                console.error(err);
            }
        }
        getProfile()
        getMCPs()
        getRoutes()
    }, [])

    useEffect(() => {
        const getRoute = async () => {
            if (profile) {
                try {
                    const response = await axiosPrivate.get(`${ROUTE_LIST}${profile.route_id}/`)
                    setRoute(response.data)
                } catch (err) {
                    console.error(err)
                }
            }
        }
        getRoute()
    }, [profile])

    useEffect(() => {
        if (route)
            handleCurrentRoute()
    }, [route])

    async function handleAssign(id) {
        // pop route table on
        setProfile(prev => {
            return {
                ...prev,
                route_id: id
            }
        })
        // update the assignment back into database
        let res = {
            route_id: id,
            role: 1
        }
        await axiosPrivate.put(`${EMPLOYEE}${params.id}/`, res).then((response) => {
            return response.data
        }).catch((err) => {
            console.log(err)
        })
    }

    async function handleCurrentRoute(k = route, tem = 0) {
        // filter out which MCPs is in current route
        let res = []
        for (let i = 0; i < k.ordered_MCPs.length; ++i)
            res.push(MCPs.filter((mcp) => { return mcp.asset_id == k.ordered_MCPs[i] })[0])
        // display current route layout
        setMarkers(<Routing routeInfo={res} route={Routes.filter((ro => { return k.route_id == ro.id }))[0]} key={k.route_id + 6 + tem} />)
        return res
    }

    async function handleClickRoute(id) {
        const data = await axiosPrivate.get(`${ROUTE_LIST}${id}/`)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        handleCurrentRoute(data)
    }

    async function handleOptimize() {
        // query the optimized current route
        const oproute = await axiosPrivate.get(`${ROUTE_LIST}${route.route_id}/optimize/`)
            .then(function (response) {
                return response.data
            })
            .catch(function (err) {
                console.log(err)
            })
        let res = await handleCurrentRoute(oproute, 1)
        return {
            route: {
                id: oproute.id,
                distance: oproute.distance,
                load: oproute.total_load
            },
            MCPs: res
        }
    }

    const handleSimulator = async () => {

        // query the vehicle
        const vehicle = await axiosPrivate.get(`${VEHICLE}${profile.vehicle_id}/`)
            .then(function (response) {
                return response.data[0]
            })
            .catch(function (err) {
                console.log(err)
            })
        // query the optimized route
        const oproute = await handleOptimize()
        // start the simulator
        setMarkers(<SimulatorRouting op={oproute.MCPs} veh={vehicle} ro={oproute.route} key={vehicle.asset_id} />)
    }

    return (
        <>
            <CContainer fluid>
                <CRow>
                    <CCol lg={9}>
                        <MapContainer center={position} zoom={16} whenReady={(map) => setMap(map)}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url={maps.base}
                            />
                            {Markers}
                        </MapContainer>
                    </CCol>

                    <CCol>
                        <CButtonGroup>
                            <CCol lg={1.2}>
                                <CButton color="primary" onClick={() => handleCurrentRoute()} size="sm">
                                    Current route
                                </CButton>
                            </CCol>
                            <CButton color="primary" onClick={handleOptimize} size="sm">
                                Optimize
                            </CButton>
                            <CButton color="primary" onClick={handleSimulator} size="sm">
                                Simulator
                            </CButton>
                        </CButtonGroup>
                        <CRow>
                            <CListGroup>
                                {Routes.map(x => (
                                    <CButton key={x.id} size="sm" variant='outline' color='danger' onClick={() => { handleClickRoute(x.id) }}>
                                        <CRow>
                                            <CCol>
                                                route {x.id}
                                            </CCol>
                                            <CCol>
                                                <CButton color="primary" onClick={(e) => { e.stopPropagation(); handleAssign(x.id) }} size="sm">
                                                    Assign
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CButton>
                                ))}
                            </CListGroup>
                        </CRow>
                    </CCol>
                </CRow>
            </CContainer >
        </>
    )
}
export default WorkLocation