import { FaChartArea, FaBars } from "react-icons/fa";
import { BsFillCalendarWeekFill, BsFillCalendarCheckFill, BsFillBellFill, BsPersonCircle, BsPersonFill, BsFillPersonLinesFill } from "react-icons/bs";
import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import '../css/Navbar.css'
import { fetchUserData } from './ApiService'
// import Notification from "./Notification";
import { NotificationContext } from './NotificationContext';

const handleLogoutChange = (e) => {
    localStorage.removeItem('token');
    document.location.href = "/login";
};

const Navbar = () => {
    const [activePage, setActivePage] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const notifications = Notification({ events }); // Use the `Notification` component

    const [notifications] = useContext(NotificationContext);

    // console.log(notifications);
    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const apiData = await fetchUserData();
                setData(apiData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchDataFromApi();
    },
        []);

    return (
        <>
            <header>
                {/* Sidebar */}
                <div id="sidebarMenu" className="sidebar d-lg-block bg-white">
                    <div className="position-sticky">
                        <div className="list-group list-group-flush mx-3 mt-4">
                            <Link
                                to="/"
                                className={`list-group-item list-group-item-action py-2 ripple ${activePage === 'scheduler' ? 'active' : ''}`}
                                onClick={() => setActivePage('scheduler')}
                            >
                                <i className="me-3"><BsFillCalendarWeekFill /></i>
                                <span className="sidebar-item-text">Scheduler</span>
                            </Link>

                            <Link
                                to="/profile"
                                className={`list-group-item list-group-item-action py-2 ripple ${activePage === 'profile' ? 'active' : ''}`}
                                onClick={() => setActivePage('profile')}
                            >
                                <i className="fas fa-chart-area fa-fw me-3"><BsFillPersonLinesFill /></i>
                                <span className="sidebar-item-text">Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Sidebar */}

                {/* Navbar */}
                <div id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
                    {/* Container wrapper */}
                    <div className="container-fluid">

                        {/* Brand */}
                        <Link className="navbar-brand" to="/">
                            <img
                                src="https://logos-download.com/wp-content/uploads/2020/07/Acuity_Scheduling_Logo.png"
                                height="20"
                                alt="MDB Logo"
                                loading="lazy"
                            />
                        </Link>

                        {/* Right links */}
                        <ul className="navbar-nav ms-auto d-flex flex-row">
                            {/* Notification dropdown */}

                            <li className="nav-item dropdown">
                                <a className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <BsFillBellFill />
                                    {notifications.length > 0 && (
                                        <span className="badge badge-notification rounded-pill bg-danger">
                                            {notifications.length}
                                        </span>
                                    )}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification, index) => (
                                            <li key={index}>
                                                <a className="dropdown-item" href="#">{notification}</a>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <a className="dropdown-item" href="#">No notifications</a>
                                        </li>
                                    )}
                                </ul>
                            </li>


                            {/* Avatar */}
                            <li className="nav-item dropdown">
                                <a className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        height="30"
                                        width="33"
                                        alt="Profile Pircture"
                                        loading="lazy"
                                    /><span>{data?.nombre || <div className="spinner-border text-info spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className={`dropdown-item ${activePage === 'profile' ? 'active' : ''}`} to="/profile" onClick={() => setActivePage('profile')}>Profile</Link></li>
                                    <li><a className="dropdown-item" role="button" onClick={handleLogoutChange}>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* Container wrapper */}
                </div>
                {/* Navbar */}
            </header>
            {/* Main Navigation */}

            {/* Main layout */}
            <main style={{ marginTop: '58px' }}>
                <div className="main-content p-4">
                    <Outlet />
                </div>
            </main>
            {/* Main layout */}
        </>
    );
}
export default Navbar;
