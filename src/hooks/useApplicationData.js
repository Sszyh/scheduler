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

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        setState({ ...state, appointments });
        setSpotsDelete(id);
        setState(prve => ({ ...prve, days: state.days }));//arrow function to write code in one line
      });
  };

  const cancelInterview = (id) => {
    state.appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        setSpotsAdd(id);
        setState({ ...state, days: state.days });
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
  
  function setSpotsAdd(id) {
    if (id > 0 && id <= 5) {
      state.days[0].spots += 1;
    }
    if (id >= 6 && id <= 10) {
      state.days[1].spots += 1;
    }
    if (id >= 11 && id <= 15) {
      state.days[2].spots += 1;
    }
    if (id >= 16 && id <= 20) {
      state.days[3].spots += 1;
    }
    if (id >= 21 && id <= 25) {
      state.days[4].spots += 1;
    }
    return state.days;
  }
  function setSpotsDelete(id) {
    console.log("ssss");
    if (id > 0 && id <= 5) {
      state.days[0].spots -= 1;
    }
    if (id >= 6 && id <= 10) {
      state.days[1].spots -= 1;
    }
    if (id >= 11 && id <= 15) {
      state.days[2].spots -= 1;
    }
    if (id >= 16 && id <= 20) {
      state.days[3].spots -= 1;
    }
    if (id >= 21 && id <= 25) {
      state.days[4].spots -= 1;
    }
    return state.days;

  }
  return { state, setDay, bookInterview, cancelInterview };
}
