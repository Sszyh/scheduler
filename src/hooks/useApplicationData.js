import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => {
    setState({ ...state, day })
  };

  const bookInterview = (id, interview) => {
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

  const cancelInterview = (id) => {
    state.appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        console.log("ress", res);
      })
  }

  useEffect(() => {
    const daysUrl = `http://localhost:8001/api/days`;
    const appointmentsUrl = `http://localhost:8001/api/appointments`;
    const interviewersUrl = `http://localhost:8001/api/interviewers`;

    Promise.all([
      axios.get(daysUrl),
      axios.get(appointmentsUrl),
      axios.get(interviewersUrl),
    ])
      .then((all) => {
        setState((prev) => {
          return ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
        }) //if do not use one line code, it needs to use 'return'
      })

  }, [])

  return { state, setDay, bookInterview, cancelInterview }
}
