import { handleOmittedDays, useMonthlyCalendar } from '@zach.codes/react-calendar'
import React, { useContext } from 'react'
import { format, getDay, isSameDay } from 'date-fns';
import { Box } from 'theme-ui'
import { baseColors } from "@theme-ui/preset-tailwind"

const MonthlyBodyContext = React.createContext({});
export function useMonthlyBody() { return useContext(MonthlyBodyContext); }

const headingClasses = {
    l3: 'lg:grid-cols-3',
    l4: 'lg:grid-cols-4',
    l5: 'lg:grid-cols-5',
    l6: 'lg:grid-cols-6',
    l7: 'lg:grid-cols-7',
};

const dayBorder = {
  height: "10em",
  border: "solid",
  borderColor: baseColors.gray[3],
  p: 2,
  borderWidth: 2,
  borderTop: 0, borderLeft: 0
}

export function MonthlyBody({
  omitDays,
  events,
  children,
}) {
  let { days } = useMonthlyCalendar();
  let { headings, daysToRender, padding } = handleOmittedDays({
    days,
    omitDays,
  });

  return (
    <Box sx={{
        border: "solid", borderColor: baseColors.gray[3],
        borderWidth: 2, borderBottom: 0, borderRight: 0,
        
        display: "grid", alignItems: "start", 
          gridTemplateColumns: ["repeat(auto-wrap, 12em)", null, "repeat(7, 1fr)"],
        }}
      >
        {padding.map((_, index) => (
          <Box sx={dayBorder} key={index} aria-label="Empty Day"/>
          ))}
        {daysToRender.map(day => (
          <MonthlyBodyContext.Provider
              key={day.toISOString()}
              value={{
              day,
              events: events.filter(data => isSameDay(data.date, day)),
              }}>
              {children}
          </MonthlyBodyContext.Provider>
        ))}
    </Box>
  );
}

export function MonthlyDay({ renderDay }) {
    let { day, events } = useMonthlyBody();
    let dayNumber = format(day, 'd');

    return (
      <Box
        aria-label={`Events for day ${dayNumber}`}
        sx={dayBorder}
      >
        {/* TODO: align numbers to right (below doesn't work) */}
        <Box sx={{display: "flex", alignItems: "end"}}>
          <Box sx={{fontWeight: "bold"}}>{dayNumber}</Box>
          {/* <Box className="lg:hidden block">{format(day, 'EEEE')}</Box> */}
        </Box>
        <ul sx={{overflowY: "auto"}}> {renderDay(events)} </ul>
      </Box>
    );
  }

export const DefaultMonthlyEventItem = ({
  title,
  date,
}) => {
  return (
    <Themed.li sx={{py: 2}}>
      <Box sx={{display: "flex", alignItems: "between"}}>
        <p>{title}</p>
        <p sx={{color: "gray"}}>{date}</p>
      </Box>
    </Themed.li>
  );
};