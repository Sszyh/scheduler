import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// debug with mentor and get idea of calculate spots
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
    for(let apId of day.appointments) {
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
    dispatch({ type: SET_DAY, day:day })
  };

  const bookInterview = (appointmentId, interview) => {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    return axios.put(`/api/appointments/${appointmentId}`, { interview })
      .then((res) => {
        dispatch({ type: SET_INTERVIEW, appointmentId: appointmentId, interview:interview })
        // setState({ ...state, appointments });
        // setSpotsDelete(id);
        // dispatch({type: SET_INTERVIEW, state:prve => ({ ...prve, days: state.days })})
        // setState(prve => ({ ...prve, days: state.days }));//arrow function to write code in one line
      });
  };

  const cancelInterview = (appointmentId) => {
    //state.appointments[appointmentId].interview = null;
    // dispatch({ type: CANCEL_INTERVIEW, id, interview: null })
    return axios.delete(`/api/appointments/${appointmentId}`)
      .then((res) => {
        // setSpotsAdd(id);
        dispatch({ type: SET_INTERVIEW, appointmentId:appointmentId, interview: null })
        //dispatch({ type: SET_INTERVIEW, state: { ...state, days: state.days } })
        //setState({ ...state, days: state.days });
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
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        });
        // setState((prev) => {

        //   return ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
        // }); //if do not use one line code, it needs to use 'return'
      });

  }, []);

  // function setSpotsAdd(id) {
  //   if (id > 0 && id <= 5) {
  //     state.days[0].spots += 1;
  //   }
  //   if (id >= 6 && id <= 10) {
  //     state.days[1].spots += 1;
  //   }
  //   if (id >= 11 && id <= 15) {
  //     state.days[2].spots += 1;
  //   }
  //   if (id >= 16 && id <= 20) {
  //     state.days[3].spots += 1;
  //   }
  //   if (id >= 21 && id <= 25) {
  //     state.days[4].spots += 1;
  //   }
  //   return state.days;
  // }
  // function setSpotsDelete(id) {
  //   console.log("ssss");
  //   if (id > 0 && id <= 5) {
  //     state.days[0].spots -= 1;
  //   }
  //   if (id >= 6 && id <= 10) {
  //     state.days[1].spots -= 1;
  //   }
  //   if (id >= 11 && id <= 15) {
  //     state.days[2].spots -= 1;
  //   }
  //   if (id >= 16 && id <= 20) {
  //     state.days[3].spots -= 1;
  //   }
  //   if (id >= 21 && id <= 25) {
  //     state.days[4].spots -= 1;
  //   }
  //   return state.days;

  // }
  return { state, setDay, bookInterview, cancelInterview };
}
