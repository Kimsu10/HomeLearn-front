import React, { useState, useEffect } from 'react';
import { FaCalendarPlus } from 'react-icons/fa';
import axios from '../../../utils/axios';
import './TeacherCalendar.css';
import TeacherModal from '../../Modal/TeacherModal/TeacherModal';

const TeacherCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null, color: '#FF9999' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/teachers/calendar-events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const saveEvents = async () => {
      try {
        await axios.post('/teachers/save-calendar-events', events);
      } catch (error) {
        console.error('Error saving events:', error);
      }
    };

    saveEvents();
  }, [events]);

  useEffect(() => {
    const fetchHolidays = async () => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const serviceKey = "t21Zxd4T5l%2FCFpu9dpVZ2U4nEIv06W14hNeu7Op7HA0yIBHYgMu23%2FL6JHBWQ%2Bp9HNG%2B93RJwgq7zANzmn%2B2%2BA%3D%3D";
      const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&solYear=${year}&solMonth=${month}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const responseText = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(responseText, "application/xml");
          const items = xmlDoc.getElementsByTagName("item");
          const holidays = Array.from(items)
            .map((item) => {
              const locdate = item.getElementsByTagName("locdate")[0].textContent;
              return locdate;
            })
            .filter((date) => {
              const monthDay = date.substr(4, 4);
              return monthDay !== "0717";
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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const generateCalendarDates = () => {
    const dates = [];
    const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const nextMonthFirstDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        date: new Date(prevMonthLastDate.getFullYear(), prevMonthLastDate.getMonth(), prevMonthLastDate.getDate() - i),
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true
      });
    }

    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        dates.push({
          date: new Date(nextMonthFirstDate.getFullYear(), nextMonthFirstDate.getMonth(), i + 1),
          isCurrentMonth: false
        });
      }
    }

    return dates;
  };

  const handleMonthChange = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleOpenModal = () => {
    setNewEvent({ title: '', start: selectedDate, end: selectedDate, color: '#FF9999' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewEvent({ title: '', start: null, end: null, color: '#FF9999' });
  };

  const handleSaveEvent = async () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      try {
        const response = await axios.post('/teachers/add-calendar-event', newEvent);
        setEvents([...events, response.data]);
        handleCloseModal();
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };

  const handleDateClick = (date) => {
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedDate(adjustedDate);
  };

  const getEventsForDate = (date) => {
    return events.filter(event =>
      new Date(event.start).toDateString() === date.toDateString() ||
      (new Date(event.start) <= date && new Date(event.end) >= date)
    );
  };

  const isCurrentDate = (date) => {
    const today = new Date();
    return date && date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
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

  return (
    <section className="teacher-calendar-container">
      <div className="teacher-calendar">
        <div className="teacher-calendar-header">
          <button onClick={() => handleMonthChange(-1)}>&lt;</button>
          <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
          <button onClick={() => handleMonthChange(1)}>&gt;</button>
        </div>
        <div className="teacher-add-list">
          <button onClick={() => setCurrentDate(new Date())}>Today</button>
          <button onClick={handleOpenModal}>
            일정 추가
            <FaCalendarPlus style={{ marginLeft: '8px' }} />
          </button>
        </div>
        <div className="teacher-calendar-body">
          <div className="teacher-weekdays">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="teacher-days">
            {generateCalendarDates().map((day, index) => (
              <div
                key={index}
                className={`teacher-day ${day.isCurrentMonth ? '' : 'other-month'} ${
                  selectedDate &&
                  day.date.getFullYear() === selectedDate.getFullYear() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getDate() === selectedDate.getDate() ? 'selected' : ''
                } ${isCurrentDate(day.date) ? 'current-date' : ''} ${
                  isHoliday(day.date) ? 'holiday' : ''
                } ${isWeekend(day.date).isSunday ? 'sunday' : isWeekend(day.date).isSaturday ? 'saturday' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <span className="teacher-day-number">{day.date.getDate()}</span>
                <div className="teacher-events-indicator">
                  {getEventsForDate(day.date).map(event => (
                    <div key={event.id} className="event-bar" style={{ backgroundColor: event.color }}>
                      <span className="teacher-event-title">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TeacherModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div>
          <h3 className="teacher-modal-add">일정 등록하기</h3>
          <div className="teacher-event-form">
            <label>제목</label>
            <input
              type="text"
              placeholder="일정 제목"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <label>시작일</label>
            <input
              type="date"
              value={newEvent.start ? newEvent.start.toISOString().substr(0, 10) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
            />
            <label>종료일</label>
            <input
              type="date"
              value={newEvent.end ? newEvent.end.toISOString().substr(0, 10) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
            />
            <div className="teacher-color-picker">
              {['#FF9999', '#99FF99', '#9999FF'].map(color => (
                <div
                  key={color}
                  className={`teacher-color-option ${newEvent.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewEvent({ ...newEvent, color })}
                ></div>
              ))}
            </div>
            <div className='teacher-calendar-submit'>
              <button onClick={handleSaveEvent}>등록</button>
            </div>
          </div>
        </div>
      </TeacherModal>
    </section>
  );
};

export default TeacherCalendar;
