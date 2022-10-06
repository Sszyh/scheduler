import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  })
  return (
    <li onClick={() => props.setDay(props.name)} className={dayClass}>
      <h2 >{props.name}</h2> 
      <h3 >{props.spots} spots remaining</h3>
    </li>
  );
}