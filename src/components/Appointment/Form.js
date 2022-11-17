import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function validate() {
  if (student === "") {
    setError("Student name cannot be blank");
    return;
  }
  if (interviewer === null) {
    setError("Please select an interviewer");
    return;
  }
  props.onSave(student, interviewer);
}
  const reset = function () {
    setStudent("");
    setInterviewer(null);
  };
  const cancel = function () {
    reset();
    props.onCancel();
  };
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}//to figure out if it is a event handler: it inside <input>
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => props.onCancel()}>Cancel</Button>
          <Button confirm onClick={() => { validate() }}>Save</Button>
        </section>
      </section>
    </main>
  );
}