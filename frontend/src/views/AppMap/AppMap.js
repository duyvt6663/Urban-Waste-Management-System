/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
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

const MCP_LIST = '/map/'
const ROUTE_LIST = '/map/route/'
const position = [10.7724483, 106.6582936];

const maps = {
  base: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};

// const AppMap = () => {
//   //Set initial state for the map
//   const [map, setMap] = useState(null);

//   return (
//     <>
//       <MapContainer
//         center={position}
//         zoom={16}
//         whenReady={map => setMap(map)}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url={maps.base}
//         />
//         {
//           routeArray.map((x, index) => (
//             <RoutineMachine routeInfo={x} key={index} />
//           ))
//         }
//       </MapContainer>
//     </>
//   )
// }

const depot={
  latitude: 10.811756,
  longtitude: 106.628212
};
const treat={
  latitude: 10.810676,
  longtitude: 106.625786
};

const AppMap3 = () => {
  const axiosPrivate = useAxiosPrivate()
  //Set initial state for the map
  const [Markers, setMarker] = useState(null)
  const [MCPs, setMCPs] = useState([])
  const [Routes, setRoute] = useState([])
  const [map, setMap] = useState(null)
  const [optimizePoints, setOptimizePoints] = useState([])
  const chosenPoints = optimizePoints.map((pnt) => {
    return (
      <div key={pnt.MCP_id}>
        <span>MCP ID: {pnt.MCP_id}</span>
        <CButton color="primary" onClick={() => handleRemove(pnt.MCP_id)}>
          Remove
        </CButton>
      </div>
    )
  })

  function handleRemove(MCP_id) {
    setOptimizePoints((prev) => {
      const ids = prev.map((elem) => elem.MCP_id)
      const index = ids.indexOf(MCP_id)

      return index === -1 ? prev : prev.slice(0, index).concat(prev.slice(index + 1, prev.length))
    })
  }

  function process(data) {
    data[0].push(depot)
    data[0].push(treat)
    return data[0].map((point) => (
        <>
          <Marker key={point.asset_id} position={[point.latitude, point.longtitude]} >
            <Popup>
              <CListGroup>
                <CListGroupItem>ID: {point.asset_id}</CListGroupItem>
                <CListGroupItem>Load: {point.load}</CListGroupItem>
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
    for(let i = 0; i < data['ordered_MCPs'].length; ++i) {
      let temp = MCPs.filter(mcp => mcp.asset_id === data['ordered_MCPs'][i])[0]
      res.push({
        latitude: temp.latitude,
        longtitude: temp.longtitude,
        id: temp.asset_id
      })
    }
    console.log(res)
    setMarker(<Routing routeInfo={res} key={id} />)
  }

  const handleAdd = (point) => {
    setOptimizePoints((prev) => {
      const included = prev.some((elem) => elem.MCP_id === point.MCP_id)
      if (included) return prev

      return [...prev, { latitude: point.lati, longtitude: point.longti, MCP_id: point.MCP_id }]
    })
  }

  const handleSubmit = () => {}

  const handleReset = () => {
    setOptimizePoints([])
  }
  useEffect(()=>{
    const getMCPs = async () => {
      try {
          const response = await axiosPrivate.get(MCP_LIST);
          // console.log(response);
          setMCPs(response.data[0])
          setMarker(process(response.data))
      } catch (err) {
          console.error(err);
      }
    }
    const getRoutes = async () => {
      try {
        const response = await axiosPrivate.get(ROUTE_LIST);
        // console.log(response);
        setRoute(response.data)
      } catch (err) {
          console.error(err);
      }
    }
    getMCPs();
    getRoutes();
  },[])

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
            <CRow>
              <CButtonGroup>
                <CButton color="primary" onClick={handleSubmit}>
                  Submit
                </CButton>

                <CButton color="primary" onClick={handleReset}>
                  Reset
                </CButton>
              </CButtonGroup>
            </CRow>
            <CRow>
              <CListGroup>
                {Routes.map(x => (
                  <CButton key = {x.id} variant='outline' color='danger' onClick={()=>handleClickRoute(x.id)}>
                    route {x.id}
                  </CButton>
                ))}
              </CListGroup>
            </CRow>
            <CRow className="pickedList">
              <CCallout color="success">Picked MCP List</CCallout>
              {chosenPoints}
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}


export default AppMap3
