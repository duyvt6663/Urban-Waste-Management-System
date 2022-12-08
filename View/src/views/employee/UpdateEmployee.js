import React, { useLayoutEffect, useState } from "react"
import EmployeeForm from "./EmployeeForm"
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"


const UPDATE_EMPLOYEE = '/account/employee/'
const UPDATE_FIELDS = ['name', 'username', 'email', 'phone', 'role', 
                        'address', 'birth', 'gender', 'salary']

const UpdateEmployee = () => {

    const axiosPrivate = useAxiosPrivate()
    const [employeeDetail, setEmployeeDetail] = useState(null)
    const { id } = useParams()

    useLayoutEffect(() => {
        const getUserDetail = async () => {
            try {
                console.log("fetch")
                const response = await axiosPrivate.get(`${UPDATE_EMPLOYEE}${id}/`)
                if (response) {
                    let userDetail = response.data
                    userDetail['role'] = userDetail['is_collector']
                    // reduce user detail to needed fields
                    const employeeUpdateFields = UPDATE_FIELDS.reduce((prev, cur, index) => {
                        prev[cur] = userDetail[cur]
                        return prev
                    }, {})
                    employeeUpdateFields.birth = new Date(employeeUpdateFields.birth)
                    setEmployeeDetail(employeeUpdateFields)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUserDetail()
    }, [axiosPrivate, id])

    const handleUpdateEmployee = (data) => {
        const birth = new Date(data.birth).toISOString().split('T')[0]
        data.birth = birth

        const updateUser = async () => {
            const response = await axiosPrivate.put(`${UPDATE_EMPLOYEE}${id}/`, data)
            if (response) toast.success("Employee added successfully.")
            else toast.error("Username or email have been used")
        }
        updateUser()
    }

    return (
        <>  
        {employeeDetail && 
            <EmployeeForm 
                onSubmit={handleUpdateEmployee}
                defaultValues={employeeDetail}
                id={id}
            />
        }
        </>
    )
}

export default UpdateEmployee
