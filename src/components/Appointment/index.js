import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form"
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";


export default function Appointment(props) {
  //console.log("props", props)
  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))

  }

  function deleteAppointment(id) {
    transition(CONFIRM);
    //transition(DELETE);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
  }
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //console.log("222",props.interview.student)
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status massage="Saving update" />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(DELETE)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={() => transition(EMPTY)}
        onSave={save}
        interviewer={props.interviewer}
      />}
      {mode === DELETE && <Confirm
        message="Are you sure you would like to delete?"
        onCancel={back}
        onConfirm={deleteAppointment} />}
      {mode === CONFIRM && <Status massage="Deleting" />}
      {mode === EDIT && <Form
        interviewers={props.interviewers}
        onCancel={() => transition(SHOW)}
        onSave={save}
        interviewer={props.interviewer}
        student={props.interview.student}
      />}
    </article>

  )
}