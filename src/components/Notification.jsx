// import { useState, useEffect } from 'react';

// const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
// const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

// const Notification = ({ events }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const now = new Date();
//     const newNotifications = events
//       .map(event => {
//         const appointmentDate = new Date(event.start);
//         const timeToAppointment = appointmentDate.getTime() - now.getTime();

//         if (timeToAppointment < ONE_DAY && timeToAppointment > 0) {
//           // If appointment is within next 24 hours, add to notifications
//           return `Tienes una cita próxima: ${event.title} a las ${appointmentDate.toLocaleTimeString()}`;
//         } else if (timeToAppointment < ONE_HOUR && timeToAppointment > 0) {
//           // If appointment is within next hour, add to notifications
//           return `Tu cita ${event.title} es en menos de una hora a las ${appointmentDate.toLocaleTimeString()}`;
//         }
//         return null;
//       })
//       .filter(Boolean); // Remove null values

//     setNotifications(newNotifications);
//   }, [events]);

//   return notifications;
// };

// export default Notification;


