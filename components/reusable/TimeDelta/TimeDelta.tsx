"use client";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";

const TimeDelta: FC<{ dt: string }> = ({ dt }) => {
  const formatDateFromNow = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return <span>{formatDateFromNow(dt)}</span>;
};
export default TimeDelta;
