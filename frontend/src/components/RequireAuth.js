/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux'

const RequireAuth = ({ allowedRoles }) => {
    const user = useSelector((state) => state.user)
    const location = useLocation();

    return (
        user?.user
                ? <Outlet />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;