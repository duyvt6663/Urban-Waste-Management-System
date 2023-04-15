/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import '../style.css'
import {
    CButton,
    CFormSelect,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormInput,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm, Controller } from 'react-hook-form'

const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const isOverEighteen = (date) => getAge(date) >= 18

const EmployeeForm = ({
    onSubmit,
    defaultValues,
    ...props
}) => {

    const { control, handleSubmit } = useForm({defaultValues: defaultValues})
    
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
                                        <Controller
                                            name="name"
                                            rules={{ required: true }}
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="text"
                                                        id="exampleFormControlInput1"
                                                        label="Employee Name"
                                                        placeholder="Name"
                                                        aria-describedby="exampleFormControlInputHelpInline"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />
                                    </CForm>
                                </CCol>
                                <CCol>
                                    <CForm>
                                        <Controller
                                            name="username"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="text"
                                                        id="exampleFormControlInput1"
                                                        label="Username"
                                                        placeholder="Username"
                                                        aria-describedby="exampleFormControlInputHelpInline"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />
                                    </CForm>
                                </CCol>
                                <CCol>
                                    <CForm>
                                        <Controller
                                            name='email'
                                            rules={{
                                                required: true,
                                                pattern: {
                                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    message: 'Invalid email',
                                                },
                                            }}
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="email"
                                                        id="exampleFormControlInput1"
                                                        label="Email Contact"
                                                        placeholder="name@example.com"
                                                        // text="Must be 8-20 characters long."
                                                        aria-describedby="exampleFormControlInputHelpInline"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />
                                    </CForm>
                                </CCol>
                                <CCol>
                                    <CForm>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{
                                                required: true,
                                                pattern: {
                                                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                                    message: "Invalid phone number"
                                                }
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="tel"
                                                        id="exampleFormControlInput1"
                                                        pattern="[0-9]*"
                                                        label="Phone"
                                                        placeholder="Employee Phone"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />
                                    </CForm>
                                </CCol>
                                <CCol lg={2}>
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <CFormSelect
                                                    {...field}
                                                    aria-label="Role"
                                                    name="role"
                                                    label="Role"
                                                    options={[
                                                        { label: 'Janitor', value: false },
                                                        { label: 'Collector', value: true },
                                                    ]}
                                                />
                                                <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                            </>
                                        )}
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
                                        <Controller
                                            name="password"
                                            rules={{ required: true }}
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="password"
                                                        id="exampleFormControlInput1"
                                                        label="Password"
                                                        placeholder="Employee Address"
                                                        aria-describedby="exampleFormControlInputHelpInline"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />

                                    </CForm>
                                </CCol>
                                <CCol>
                                    <CForm>
                                        <Controller
                                            name="address"
                                            rules={{ required: true }}
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <CFormInput
                                                        {...field}
                                                        type="text"
                                                        id="exampleFormControlInput1"
                                                        label="Address"
                                                        placeholder="Employee Address"
                                                        aria-describedby="exampleFormControlInputHelpInline"
                                                    />
                                                    <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                                </>
                                            )}
                                        />

                                    </CForm>
                                </CCol>
                                <CCol lg={2}>
                                    <label className="form-label">Birthday</label>
                                    <div className="App">
                                        <Controller
                                            name="birth"
                                            rules={{
                                                required: true,
                                                validate: isOverEighteen
                                            }}
                                            control={control}
                                            render={({ field: { value, ...fields }, fieldState: { error } }) => (
                                                <>
                                                    <DatePicker
                                                        {...fields}
                                                        selected={value}
                                                        placeholderText={'dd/mm/yyyy'}
                                                        showYearDropdown={true} // year show and scrolldown alos
                                                        scrollableYearDropdown
                                                        className="form-select"
                                                    />
                                                    <span className='error-msg'>
                                                        {error && (error.type === "validate" ? "Must under 18." : (error?.message || "This field is required"))}
                                                    </span>
                                                </>
                                            )}
                                        />
                                    </div>
                                </CCol>
                                <CCol lg={2}>
                                    <Controller
                                        name="gender"
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <CFormSelect
                                                    {...field}
                                                    aria-label="Gender"
                                                    label="Gender"
                                                    options={[
                                                        'Gender',
                                                        { label: 'Male', value: 'male' },
                                                        { label: 'Female', value: 'female' },
                                                    ]}
                                                />
                                                <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                            </>
                                        )}
                                    />
                                </CCol>
                                <CCol lg={2}>
                                    <Controller
                                        name="salary"
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <CFormInput
                                                    {...field}
                                                    type="numbder"
                                                    id="exampleFormControlInput1"
                                                    label="Salary"
                                                    placeholder={0}
                                                    aria-describedby="exampleFormControlInputHelpInline"
                                                />
                                                <span className='error-msg'>{error && (error.message || "This field is required.")}</span>
                                            </>
                                        )}
                                    />
                                </CCol>
                            </CRow>
                            {/* <CRow className="file-submit">
                <CCol md={6}>
                  <Controller 
                    render={({field, fieldState: {error}}) => (

                    )}
                  />

                  <CFormInput
                      {...field}
                   type="file" id="formFile" label="Your Avatar" />
                </CCol>
              </CRow> */}
                            <CRow>
                            </CRow>
                            <CRow>
                                <div className="d-flex justify-content-end mt-4">
                                    <div className="w-10 ">
                                        <CButton color="primary" size="sm"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            {defaultValues ?"Update Employee" : "Add employee" }
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

export default EmployeeForm
