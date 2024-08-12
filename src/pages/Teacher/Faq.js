import React from 'react';
import './Faq.css';
const Faq = () => {
  return (
    <section className="faq-box-wrapper">
      <div className="faq-item">
        <div className="faq-content">
          <h2>1:1 문의 내역</h2>
          <div className="faq-icon">
            <div className="faq-count">12</div>
            <i className="fa-regular fa-envelope"></i>
          </div>
          <a href="#" className="faq-view-more">자세히 보기 &gt;</a>
        </div>
      </div>
      <div className="faq-item">
        <div className="faq-notice-container">
          <h2>매니저 공지사항</h2>
          <div className="teacher-notice-content">
            <div className="teacher-notice">
              <div className="teacher-manager-notice-state">
                긴급
              </div>
              <a href="#">공지사항</a>
              <div className="teacher-manager-notice-date">2024.08.01</div>
            </div>
          </div>
          <div className="teacher-notice-container">
            <div className="teacher-notice">
              <div className="teacher-manager-notice-state">
                긴급
              </div>
              <a href="#">공지사항</a>
              <div className="teacher-manager-notice-date">2024.08.01</div>
            </div>
          </div>
          <div className="teacher-notice-container">
            <div className="teacher-notice">
              <div className="teacher-manager-notice-state">
                긴급
              </div>
              <a href="#">공지사항</a>
              <div className="teacher-manager-notice-date">2024.08.01</div>
            </div>
          </div>
          <div className="teacher-notice-container">
            <div className="teacher-notice">
              <div className="teacher-manager-notice-state">
                긴급
              </div>
              <a href="#">공지사항</a>
              <div className="teacher-manager-notice-date">2024.08.01</div>
            </div>
          </div>
          <a href="#" className="faq-view-more">자세히 보기 &gt;</a>
        </div>
      </div>
    </section>
  );
};

export default Faq;
