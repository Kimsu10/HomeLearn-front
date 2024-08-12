import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManagerCalendarDetail.css';
import ManagerCalendar from './ManagerCalendar';

const CalendarDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const predefinedColors = ['#FF9999', '#99FF99', '#9999FF'];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    setEvents(storedEvents);
    const foundEvent = storedEvents.find((e) => e.id === Number(eventId));
    setEvent(foundEvent);
    setSelectedEvent(foundEvent);
  }, [eventId]);

  const getEventsForDate = (date) => {
    return events.filter(event =>
      new Date(event.start).toDateString() === date.toDateString() ||
      (new Date(event.start) <= date && new Date(event.end) >= date)
    );
  };

  if (!event) {
    return navigate('/managers');
  }

  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    if (id === selectedEvent.id) {
      setSelectedEvent(null);
      setEditMode(false);
    }
  };

  const handleEditEvent = (evt) => {
    setSelectedEvent(evt);
    setEditMode(true);
  };

  const handleSaveEvent = () => {
    const updatedEvents = events.map((e) => e.id === selectedEvent.id ? selectedEvent : e);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    setEvent(selectedEvent);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setEditMode(false);
  };

  return (
    <div className="detail-calendar-detail-page">
      <div className="detail-calendar-detail-sidebar">
        <ManagerCalendar events={events} onDayClick={handleDayClick} />
      </div>
      <div className="detail-calendar-detail-container">
        <div className="detail-calendar-detail-header">
          <h2>일정 관리</h2>
          <button onClick={() => navigate("/managers")}>돌아가기</button>
        </div>
        <div className="detail-calendar-detail-content">
          <div className="detail-all-events">
            <ul>
              {getEventsForDate(selectedDate || new Date(event.start)).map((evt) => (
                <li key={evt.id} className="detail-event-item">
                  <div className="detail-event-color" style={{ backgroundColor: evt.color }}></div>
                  <div className="detail-event-info">
                    <div className="detail-event-title-container">
                      <span className="detail-event-title">{evt.title}</span>
                      <div className="detail-event-actions">
                        <button onClick={() => handleEditEvent(evt)}>
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button onClick={() => handleDeleteEvent(evt.id)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                    <div className="detail-event-dates">
                      <p><strong>시작일:</strong> {new Date(evt.start).toLocaleDateString()}</p>
                      <p><strong>종료일:</strong> {new Date(evt.end).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {editMode && selectedEvent && (
            <div className="detail-event-edit">
              <div className="detail-event-color-picker">
                {predefinedColors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${selectedEvent.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedEvent({ ...selectedEvent, color })}
                  ></div>
                ))}
              </div>
              <input
                type="text"
                name="title"
                value={selectedEvent.title}
                onChange={handleChange}
                className="detail-event-title-input"
              />
              <input
                type="date"
                name="start"
                value={selectedEvent.start}
                onChange={handleChange}
                className="detail-event-date-input"
              />
              <input
                type="date"
                name="end"
                value={selectedEvent.end}
                onChange={handleChange}
                className="detail-event-date-input"
              />
              <div className="detail-event-actions-edit">
                <button onClick={handleSaveEvent}>저장<i className="fas fa-save"></i></button>
                <button onClick={() => handleDeleteEvent(selectedEvent.id)}>삭제<i className="fas fa-trash-alt"></i></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDetail;
