import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchUserData } from './ApiService'
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons';

const FormDataComponent = ({ startDate, addEvent, closeForm }) => {
    // State hook for user data
    const [userData, setUserData] = useState(null);
    // useEffect hook for fetching user data when the component mounts
    useEffect(() => {
        const fetchUserDataFromApi = async () => {
            try {
                const userApiData = await fetchUserData();
                // Set user data from the API to the state
                setUserData(userApiData);
            } catch (error) {
                console.log(error);
            }
        };

        // Invoke the function to fetch user data
        fetchUserDataFromApi();
    }, []);

    // useEffect hook for updating form data when user data changes
    useEffect(() => {
        if (userData) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                persona: userData.id,
            }));
        }
    }, [userData]);

    // Update formData whenever startDate changes, independent of userData
    useEffect(() => {
        if (startDate) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                fecha_hora: startDate,
            }));
        }
    }, [startDate]);

    // State hook for form data
    const [formData, setFormData] = useState({
        sede: '',
        fecha_hora: '',
        descripcion: '',
        activa: true,
        persona: null,
    });

    // State hooks for loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [apiError, setApiError] = useState('');

    // Function for handling changes in the input fields
    const handleInputChange = (event) => {
        const { id, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        // Update form data with new input values
        setFormData({ ...formData, [id]: inputValue });
    };

    const [isSuccess, setIsSuccess] = useState(false);

    // Function for handling form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsError(false);

        // Post form data to the API
        axios.post('http://127.0.0.1:8000/citas/', formData, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                // console.log(response.data); // Handle the API response
                setIsLoading(false);
                setIsSuccess(true);

                // Add the new event to the calendar.
                const newEvent = {
                    title: response.data.sede, // Replace with the actual title you want for the event
                    start: formData.fecha_hora, // This should be the date/time string in the correct format
                    // You may also want to add 'end', 'allDay', 'url', 'className', etc.
                };
                addEvent(newEvent);
            })
            .catch((error) => {
                console.error(error);
                // Handle API error
                setApiError(error.response?.data[0] || 'Error desconocido');
                setIsLoading(false);
                setIsError(true);
            });
    };

    function close(){
        
    }

    return (
        <div className="outside-layout-form row justify-content-center aling-items-center">
            <div className="inside-layout-form m-5 col-auto p-5 shadow p-3 mb-5 rounded">

                <div className='close' onClick={closeForm}><a href="#" style={{textDecoration:'none'}}>X</a></div>
                <form onSubmit={handleSubmit}>
                    <div className="text-center mb-3">
                        <p>Schedule appointment:</p>
                    </div>

                    {/* Sede input */}
                    <div className="form-outline mb-4">
                        <input
                            required
                            type="text"
                            id="sede"
                            className="form-control"
                            placeholder="Sede"
                            value={formData.sede}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Fecha y hora input */}
                    <div className="form-outline mb-4">
                        <input
                            required
                            type="datetime-local"
                            id="fecha_hora"
                            className="form-control"
                            placeholder="Fecha y Hora"
                            value={formData.fecha_hora}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Descripción input */}
                    <div className="form-outline mb-4">
                        <input
                            required
                            type="text"
                            id="descripcion"
                            className="form-control"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        />
                    </div>

                    {isError && (
                        <div className="alert alert-danger" role="alert">
                            {apiError}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="alert alert-success" role="alert">
                            Appointment successful
                        </div>
                    )}

                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary btn-block mb-4" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Schedule'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormDataComponent;
