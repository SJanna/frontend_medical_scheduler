import React, { useState, useEffect } from 'react';
import '../css/Profile.css'
import { fetchUserData, fetchAppointmentsData } from './ApiService'


const ProfileCard = () => {
    const [showForm, setShowForm] = useState(false);
    //User data
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);

    //Appointments data
    const [appointmentsData, setAppointmentsData] = useState(null);
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [appointmentsError, setAppointmentsError] = useState(null);

    //Appointmets calculations
    const [pendingAppointments, setPendingAppointments] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);
    const [totalAppointments, setTotalAppointments] = useState(0);

    const fetchAppointmentsDataFromApi = async () => {
        try {
            const appointmentsApiData = await fetchAppointmentsData();
            // Filtrar los datos por nombre de usuario
            const filteredAppointmentsData = appointmentsApiData.filter(appointment => appointment.persona === userData?.id);
            setAppointmentsLoading(false);
            setPendingAppointments(filteredAppointmentsData.filter(appointment => appointment.activa === true).length);
            setCompletedAppointments(filteredAppointmentsData.filter(appointment => appointment.activa === false).length);
            setTotalAppointments(filteredAppointmentsData.length);
        } catch (error) {
            setAppointmentsError(error);
            setAppointmentsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserDataFromApi = async () => {
            try {
                const userApiData = await fetchUserData();
                setUserData(userApiData);
                setUserLoading(false);
            } catch (error) {
                setUserError(error);
                setUserLoading(false);
            }
        };

        fetchUserDataFromApi();
    }, []);

    useEffect(() => {
        if (userData) {
            fetchAppointmentsDataFromApi();
        }
    }, [userData]);

    if (userLoading || appointmentsLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <section className="d-flex justify-content-center align-items-center">
                <div className="" style={{ width: '50%' }}>
                        <div className="card" style={{ borderRadius: '15px' }}>
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        className="rounded-circle img-fluid"
                                        style={{ width: '100px' }}
                                        alt="Profile"
                                    />
                                </div>
                                <h4 className="mb-2">
                                    {userData?.nombre}
                                </h4>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-rounded btn-md"
                                    onClick={() => setShowForm(true)}
                                >
                                    View my data
                                </button>
                                <br />
                                <br />
                                {showForm && (

                                    <div className="card mb-4" style={{ width: '100%' }}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Full Name</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{userData?.nombre} {userData?.apellidos}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Email</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{userData?.user.email}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Phone</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{userData?.celular}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <p className="mb-0">Id number</p>
                                                </div>
                                                <div className="col-sm-9">
                                                    <p className="text-muted mb-0">{userData?.numero_identificacion}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="stats d-flex flex-wrap justify-content-between" style={{minWidth:100}}>
                                    <div className='row'>
                                        <p className="mb-2 h5">{pendingAppointments}</p>
                                        <p className="text-muted mb-0 "><span className='text-truncate ' style={{maxWidth:100}}>Pending appointments</span> </p>
                                    </div>
                                    <div className="row">
                                        <p className="mb-2 h5">{completedAppointments}</p>
                                        <p className="text-muted mb-0">Completed appointments</p>
                                    </div>
                                    <div className='row'>
                                        <p className="mb-2 h5">{totalAppointments}</p>
                                        <p className="text-muted mb-0">Total scheduled appointments</p>
                                    </div>
                                </div>
                            </div>
                    </div>
            </div>
        </section>
    );
};

export default ProfileCard;
