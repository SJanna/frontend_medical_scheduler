import React, { useState, useEffect, useContext, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import esLocale from '@fullcalendar/core/locales/es';
import AppointmentForm from './AppointmentForm';
import '../css/BoxForm.css';
import { fetchAppointmentsData, fetchUserData } from './ApiService';
import { NotificationContext } from './NotificationContext';
import RatingForm from './RatingForm';
import axios from 'axios';


const MyCalendar = () => {
  const todayDate = moment().startOf("day");
  const TODAY = todayDate.format("YYYY-MM-DD");
  const apiUrl = 'http://127.0.0.1:8000';

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedEventToRate, setSelectedEventToRate] = useState(null);

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [currentUserAppointments, setCurrentUserAppointments] = useState([]);
  const [otherUserAppointments, setOtherUserAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useContext(NotificationContext);
  const hasRun = useRef(false);

  const checkEventExpiration = async () => {
    console.log('Checking Expiration');
    try {
      const expiredEvents = events.filter((event) => {
        const eventDateTime = moment(event.start);
        const now = moment();
        return eventDateTime.isBefore(now);
      });

      for (const event of expiredEvents) {
        await axios.patch(`${apiUrl}/citas/${event.id}/`, { activa: false }, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
      }

      // Actualizar los eventos después de cambiar el valor de "activa"
      const updatedEvents = events.map((event) => {
        if (expiredEvents.some((expiredEvent) => expiredEvent.id === event.id)) {
          return { ...event, activa: false };
        }
        return event;
      });

      setEvents(updatedEvents);
    } catch (error) {
      console.log('Error updating events:', error);
      // Mostrar notificación de error
    }
  };

  useEffect(() => {
    checkEventExpiration();
  }, []);




  useEffect(() => {
    let newNotifications = [];
    console.log(currentUserAppointments);
    currentUserAppointments.forEach((appointment) => {
      const eventDateTime = moment(appointment.fecha_hora);
      const now = moment();

      const maxDateTime = now.clone().add(1, 'day');

      if (eventDateTime.isBetween(now, maxDateTime, 'hour', '[]')) {
        newNotifications.push(`You have an appointment in less than 24 hours in ${appointment.sede}\n`);
      }
    });

    setNotifications(newNotifications);
    hasRun.current = true;
  }, [currentUserAppointments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);

        const appointmentsData = await fetchAppointmentsData();
        setAppointments(appointmentsData);

        // const currentUserAppointments = appointmentsData.filter(appointment => appointment.persona === userData.id && appointment.activa === true);
        const currentUserAppointments = appointmentsData.filter(appointment => appointment.persona === userData.id);

        setCurrentUserAppointments(currentUserAppointments);

        const otherUserAppointments = appointmentsData.filter(appointment => appointment.persona !== userData.id && appointment.activa === true);
        setOtherUserAppointments(otherUserAppointments);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
  // Filtrar las citas activas y no activas del usuario actual
  const activeAppointments = currentUserAppointments.filter(appointment => appointment.activa);
  const inactiveAppointments = currentUserAppointments.filter(appointment => !appointment.activa);

  // Crear eventos formateados para las citas activas
  const activeEvents = activeAppointments.map(appointment => ({
    title: appointment.descripcion,
    start: appointment.fecha_hora,
    end: appointment.fecha_hora,
    id: appointment.id,
    // color: 'green' // Color para citas activas
  }));

  // Crear eventos formateados para las citas no activas
  const inactiveEvents = inactiveAppointments.map(appointment => ({
    title: 'Completed',
    start: appointment.fecha_hora,
    end: appointment.fecha_hora,
    id: appointment.id,
    // display: 'background',
    color: '#ffcccb' // Color para citas no activas
  }));
    const formattedEventsOtherUsers = otherUserAppointments.map(appointment => ({
      title: '',
      start: appointment.fecha_hora,
      end: appointment.fecha_hora,
      display: 'background',
      color: 'black'
    }));

    const newEvents = activeEvents.concat(formattedEventsOtherUsers).concat(inactiveEvents);
    setEvents(newEvents);
  }, [currentUserAppointments, otherUserAppointments]);

  const [selectedEventInfo, setSelectedEventInfo] = useState({ event: null, x: 0, y: 0, startDate: null });

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }

  const handleEventClick = (info) => {
    if (info.event) {
      const eventDateTime = moment(info.event.start);
      const now = moment();

      if (eventDateTime.isBefore(now)) {
        setSelectedEventToRate(info.event);
        setShowRatingForm(true);
      } else {
        if (window.confirm("Are you sure you want to delete this event?")) {
          // Assuming there is an API endpoint to delete an appointment
          console.log(info.event);
          deleteAppointment(info.event);
        }
      }
    }
  }

  // const handleEventContextMenu = (info) => {
  //   if (info.event) {
  //     setSelectedEventToRate(info.event);
  //     setShowRatingForm(true);
  //   }
  // }

  const deleteAppointment = async (event) => {
    try {
      console.log(event.id);
      // Assuming there is an API endpoint to update an appointment
      await axios.patch(`${apiUrl}/citas/${event.id}/`, { activa: false }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      window.location.reload()
    } catch (error) {
      alert('Error updating appointment:', error);
      // Show error notification
    }
  }


  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5], // días de la semana (lunes a viernes)
    startTime: '09:00', // hora de inicio
    endTime: '18:00' // hora de finalización
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
        }}
        initialView="dayGridMonth"
        initialDate={TODAY}
        editable={true}
        dayMaxEvents={true}
        navLinks={true}
        events={events}
        eventContent={renderEventContent}
        height={800}
        contentHeight={780}
        aspectRatio={3}
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        views={{
          dayGridMonth: { buttonText: "Month" },
          timeGridWeek: { buttonText: "Week" },
          timeGridDay: { buttonText: "Day" }
        }}
        businessHours={businessHours}
        select={(info) => {
          let startDate = info.startStr;
          if (startDate.includes('T')) {
            startDate = startDate.slice(0, 16);
          } else {
            startDate += 'T12:00';
          }

          setSelectedEventInfo({
            event: info,
            x: info.jsEvent.pageX,
            y: info.jsEvent.pageY,
            startDate: startDate
          });
        }}
        eventClick={handleEventClick}
        timeZone="America/Bogota"
        hiddenDays={[0, 6]}
        slotMinTime="05:00" // Hora mínima permitida, ej: 08:00
        slotMaxTime="20:00" // Hora máxima permitida, ej: 18:00
      />

      {selectedEventInfo.event &&
        <div className='box-form' style={{ top: selectedEventInfo.y, left: selectedEventInfo.x }}>
          <AppointmentForm
            selectedEventInfo={selectedEventInfo}
            closeForm={() => setSelectedEventInfo({ event: null, x: 0, y: 0, startDate: null })}
            startDate={selectedEventInfo.startDate}
            addEvent={addEvent}
          />
        </div>
      }

      {showRatingForm && selectedEventToRate &&
        <div className='box-form' style={{ top: selectedEventInfo.y, left: selectedEventInfo.x }}>
          <RatingForm
            selectedEvent={selectedEventToRate}
            closeForm={() => {
              setShowRatingForm(false);
              setSelectedEventToRate(null);
            }}
          />
        </div>
      }
    </>
  );
};

function renderEventContent(eventInfo) {
  let { event } = eventInfo;

  return (
    <>
      <div>
        <div>{event.title}</div>
        <div>{event.extendedProps.description}</div>
      </div>
    </>
  );
}

export default MyCalendar;
