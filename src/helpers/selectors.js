export function getAppointmentsForDay(state, day) {
  const result = [];

  for (let d of state.days) {
    if (d.name === day) {
      for (let a of d.appointments) {
        const appointmentObj = {};
        appointmentObj.id = a;
        appointmentObj.time = state.appointments[a].time;
        appointmentObj.interview = state.appointments[a].interview;
        result.push(appointmentObj);
      }
    }
  }
  return result;
}

export function getInterview(state, interview) {
  let result = {};
  if (interview !== null) {
    result.student = interview.student;
    result.interviewer = state.interviewers[interview.interviewer];
    return result;
  } 
    return null;
  }

  export function getInterviewersForDay(state, day) {
    const result = [];
  
    for (let d of state.days) {
      if (d.name === day) {
        for (let a of d.interviewers) {
         result.push(state.interviewers[a]);
        }
      }
    }
    return result;
  }