import React, {useRef, useState} from "react";
import "./TeacherVote.css";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";
import { useNavigate } from "react-router-dom";

const TeacherVote = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosedVoteModalOpen, setIsClosedVoteModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openClosedVoteModal = () => setIsClosedVoteModalOpen(true);
    const closeClosedVoteModal = () => setIsClosedVoteModalOpen(false);

    const handleVoteDetailView = (voteId) => {
        navigate(`/teachers/voteDetail/${voteId}`);
    };

    const [selectedDate, setSelectedDate] = useState('');
    const dateInputRef = useRef(null);
    const [items, setItems] = useState(["", ""]); // 초기 항목 2개 (디폴트)
    const [isMultipleChoice, setIsMultipleChoice] = useState(false);
    const [isAnonymousVote, setIsAnonymousVote] = useState(false);

    // 항목 추가
    const handleAddItem = () => {
        setItems([...items, ""]);
    };

    // 항목 삭제
    const handleRemoveItem = (index) => {
        const newItems = items.filter((item, i) => i !== index);
        setItems(newItems);
    };

    const handleIconClick = () => {
        dateInputRef.current.showPicker();
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleVoteClose = () => {
        console.log("투표 마감 처리");
        closeClosedVoteModal();
    }

    return (
        <div className="teacher_vote_main_container">
            <div className="teacher_vote_page_title_box">
                <h1 className="teacher_vote_page_title">투표</h1>
                <span className="teacher_vote_page_enroll_btn" onClick={openModal}>
                    투표 등록
                </span>
            </div>

            {/* 진행 중인 투표 */}
            <div className="teacher_current_proceeding_vote_container">
                <div className="teacher_current_proceeding_vote_title_box">
                    <h3 className="teacher_current_proceeding_vote_box_name">
                        진행 중인 투표
                    </h3>
                    <div className="teacher_control_box_with_both_side">
                        <i className="bi bi-chevron-left teacher_Right_and_left_button"></i>
                        <i className="bi bi-chevron-right teacher_Right_and_left_button"></i>
                    </div>
                </div>

                {/* 진행 중인 투표 리스트 */}
                <div className="teacher_current_proceeding_vote_contents_container">
                    <div className="teacher_current_proceeding_vote_contents_title_box">
                        <h3 className="teacher_current_proceeding_vote_contents_title">
                            진도 속도 어떤가요?
                        </h3>
                        <span
                            className="teacher_go_to_proceeding_vote_page"
                            onClick={() => handleVoteDetailView(1)} // 1은 예시 ID입니다. 실제 투표 ID로 대체해야 합니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_current_proceeding_vote_contents">
                        지금 수업 진도가 빠른지 느린지 투표 부탁드립니다!
                    </p>
                    <div className="teacher_current_proceeding_vote_contents_additional_date_box">
                        <p className="">
                            <span className="teacher_current_proceeding_vote_contents_deadline teacher_geen_text">
                                2024.08.26. 11:00
                            </span>
                            &nbsp;까지
                        </p>
                        <div className="teacher_current_proceeding_vote_contents_right_box">
                            <p className="teacher_current_proceeding_vote_contents_Participants">
                                <span
                                    className="teacher_current_proceeding_vote_contents_Participants_count teacher_geen_text">
                                    28
                                </span>
                                &nbsp;명 참여
                            </p>
                            <span className="teacher_current_proceeding_vote_contents_endBtn" onClick={openClosedVoteModal}>
                                마감
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 마감된 투표 */}
            <div className="teacher_closed_vote_container">
                <div className="teacher_closed_vote_title_box">
                    <h3 className="teacher_closed_vote_box_name">
                        마감된 투표
                    </h3>
                    <div className="teacher_control_box_with_both_side">
                        <i className="bi bi-chevron-left teacher_Right_and_left_button"></i>
                        <i className="bi bi-chevron-right teacher_Right_and_left_button"></i>
                    </div>
                </div>

                {/* 마감된 투표 리스트 */}
                <div className="teacher_closed_vote_contents_container">
                    <div className="teacher_closed_vote_contents_title_box">
                        <h3 className="teacher_closed_vote_contents_title">
                            팀 프로젝트 조 짜는 방식
                        </h3>
                        <span
                            className="teacher_go_to_closed_vote_page"
                            onClick={() => handleVoteDetailView(2)} // 2는 예시 ID입니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_closed_assignment_contents">
                        팀 프로젝트 기간동안 함께 할 조를 어떻게 구성하면 좋을지 투표바랍니다!
                    </p>
                    <div className="teacher_closed_vote_contents_additional_data_box">
                        <p className="">
                            <span className="teacher_closed_vote_contents_deadline teacher_geen_text">
                                2024.07.05 23:59
                            </span>
                            &nbsp;종료
                        </p>
                        <p className="teacher_closed_vote_contents_Participants">
                            <span className="teacher_closed_vote_contents_Participants_count teacher_geen_text">
                                30
                            </span>
                            &nbsp;명 참여
                        </p>
                    </div>
                </div>
                <div className="teacher_closed_vote_contents_container">
                    <div className="teacher_closed_vote_contents_title_box">
                        <h3 className="teacher_closed_vote_contents_title">
                            미팅 진행 시간
                        </h3>
                        <span
                            className="teacher_go_to_closed_vote_page"
                            onClick={() => handleVoteDetailView(2)} // 2는 예시 ID입니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_closed_assignment_contents">
                        팀 별로 미팅 진행하려고 합니다. 각 팀원은 원하는 시간 투표 바랍니다!
                    </p>
                    <div className="teacher_closed_vote_contents_additional_data_box">
                        <p className="">
                            <span className="teacher_closed_vote_contents_deadline teacher_geen_text">
                                2024.07.03 14:00
                            </span>
                            &nbsp;종료
                        </p>
                        <p className="teacher_closed_vote_contents_Participants">
                            <span className="teacher_closed_vote_contents_Participants_count teacher_geen_text">
                                29
                            </span>
                            &nbsp;명 참여
                        </p>
                    </div>
                </div>
            </div>

            <TeacherModal isOpen={isModalOpen} onClose={closeModal}>
                <div className="teacher_vote_register_content">
                    <span className="teacher_vote_modalTitle">투표 등록</span>
                    <div className="teacher_vote_input_group">
                        <label>제목</label>
                        <input
                            type="text"
                            name="title"
                        />
                    </div>

                    <div className="teacher_vote_textarea_group">
                        <label>내용</label>
                        <textarea
                            name="description"
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                        >
                        </textarea>
                    </div>

                    <div className="teacher_vote_date_group">
                        <label>마감일</label>
                        <div className="date-input-wrapper">
                            <input
                                type="text"
                                value={selectedDate}
                                readOnly
                                className="teacher-date-input"
                            />

                            <input
                                type="date"
                                ref={dateInputRef}
                                onChange={handleDateChange}
                                className="hidden-date-input"
                            />
                            <i className="fa-solid fa-calendar-days" onClick={handleIconClick}></i>

                        </div>
                    </div>
                    <div className="teacher_vote_item_group">
                        <label>항목</label>
                        <div className="teacher_vote_item_list">
                            {items.map((item, index) => (
                                <div key={index} className="teacher_vote_item">
                                    <input
                                        type="text"
                                        name={`item-${index}`}
                                        defaultValue={item}  // 초기값 설정
                                    />
                                    {index > 1 && (
                                        <button type="button" className="teacher_remove_item_button" onClick={() => handleRemoveItem(index)}>
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddItem} className="teacher_add_item_button">
                            + 항목 추가
                        </button>
                    </div>

                    <div className="teacher_vote_checkbox_group">
                        <label className="teacher_checkbox_label">
                            <input
                                type="checkbox"
                                checked={isMultipleChoice}
                                onChange={() => setIsMultipleChoice(!isMultipleChoice)}
                            />
                            <span className="teacher_custom_checkbox"></span>
                            복수 선택
                        </label>
                        <label className="teacher_checkbox_label">
                            <input
                                type="checkbox"
                                checked={isAnonymousVote}
                                onChange={() => setIsAnonymousVote(!isAnonymousVote)}
                            />
                            <span className="teacher_custom_checkbox"></span>
                            익명 투표
                        </label>
                    </div>

                    <div className="teacher_vote_buttons">
                        <button className="teacher_vote_enrollBtn">
                            투표 등록
                        </button>
                        <button className="teacher_vote_cancelBtn" onClick={closeModal}>
                            등록 취소
                        </button>
                    </div>
                </div>
            </TeacherModal>

            <TeacherModal isOpen={isClosedVoteModalOpen} onClose={closeClosedVoteModal}>
                <div className="teacher_close_vote_modal_content">
                    <p className="teacher_close_vote_message">투표를 마감하시겠습니까?</p>
                    <div className="teacher_vote_closedButtons">
                        <button className="teacher_vote_endBtn" onClick={handleVoteClose}>
                            투표 마감
                        </button>
                        <button className="teacher_vote_endCancelBtn" onClick={closeClosedVoteModal}>
                            마감 취소
                        </button>
                    </div>
                </div>
            </TeacherModal>
        </div>
    )
}

export default TeacherVote;