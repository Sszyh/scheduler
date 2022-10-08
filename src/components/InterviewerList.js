import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const interviewerArr = props.interviewers.map((inter) => {
    return (
      <InterviewerListItem
        key={inter.id}
        id={inter.id}
        name={inter.name}
        avatar={inter.avatar}
        selected={inter.id === props.interviewer}
        setInterviewer={props.setInterviewer}

      />
    )
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerArr}
      </ul>
    </section>
  )
}