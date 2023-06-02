import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000'

export const fetchUserData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/personas/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        const userData = response.data;
        return(userData[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchAppointmentsData = async () => {
    try {
        const response = await axios.get(`${apiUrl}/citas/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        const appointmentsData = response.data;
        return(appointmentsData);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}