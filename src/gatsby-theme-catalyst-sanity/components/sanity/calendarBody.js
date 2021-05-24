import { handleOmittedDays, useMonthlyCalendar } from '@zach.codes/react-calendar'
import React, { useContext } from 'react'
import { format, getDay, isSameDay } from 'date-fns';
import { Box } from 'theme-ui'

const MonthlyBodyContext = React.createContext({});
export function useMonthlyBody() { return useContext(MonthlyBodyContext); }

const headingClasses = {
    l3: 'lg:grid-cols-3',
    l4: 'lg:grid-cols-4',
    l5: 'lg:grid-cols-5',
    l6: 'lg:grid-cols-6',
    l7: 'lg:grid-cols-7',
};

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

  let headingClassName = 'border-b-2 p-2 border-r-2 lg:block hidden';
  return (
    <div className="bg-white border-l-2 border-t-2">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ${
          //@ts-ignore
          headingClasses[`l${headings.length}`]
        }`}
      >
        {headings.map(day => (
          <div
            key={day.day}
            className={headingClassName}
            aria-label="Day of Week"
          >
            {day.label}
          </div>
        ))}
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ${
          //@ts-ignore
          headingClasses[`l${headings.length}`]
        }`}
        style={{overflowY: "auto", height: "30em"}}
      >            {padding.map((_, index) => (
            <div
                key={index}
                className={headingClassName}
                aria-label="Empty Day"
            />
            ))}
            {daysToRender.map(day => (
            <MonthlyBodyContext.Provider
                key={day.toISOString()}
                value={{
                day,
                events: events.filter(data => isSameDay(data.date, day)),
                }}
            >
                {children}
            </MonthlyBodyContext.Provider>
            ))}
      </div>
    </div>
  );
}

export function MonthlyDay({ renderDay }) {
    let { day, events } = useMonthlyBody();
    let dayNumber = format(day, 'd');

    return (
      <div
        aria-label={`Events for day ${dayNumber}`}
        className="h-48 p-2 border-b-2 border-r-2"
      >
        <div className="flex justify-between">
          <div className="font-bold">{dayNumber}</div>
          <div className="lg:hidden block">{format(day, 'EEEE')}</div>
        </div>
        <ul className="divide-gray-200 divide-y overflow-hidden max-h-36 overflow-y-auto">
          {renderDay(events)}
        </ul>
      </div>
    );
  }