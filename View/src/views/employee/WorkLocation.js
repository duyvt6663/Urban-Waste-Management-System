// eslint-disable prettier/prettie 
import React, { useEffect, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Routing from '../AppMap/RoutingMachine';
import { iconDEPOT, iconTREAT, iconMCP } from '../AppMap/RoutingMachine'
import { checkIsDepot, checkIsTreat } from 'src/utils/utils';
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
        if (profile && route)
            handleCurrentRoute()
    }, [profile, route])

    // useEffect(() => {

    // }, [route])

    function handleAssign() {
        // pop route table on

    }
    function handleCurrentRoute() {
        // display current route layout
        setMarkers(() => {
            // filter out which MCPs is in current route
            let res = []
            for (let i = 0; i < route.ordered_MCPs.length; ++i)
                res.push(MCPs.filter((mcp) => { return mcp.asset_id == route.ordered_MCPs[i] })[0])
            return <Routing routeInfo={res} route={Routes.filter((route => { return route.id == profile.route_id }))[0]} key={profile.route_id} />
        })
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
                                <CButton color="primary" onClick={handleCurrentRoute} size="sm">
                                    Current route
                                </CButton>
                            </CCol>
                            <CButton color="primary" onClick={handleAssign} size="sm">
                                Assign
                            </CButton>
                            <CButton color="primary" size="sm">
                                Optimize
                            </CButton>
                        </CButtonGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CListGroup>
                        {/* {Routes.map(x => (
                            <CButton key={x.id} size="sm" variant='outline' color='danger' onClick={() => { handleClickRoute(x.id) }}>
                                <CRow>
                                    <CCol>
                                        route {x.id}
                                    </CCol>
                                    <CCol>
                                        <CButton color="primary" onClick={(e) => { e.stopPropagation(); handleDelete(x.id) }} size="sm">
                                            Delete
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CButton>
                        ))} */}
                    </CListGroup>
                </CRow>
            </CContainer >
        </>
    )
}
export default WorkLocation