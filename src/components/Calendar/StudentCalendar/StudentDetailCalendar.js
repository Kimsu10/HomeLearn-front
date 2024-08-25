import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import "./StudentDetailCalendar.css";

const StudentDetailCalendar = ({ studentId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const getToken = () => localStorage.getItem("access-token");

  // 학생 출석 정보 가져오기
  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `/managers/students/attendance/${studentId}`,
          {
            headers: { access: token },
          }
        );

        if (response.data && response.data.dateAttendanceType) {
          const eventsData = Object.entries(
            response.data.dateAttendanceType
          ).map(([date, type]) => ({
            id: date,
            title: type,
            startDate: new Date(date),
            endDate: new Date(date),
            allDay: true,
            className: type.toLowerCase(),
          }));

          setEvents(eventsData);
        }
      } catch (error) {
        console.error("학생 출석 정보 가져오기 실패:", error);
      }
    };

    fetchStudentAttendance();
  }, [studentId]);

  // 공휴일 정보 가져오기
  useEffect(() => {
    const fetchHolidays = async () => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const serviceKey =
        "t21Zxd4T5l%2FCFpu9dpVZ2U4nEIv06W14hNeu7Op7HA0yIBHYgMu23%2FL6JHBWQ%2Bp9HNG%2B93RJwgq7zANzmn%2B2%2BA%3D%3D";
      const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&solYear=${year}&solMonth=${month}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const responseText = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
            responseText,
            "application/xml"
          );
          const items = xmlDoc.getElementsByTagName("item");
          const holidays = Array.from(items).map((item) => {
            const locdate = item.getElementsByTagName("locdate")[0].textContent;
            return locdate;
          });
          setHolidays(holidays);
        } else {
          console.error("공휴일 데이터 가져오기 실패:", response.statusText);
        }
      } catch (error) {
        console.error("공휴일 데이터 가져오는 중 오류:", error);
      }
    };

    fetchHolidays();
  }, [currentDate]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const generateCalendarDates = () => {
    const dates = [];
    const prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    const nextMonthFirstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        date: new Date(
          prevMonthLastDate.getFullYear(),
          prevMonthLastDate.getMonth(),
          prevMonthLastDate.getDate() - i
        ),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        dates.push({
          date: new Date(
            nextMonthFirstDate.getFullYear(),
            nextMonthFirstDate.getMonth(),
            i + 1
          ),
          isCurrentMonth: false,
        });
      }
    }

    return dates;
  };

  const handleMonthChange = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const isCurrentDate = (date) => {
    const today = new Date();
    return (
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isHoliday = (date) => {
    return holidays.some((holiday) => {
      const holidayDate = new Date(
        holiday.substr(0, 4),
        holiday.substr(4, 2) - 1,
        holiday.substr(6, 2)
      );
      return holidayDate.toDateString() === date.toDateString();
    });
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return { isSunday: day === 0, isSaturday: day === 6 };
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        new Date(event.startDate).toDateString() === date.toDateString() ||
        (new Date(event.startDate) <= date && new Date(event.endDate) >= date)
    );
  };

  return (
    <section className="calendar-container">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => handleMonthChange(-1)}>&lt;</button>
          <h2>
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h2>
          <button onClick={() => handleMonthChange(1)}>&gt;</button>
        </div>
        <div className="calendar-body">
          <div className="weekdays">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="days">
            {generateCalendarDates().map((day, index) => (
              <div
                key={index}
                className={`day ${day.isCurrentMonth ? "" : "other-month"} ${
                  isCurrentDate(day.date) ? "current-date" : ""
                } ${isHoliday(day.date) ? "holiday" : ""} ${
                  isWeekend(day.date).isSunday
                    ? "sunday"
                    : isWeekend(day.date).isSaturday
                    ? "saturday"
                    : ""
                }`}
              >
                <span className="day-number">{day.date.getDate()}</span>
                <div className="events-indicator">
                  {getEventsForDate(day.date)
                    .slice(0, 1)
                    .map((event) => (
                      <span
                        key={event.id}
                        className={`attendance-text ${event.className}`}
                      >
                        {event.title === "PRESENT" && "출석"}
                        {event.title === "ABSENT" && "결석"}
                        {event.title === "LATE" && "지각"}
                        {event.title === "EXCUSED" && "공결"}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDetailCalendar;
