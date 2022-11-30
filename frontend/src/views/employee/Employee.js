/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
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
    CImage
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
import './style.css'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import EmployeeRow from 'src/components/employee/EmployeeRow'

const EMPLOYEE_LIST = '/account/employee'

const Employee = () => {
    const axiosPrivate = useAxiosPrivate()
    const [visible, setVisible] = useState(false)
    const [employeeList, setEmployeeList] = useState([])

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(EMPLOYEE_LIST);
                console.log('thinh', response);
            } catch (err) {
                console.error(err);
            }
        }

        getUsers();
    }, [])

  return (
    <section className='employee-section'>
        <CRow>
            <CCol xs>
            <CCard>
                <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <CForm className='row g-3'>
                        <CCol xs="auto" className='d-flex justify-content-between align-items-center'>
                            <CFormLabel htmlFor="searchInput">Filter:</CFormLabel>
                        </CCol>
                        <CCol xs="auto">
                            <CFormInput type="email" id="searchInput" placeholder="Type string..." aria-describedby="searchInput" />
                        </CCol>
                    </CForm>
                    <CButton color="primary" size="small">
                    Add employee
                    </CButton>
                </div>
                </CCardHeader>
                <CCardBody>
                <CTable align="middle" className="mb-0 border" hover responsive striped>
                    <CTableHead color="light">
                    <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                        <CTableHeaderCell>Role</CTableHeaderCell>
                        <CTableHeaderCell>Contact</CTableHeaderCell>
                        <CTableHeaderCell>Hired Date</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell></CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    {employeeList.map((item, index) => (
                        <>
                          <EmployeeRow item={item}></EmployeeRow>
                        </>
                    ))}
                    </CTableBody>
                </CTable>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </section>
  )
}

export default Employee
