import { useEffect } from "react";
import "./StudentBadge.css";

const StudentBadge = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main_container">
      <h1 className="student_badge_page_title">배찌</h1>
      <div className="student_badge_filter_box">
        <button className="show_all_badges badge_filter_box">모든 배지 </button>
        <button className="show_order_by_acquired_badges badge_filter_box">
          획득 배지
        </button>
        <button className="show_order_by_not_acquired_badges badge_filter_box">
          미획득 배지
        </button>
      </div>
      <div className="student_badge_list_container">
        <div className="student_badge_box">
          <img
            className="student_badge_image"
            alt="배찌 이미지"
            src="https://i.namu.wiki/i/uR0ek1WtbxNzu1Mccwr4T6e2xd2hNxibxDTV7modKkHcndi9xy1FZAjY1Q056CjgRtL-TSQWVJ36WVmJyM3aew.webp"
          />
          <div className="student_badge_info_box">
            <h1 className="student_badge_name">???</h1>
            <p className="student_badge_description">꾸준히 달려요</p>
          </div>
          {/* 배지 뒷면 */}
          <div className="student_badge_detail_info_box">
            <h1 className="badge_name">
              대충 제목 내용 설명 몰루 포지션 뒤집으면 나올것들
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBadge;
