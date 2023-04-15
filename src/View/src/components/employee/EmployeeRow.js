/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    CAvatar,
    CButton,
    CCardTitle,
    CCardSubtitle,
    CCardText,
    CCardLink,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormLabel,
    CFormInput,
    CFormText,
    CCollapse,
    CBadge,
    CImage,
} from '@coreui/react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
} from '@coreui/icons'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const EmployeeRow = (props) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    const handleViewTask = (e) => {
        e.preventDefault()
        navigate(`/employee/profile/${props.user.id}`);
    }
    const handleUpdate = (e) => {
        e.preventDefault()
        navigate(`/employee/update/${props.user.id}`);
    }
    const handleSchedule = (e) => {
        e.preventDefault()
        navigate(`/employee/schedule/${props.user.id}`);
    }

    return (
        <>
            <CTableRow v-for="item in tableItems" key={props.index}>
                <CTableDataCell>
                    <div>#{props.user.id}</div>
                    <div className="small text-medium-emphasis">
                        {/* <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                    {item.user.registered} */}
                    </div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                    <div>{props.user.name}</div>
                </CTableDataCell>
                <CTableDataCell>
                    {<div>{props.user.is_collector ? 'collector' : 'janitor'}</div>}
                </CTableDataCell>
                <CTableDataCell>
                    <div>{props.user.phone}</div>
                    <div>{props.user.email}</div>
                </CTableDataCell>
                <CTableDataCell>
                    <div>{props.user.start_date}</div>
                </CTableDataCell>
                <CTableDataCell>{props.user.is_active}</CTableDataCell>
                <CTableDataCell>
                    <CButton color="primary" variant="outline" onClick={() => setVisible(!visible)}>
                        Show
                    </CButton>
                </CTableDataCell>
            </CTableRow>
            <CTableRow>
                <CTableDataCell colSpan={100} className="p-0">
                    <CCollapse visible={visible}>
                        <div className="d-flex info-container">
                            <div className="avatar-container">
                                <CImage
                                    src="https://cdn.tgdd.vn/Products/Images/7264/238383/mww-ms055-01-nam-1-600x600.jpg"
                                    width={200}
                                    height={200}
                                ></CImage>
                            </div>
                            <div className="detail-container">
                                <h4>{props.user.name}</h4>
                                <p>User since: {props.user.start_date}</p>
                                <CButton size="sm" color="info" className="text-white mr-5 update-btn"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </CButton>
                                <CButton size="sm" color="danger" className="text-white delete-btn">
                                    Delete
                                </CButton>
                                <br />
                                <CButton size="sm" color="warning" className="text-white assign-btn" id={props.user.id} disabled={!props.user.is_collector} onClick={(e) => handleViewTask(e)}>
                                    View Work Location
                                </CButton>
                                <CButton size="sm" color="warning" className="text-white assign-btn" id={props.user.id} onClick={(e) => handleSchedule(e)}>
                                    View Schedule
                                </CButton>
                            </div>
                        </div>
                    </CCollapse>
                </CTableDataCell>
            </CTableRow>
        </>
    )
}

export default EmployeeRow
