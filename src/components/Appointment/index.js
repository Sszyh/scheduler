import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err) => {
        transition(ERROR_SAVE, true);
      });
  }

  function deleteAppointment(id) {
    transition(CONFIRM, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => {
        transition(ERROR_DELETE, true);
      });

  }
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="Saving update" />}
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
      {mode === CONFIRM && <Status message="Deleting" />}
      {mode === EDIT && <Form
        interviewers={props.interviewers}
        onCancel={() => transition(SHOW)}
        onSave={save}
        interviewer={props.interviewer}
        student={props.interview.student}
      />}
      {mode === ERROR_SAVE && <Error
        message={"fail to save"}
        onClose={back}
      />}
      {mode === ERROR_DELETE && <Error message={"fail to delete"}
        onClose={back}
      />}
    </article>

  );
}