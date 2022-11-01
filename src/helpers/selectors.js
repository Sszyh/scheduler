export function getAppointmentsForDay(state, day) {
  const result = [];
 
  for (let d of state.days) {
    if (d.name === day) {
      for(let a of d.appointments) {
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