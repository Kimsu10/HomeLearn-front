import { useEffect, useState } from "react";
import "./StudentBadge.css";
import useAxiosGet from "../../hooks/useAxiosGet";

const StudentBadge = ({ baseUrl }) => {
  const { data: badges } = useAxiosGet(`/students/badges`);
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [rotatedBadgeIds, setRotatedBadgeIds] = useState([]); // 배열로 변경

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (badges) {
      filterBadges(filter);
    }
  }, [badges, filter]);

  const filterBadges = (el) => {
    switch (el) {
      case "acquired":
        setFilteredBadges(badges.filter((el) => el.obtainCount > 0));
        break;
      case "notAcquired":
        setFilteredBadges(badges.filter((el) => el.obtainCount === 0));
        break;
      default:
        setFilteredBadges(badges);
        break;
    }
  };

  const handleBadgeClick = (badgeId) => {
    setRotatedBadgeIds((prevIds) =>
      prevIds.includes(badgeId)
        ? prevIds.filter((id) => id !== badgeId)
        : [...prevIds, badgeId]
    );
  };

  return (
    <div className="badge_main_container">
      <h1 className="student_badge_page_title">배지</h1>
      <div className="student_badge_filter_box">
        <button
          className="show_all_badges badge_filter_box"
          onClick={() => setFilter("all")}
        >
          모든 배지
        </button>
        <button
          className="show_order_by_acquired_badges badge_filter_box"
          onClick={() => setFilter("acquired")}
        >
          획득 배지
        </button>
        <button
          className="show_order_by_not_acquired_badges badge_filter_box"
          onClick={() => setFilter("notAcquired")}
        >
          미획득 배지
        </button>
      </div>
      <div className="student_badge_list_container">
        {filteredBadges?.map((el, idx) => (
          <div
            className={`student_badge_list ${
              el.obtainDate ? "badge_acquired" : ""
            }`}
            key={el.badgeId}
          >
            <div
              className={`student_badge_box ${
                rotatedBadgeIds.includes(el.badgeId) ? "rotated" : ""
              }`}
              onClick={() => {
                handleBadgeClick(el.badgeId);
                console.log(el.badgeId);
              }}
            >
              {el.obtainCount > 0 ? (
                <div className="student_acquired_info_box">
                  <div className="shimmer"></div>
                  <div className="acquired_badge_info_box">
                    <img
                      className="student_badge_image"
                      alt="배지 이미지"
                      src={`${baseUrl}/image/${el.imagePath}`}
                    />
                    <h1 className="student_badge_name">{el.name}</h1>
                    <p className="student_badge_description">
                      {el.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="student_badge_info_box">
                  <img
                    className="student_badge_image"
                    alt="secret"
                    src="https://cdn-icons-png.flaticon.com/512/8890/8890972.png"
                  />
                  <h1 className="student_badge_name">{el.name}</h1>
                  <p className="student_badge_description">{el.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentBadge;
