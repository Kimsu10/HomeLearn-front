import React, { useState, useEffect } from 'react';
import { FaCalendarPlus } from 'react-icons/fa'; // 캘린더 추가 아이콘 가져오기
import './TeacherCalendar.css';
import TeacherModal from '../../Modal/TeacherModal/TeacherModal';

const TeacherCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());  // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(null);  // 선택된 날짜
  const [events, setEvents] = useState([]);  // 일정 이벤트
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null, time: '', color: '#FF9999' });  // 새로운 이벤트 상태
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 창 열림
  const [viewEvent, setViewEvent] = useState(null);  // 보기 위한 이벤트
  const [editEvent, setEditEvent] = useState(null);  // 수정 중인 이벤트

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || []; // 로컬 스토리지에서 이벤트 가져오기
    setEvents(storedEvents); // 이벤트 상태 설정
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events)); // 이벤트가 변경될 때 로컬 스토리지에 저장
  }, [events]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); // 현재 월의 일 수 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 현재 월의 첫 번째 요일 계산

  const generateCalendarDates = () => {
    const dates = [];
    const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // 이전 달의 마지막 날짜 계산
    const nextMonthFirstDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // 다음 달의 첫 번째 날짜 계산

    // 이전 달의 날짜 추가
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        date: new Date(prevMonthLastDate.getFullYear(), prevMonthLastDate.getMonth(), prevMonthLastDate.getDate() - i),
        isCurrentMonth: false // 이전 달의 날짜로 설정
      });
    }

    // 현재 달의 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true // 현재 달의 날짜로 설정
      });
    }

    // 다음 달의 날짜 추가
    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        dates.push({
          date: new Date(nextMonthFirstDate.getFullYear(), nextMonthFirstDate.getMonth(), i + 1),
          isCurrentMonth: false // 다음 달의 날짜로 설정
        });
      }
    }

    return dates; // 생성된 날짜 반환
  };

  const handleMonthChange = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)); // 월 변경
  };

  const handleOpenModal = () => {
    setNewEvent({ title: '', start: selectedDate, end: selectedDate, time: '', color: '#FF9999' }); // 새로운 이벤트 초기화
    setIsModalOpen(true); // 모달 창 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 창 닫기
    setNewEvent({ title: '', start: null, end: null, time: '', color: '#FF9999' }); // 새로운 이벤트 초기화
    setViewEvent(null);
    setEditEvent(null);
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      if (editEvent) { // 수정 중인 이벤트인 경우
        setEvents(events.map(event => (event.id === editEvent.id ? newEvent : event))); // 업데이트
      } else { // 새로운 이벤트인 경우
        setEvents([...events, { ...newEvent, id: Date.now() }]); // 이벤트 추가
      }
      handleCloseModal(); // 모달 창 닫기
    }
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter(event => event.id !== viewEvent.id)); // 이벤트 삭제
    handleCloseModal(); // 모달 창 닫기
  };

  const handleDateClick = (date) => {
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); // 날짜 클릭 시 UTC로 변환
    setSelectedDate(adjustedDate); // 선택된 날짜 설정
  };

  const handleEventClick = (event) => {
    setViewEvent(event); // 보기 위한 이벤트 설정
    setEditEvent(event); // 수정 중인 이벤트 설정
    setNewEvent(event); // 새로운 이벤트 설정
    setIsModalOpen(true); // 모달 창 열기
  };

  const getEventsForDate = (date) => {
    return events.filter(event =>
      new Date(event.start).toDateString() === date.toDateString() ||
      (new Date(event.start) <= date && new Date(event.end) >= date)
    ); // 특정 날짜에 해당하는 이벤트 반환
  };

  const isCurrentDate = (date) => {
    const today = new Date();
    return date && date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear(); // 오늘 날짜인지 확인
  };

  const getEventStyle = (event, day) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const span = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1; // 이벤트 기간 계산
    if (startDate.toDateString() === day.toDateString()) {
      if (startDate.toDateString() !== endDate.toDateString()) {
        return { gridColumn: `span ${span}` }; // 여러 칸에 걸치는 이벤트 스타일 설정
      }
    }
    return {}; // 단일 칸 이벤트 스타일 설정
  };

  return (
    <section className="teacher-calendar-container">
      <div className="teacher-calendar">
        <div className="teacher-calendar-title">캘린더</div>
        <div className="teacher-calendar-header">
          <button onClick={() => handleMonthChange(-1)}>&lt;</button> {/* 이전 달로 이동 */}
          <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2> {/* 현재 년도와 월 표시 */}
          <button onClick={() => handleMonthChange(1)}>&gt;</button> {/* 다음 달로 이동 */}
        </div>
        <div className="teacher-add-list">
          <button onClick={() => setCurrentDate(new Date())}>
            Today
          </button>
          <button onClick={handleOpenModal}>
            일정 추가
            <FaCalendarPlus style={{ marginLeft: '8px' }} />
          </button>
        </div>
        <div className="teacher-calendar-body">
          <div className="teacher-weekdays">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day}>{day}</div> // 요일 표시
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
                } ${isCurrentDate(day.date) ? 'current-date' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <span className="teacher-day-number">{day.date.getDate()}</span>
                <div className="teacher-events-indicator">
                  {getEventsForDate(day.date).map(event => (
                    <div key={event.id} className="event-bar" style={{ backgroundColor: event.color, ...getEventStyle(event, day.date) }} onClick={() => handleEventClick(event)}>
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
          <h3 className="teacher-modal-add">{editEvent ? '일정 수정하기' : '일정 등록하기'}</h3>
          <div className="teacher-event-form">
            <input
              type="text"
              placeholder="일정 제목"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} // 제목 입력
            />
            <label>시작일</label>
            <input
              type="date"
              value={newEvent.start ? newEvent.start.toISOString().substr(0, 10) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })} // 시작일 입력
            />
            <label>종료일</label>
            <input
              type="date"
              value={newEvent.end ? newEvent.end.toISOString().substr(0, 10) : ''}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })} // 종료일 입력
            />
            <div className="teacher-color-picker">
              {['#FF9999', '#99FF99', '#9999FF'].map(color => (
                <div
                  key={color}
                  className={`teacher-color-option ${newEvent.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewEvent({ ...newEvent, color })} // 색상 선택
                ></div>
              ))}
            </div>
            <div className='teacher-calendar-submit'>
              <button onClick={handleSaveEvent}>{editEvent ? '수정' : '등록'}</button>
              {editEvent && <button onClick={handleDeleteEvent}>삭제</button>}
            </div>
          </div>
        </div>
      </TeacherModal>
    </section>
  );
};

export default TeacherCalendar;
