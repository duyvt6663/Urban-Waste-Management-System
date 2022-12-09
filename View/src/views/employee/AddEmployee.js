/* eslint-disable prettier/prettier */
import React from 'react'
import './style.css'
import 'react-datepicker/dist/react-datepicker.css'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import EmployeeForm from './EmployeeForm'

const ADD_EMPLOYEE = '/account/employee/'
const AddEmployee = () => {

    const axiosPrivate = useAxiosPrivate()

    const handleAddEmployee = (data) => {
        const birth = new Date(data.birth).toISOString().split('T')[0]  // convert to yyyy-mm-dd
        data.birth = birth

        const createUser = async () => {
            const response = await axiosPrivate.post(ADD_EMPLOYEE, data)
            if (response) toast.success("Employee added successfully.")
            else toast.error("Username or email have been used")
        }
        createUser()
    }

    return (
        <EmployeeForm 
            onSubmit={handleAddEmployee}
        />
    )
}

export default AddEmployee
