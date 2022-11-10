import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import "components/Appointment";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

// const appointments = {
//   "1": {
//     id: 1,
//     time: "12pm",
//   },
//   "2": {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 3,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   "3": {
//     id: 3,
//     time: "2pm",
//   },
//   "4": {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Archie Andrews",
//       interviewer: {
//         id: 4,
//         name: "Cohana Roy",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   "5": {
//     id: 5,
//     time: "4pm",
//   }
// };



export default function Application(props) {
  //const [days, setDays] = useState([]);
  //const [day, setDay] = useState("Monday");

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  let dailyAppointments = [];
  let dailyInterviewers = [];

  const setDay = (day) => {
    setState({ ...state, day })
  };

  // const setDays = (days) => {
  //   //setState({...state, days});
  //   setState(prev => ({ ...prev, days }));
  // }

  useEffect(() => {
    const daysUrl = `http://localhost:8001/api/days`;
    const appointmentsUrl = `http://localhost:8001/api/appointments`;
    const interviewersUrl = `http://localhost:8001/api/interviewers`;

    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl),
      //axios.get(`/api/debug/reset`)
    ])
      .then((all) => {
        //console.log("all",all)
        //setDays(all[0].data);
        setState((prev) => {
          return ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
        }) //if do not use one line code, it needs to use 'return'
      })

  }, [])

  dailyAppointments = getAppointmentsForDay(state, state.day);
  dailyInterviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    //console.log("id",id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        console.log("res", res);
        setState({ ...state, appointments });

      })
  }
  /* appointment data example
  [
    {
      id:1,
      time:'time',
      interview:{
        student:"e",
        interviewer:1
      }
    },
    {}
  ]
  */

  function cancelInterview(id) {
    state.appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        console.log("ress", res);
      });
  }

  function editInterview(){
    
  }
  const a = dailyAppointments.map((ap) => {
    const interview = getInterview(state, ap.interview)
    return (
      <Appointment
        key={ap.id}
        id={ap.id}
        time={ap.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
      </section>
      <section className="schedule">
        {a}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
