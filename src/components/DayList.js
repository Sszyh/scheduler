import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const days = props.days.map((day) => {
    return (
      <li>
        <DayListItem
          key={day.id}
          name={day.name}
          spots={day.spots}
          selected={day.name === props.day}
          setDay={day.setDay}
        />
      </li>)
  });
  return (
    <ul>
      {days}
    </ul>
  )
}