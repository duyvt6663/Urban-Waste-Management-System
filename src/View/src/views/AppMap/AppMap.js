/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Routing from './RoutingMachine';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import mcp from '../../assets/images/icons/recycling-place.png';
import axios from 'axios';
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CButtonGroup,
    CCallout,
    CListGroup,
    CListGroupItem,
} from '@coreui/react';
import routes from 'src/routes';
import { iconDEPOT, iconTREAT, iconMCP } from './RoutingMachine'
import { checkIsDepot, checkIsTreat } from 'src/utils/utils';

const MCP_LIST = '/map/'
const ROUTE_LIST = '/map/route/'
const position = [10.7724483, 106.6582936];

const maps = {
    base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

const DEPOT = {
    latitude: 10.811756,
    longtitude: 106.628212
}
const TREAT = {
    latitude: 10.810676,
    longtitude: 106.625786
}
export { DEPOT, TREAT }

const AppMap3 = () => {
    const axiosPrivate = useAxiosPrivate()
    //Set initial state for the map
    const [Markers, setMarker] = useState(null)
    const [MCPs, setMCPs] = useState([])
    const [Routes, setRoute] = useState([])
    const [map, setMap] = useState(null)
    const [chosenPoints, setChosenPoints] = useState([])

    useEffect(() => {
        const getMCPs = async () => {
            try {
                const response = await axiosPrivate.get(MCP_LIST);
                setMCPs(response.data[0])
                setMarker(createMarker(response.data[0]))
            } catch (err) {
                console.error(err);
            }
        }
        const getRoutes = async () => {
            try {
                const response = await axiosPrivate.get(ROUTE_LIST);
                setRoute(response.data)
            } catch (err) {
                console.error(err);
            }
        }
        getMCPs();
        getRoutes();
    }, [])

    function handleRemove(MCP_id) {
        setChosenPoints((prev) => {
            const ids = prev.map((elem) => elem.MCP_id)
            const index = ids.indexOf(MCP_id)

            return index === -1 ? prev : prev.slice(0, index).concat(prev.slice(index + 1, prev.length))
        })
    }

    function getIcon(Lat, Lng) {
        if (checkIsDepot(Lat, Lng)) {
            return iconDEPOT
        }
        else if (checkIsTreat(Lat, Lng)) {
            return iconTREAT
        }
        return iconMCP
    }

    function createMarker(data) {
        data.push(DEPOT)
        data.push(TREAT)
        return data.map((point) => (
            <>
                <Marker key={point.asset_id} position={[point.latitude, point.longtitude]} icon={getIcon(point.latitude, point.longtitude)} >
                    <Popup>
                        <CListGroup>
                            <CListGroupItem><strong>ID:</strong> {point.asset_id}</CListGroupItem>
                            <CListGroupItem><strong>Load:</strong> {point.load} kg</CListGroupItem>
                            <CListGroupItem><strong>Filled:</strong> {point.percentage * 100} %</CListGroupItem>
                            <CListGroupItem><strong>Population</strong>: {point.pop_density} p/sq.km</CListGroupItem>
                            <CListGroupItem><strong>Janitors</strong>: {point.janitor_count} p</CListGroupItem>
                            <CButton onClick={() => handleAdd(point)}>Add</CButton>
                        </CListGroup>
                    </Popup>
                </Marker>
            </>
        ))
    }

    async function handleClickRoute(id) {
        const data = await axiosPrivate.get(`${ROUTE_LIST}${id}/`)
            .then(function (response) {
                // I need this data here ^^
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        let res = []
        for (let i = 0; i < data['ordered_MCPs'].length; ++i) {
            let temp = MCPs.filter(mcp => mcp.asset_id === data['ordered_MCPs'][i])[0]
            res.push(temp)
        }
        setMarker(<Routing routeInfo={res} route={Routes.filter((route => { return route.id == id }))[0]} key={id} />)
    }

    const handleAdd = (point) => {
        setChosenPoints((prev) => {
            const included = prev.some((elem) => elem.MCP_id === point.asset_id)
            if (included)
                return prev
            return [...prev, { MCP_id: point.asset_id, longtitude: point.longtitude, latitude: point.latitude }]
        })
    }

    async function handleSubmit() {
        if (chosenPoints.length === 0)
            return
        const data = await axiosPrivate.post(ROUTE_LIST, chosenPoints)
            .then(function (response) {
                // I need this data here ^^
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        let res = []
        for (let i = 0; i < data['ordered_MCPs'].length; ++i) {
            let temp = MCPs.filter(mcp => mcp.asset_id === data['ordered_MCPs'][i])[0]
            res.push(temp)
        }
        setRoute((prev) => {
            return [...prev, { id: data.route_id, distance: data.distance, load: data.load }]
        })
        setChosenPoints([]) // reset chosen points
        setMarker(<Routing routeInfo={res} key={data.route_id} />)
    }

    const handleReset = () => {
        // setOptimizePoints([])
        setMarker(createMarker(MCPs))
        setChosenPoints([])
    }

    async function handleDelete(id) {
        await axiosPrivate.delete(`${ROUTE_LIST}${id}/`)
            .then(function (response) {
                // I need this data here ^^
                console.log(response.data)
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        // delete the row in routes
        setRoute((prev) => {
            return prev.filter((route) => { return route.id != id })
        })
        // reset other render
        handleReset()
    }

    function DisplayChosenPoints() {
        return chosenPoints.map((pnt) => {
            return (
                <div key={pnt.MCP_id}>
                    <span>MCP ID: {pnt.MCP_id}     </span>
                    <CButton color="primary" onClick={() => handleRemove(pnt.MCP_id)} size="sm">
                        Remove
                    </CButton>
                </div>
            )
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
                                <CButton color="primary" onClick={handleSubmit} size="sm">
                                    Create route
                                </CButton>
                            </CCol>
                            <CCol>
                                <CButton color="primary" onClick={handleReset} size="sm">
                                    Reset
                                </CButton>
                            </CCol>
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
                                                <CButton color="primary" onClick={(e) => { e.stopPropagation(); handleDelete(x.id) }} size="sm">
                                                    Delete
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CButton>
                                ))}
                            </CListGroup>
                        </CRow>
                        <CRow className="pickedList">
                            <CCallout color="success">Picked MCP List</CCallout>
                            {DisplayChosenPoints()}
                        </CRow>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}


export default AppMap3

