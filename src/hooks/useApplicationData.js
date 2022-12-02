import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  let newState = {};
  switch (action.type) {
    case SET_DAY:
      newState = { ...state, day: action.day }
      break;
    case SET_APPLICATION_DATA:
      newState = { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
      break;
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.appointmentId],
        interview: action.interview
      };
      const appointments = {
        ...state.appointments,
        [action.appointmentId]: appointment
      };
      newState = { ...state, appointments: appointments }
      break;
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }

  newState.days = newState.days.map((day) => {
    day.spots = 0;
    for (let apId of day.appointments) {
      if (newState.appointments[apId].interview === null) {
        day.spots++;
      }
    }
    return day;
  })
  return newState;
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => {
    dispatch({ type: SET_DAY, day: day })
  };


  const bookInterview = (appointmentId, interview) => {

    return axios.put(`/api/appointments/${appointmentId}`, { interview })
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, appointmentId: appointmentId, interview: interview })
      });
  };

  const cancelInterview = (appointmentId) => {
    return axios.delete(`/api/appointments/${appointmentId}`)
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, appointmentId: appointmentId, interview: null })

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

      /* leave a axios get request for reset database:
        axios.get(`http://localhost:8001/api/debug/reset`) 
      */

    ])
      .then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        });
      });

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = (event) => {
      webSocket.send("ping")
    }
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type) {
        dispatch({ type: data.type, appointmentId: data.id, interview:data.interview})
      }
    }
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
