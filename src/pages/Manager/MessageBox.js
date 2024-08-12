import React from 'react';
import './MessageBox.css';
const MessageBox = () => {
  return (
    <section className="message-box-wrapper">
      <div className="message-item">
        <h2>1:1 문의 내역</h2>
        <h3>학생</h3>
        <div className="message-content">
          <div className="message-icon">
            <i className="fa-regular fa-envelope"></i>
            <span className="message-count">12</span>
          </div>
        </div>
        <a href="#" className="view-more">자세히 보기 &gt;</a>
      </div>
      <div className="message-item">
        <h2>1:1 문의 내역</h2>
        <h3>강사</h3>
        <div className="message-content">
          <div className="message-icon">
            <i className="fa-regular fa-envelope"></i>
            <span className="message-count">12</span>
          </div>
        </div>
        <a href="#" className="view-more">자세히 보기 &gt;</a>
      </div>
    </section>
  );
};

export default MessageBox;
