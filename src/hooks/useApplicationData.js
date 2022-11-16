import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => {
    setState({ ...state, day });
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
    let midState = { ...state, appointments };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        // setState({ ...state, appointments });
        let newState = setSpotsUpdate(midState);
        setState(newState);//arrow function to write code in one line
        console.log("ssss")
      });
  };

  const cancelInterview = (id) => {
    // state.appointments[id].interview = null;

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let midState = { ...state, appointments };

    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        // setSpotsUpdate();

        // setState(prevs => ({ ...prevs, days: state.days }));
        let newState = setSpotsUpdate(midState);
        setState(newState);
      });

  };

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
        setState((prev) => {
          return ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
        }); //if do not use one line code, it needs to use 'return'
      });

  }, []);

  function setSpotsUpdate(midState) {

    midState.days.map((day) => {

      day.spots = 0;
      for (let apId of day.appointments) {
        if (midState.appointments[apId].interview === null) {
          day.spots++;
        }
      }
      //return day;
    })
    return midState;

  }
  return { state, setDay, bookInterview, cancelInterview };
}
