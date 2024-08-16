import { useEffect } from "react";
import "./StudentBadge.css";
import useAxiosGet from "../../hooks/useAxiosGet";

const StudentBadge = () => {
  const { data: badges } = useAxiosGet(`/students/badges`);

  console.log(badges);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main_container">
      <h1 className="student_badge_page_title">배지</h1>
      <div className="student_badge_filter_box">
        <button className="show_all_badges badge_filter_box">모든 배지</button>
        <button className="show_order_by_acquired_badges badge_filter_box">
          획득 배지
        </button>
        <button className="show_order_by_not_acquired_badges badge_filter_box">
          미획득 배지
        </button>
      </div>
      <div className="student_badge_list_container">
        {badges?.map((el, idx) => (
          <div className="student_badge_list" key={el.idx}>
            <div className="student_badge_box">
              <img
                className="student_badge_image"
                alt="배지 이미지"
                src={el.imagePath}
              />
              <div className="student_badge_info_box">
                <h1 className="student_badge_name">{el.name}</h1>
                <p className="student_badge_description">{el.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBadge;
