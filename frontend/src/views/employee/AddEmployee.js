/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import './style.css'
import {
  CAvatar,
  CButton,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCardLink,
  CButtonGroup,
  CFormSelect,
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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { axiosPrivate } from 'src/api/axios'
import moment from 'moment/moment'
import { Alert } from '@coreui/coreui'

const ADD_EMPLOYEE = '/account/employee/'

const AddEmployee = () => {
  const [inputs, setInputs] = useState({role: 0, salary: 0})
  const [selectedDate, setSelectedDate] = useState(null)
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log({ ...inputs, birth: moment(selectedDate).format('YYYY-MM-DD') })

    const addEmployee = async () => {
      try {
        const response = await axiosPrivate.post(ADD_EMPLOYEE, {
          ...inputs,
          birth: moment(selectedDate).format('YYYY-MM-DD'),
        })
        if(response) {
          Alert("Add new employee successfully")
        }
      } catch (err) {
        alert(err.message)
      }
    }

    addEmployee()
  }

  return (
    <section className="add-employee-section">
      <CRow>
        <CCol xs>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <span>Add Employee</span>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      label="Employee Name"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      label="Username"
                      name="username"
                      placeholder="Username"
                      onChange={handleChange}
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="email"
                      id="exampleFormControlInput1"
                      label="Email Contact"
                      name="email"
                      placeholder="name@example.com"
                      // text="Must be 8-20 characters long."
                      onChange={handleChange}
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="tel"
                      id="exampleFormControlInput1"
                      pattern="[0-9]*" 
                      label="Phone"
                      name="phone"
                      placeholder="Employee Phone"
                      onChange={handleChange}
                    />
                  </CForm>
                </CCol>
                <CCol lg={2}>
                  <CFormSelect
                    aria-label="Role"
                    name="role"
                    label="Role"
                    onChange={(e) => setInputs((values) => ({ ...values, role: parseInt(e.target.value) }))}
                    options={[
                      { label: 'Janitor', value: '0' },
                      { label: 'Collector', value: '1' },
                    ]}
                  />
                </CCol>
              </CRow>
              {/* <CRow>
                <CCol md={4}>
                  <CFormSelect id="inputState" label="City">
                    <option>Choose...</option>
                    <option>...</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect id="inputState" label="District">
                    <option>Choose...</option>
                    <option>...</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect id="inputState" label="Ward">
                    <option>Choose...</option>
                    <option>...</option>
                  </CFormSelect>
                </CCol>
              </CRow> */}
              <CRow>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="password"
                      id="exampleFormControlInput1"
                      label="Password"
                      name="password"
                      placeholder="Employee Address"
                      onChange={handleChange}
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      label="Address"
                      name="address"
                      placeholder="Employee Address"
                      onChange={handleChange}
                      aria-describedby="exampleFormControlInputHelpInline"
                    />
                  </CForm>
                </CCol>
                <CCol lg={2}>
                  <label className="form-label">Birthday</label>
                  <div className="App">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText={'dd/mm/yyyy'}
                      showYearDropdown={true} // year show and scrolldown alos
                      scrollableYearDropdown
                      className="form-select"
                    />
                  </div>
                </CCol>
                <CCol lg={2}>
                  <CFormSelect
                    aria-label="Gender"
                    name="gender"
                    label="Gender"
                    onChange={handleChange}
                    options={[
                      'Gender',
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ]}
                  />
                </CCol>
                <CCol lg={2}>
                  <CFormInput
                    type="numbder"
                    id="exampleFormControlInput1"
                    label="Salary"
                    name="salary"
                    placeholder={0}
                    onChange={handleChange}
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CCol>
              </CRow>
              {/* <CRow className="file-submit">
                <CCol md={6}>
                  <CFormInput type="file" id="formFile" label="Your Avatar" />
                </CCol>
              </CRow> */}
              <CRow>
                <CCol>{errMsg && <p>errMsg</p>}</CCol>
              </CRow>
              <CRow>
                <div className="d-flex justify-content-end mt-4">
                  <div className="w-10 ">
                    <CButton color="primary" size="sm" onClick={(e) => handleSubmit(e)}>
                      Add employee
                    </CButton>
                  </div>
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </section>
  )
}

export default AddEmployee
