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

  useEffect(() => {
    Promise.all([
      axios.get("api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers"),
      // axios.get("api/debug/reset") 
      /* leave a axios get request for reset database */
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

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type) {
        dispatch({ type: data.type, appointmentId: data.id, interview: data.interview })
      }
    }
  }, []);

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

  return { state, setDay, bookInterview, cancelInterview };
}
