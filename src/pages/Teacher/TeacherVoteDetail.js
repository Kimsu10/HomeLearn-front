import React, {useEffect, useRef, useState} from "react";
import "./TeacherVoteDetail.css";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";
import {useNavigate, useParams} from "react-router-dom";

const TeacherVoteDetail = ({ username }) => {
    const { voteId } = useParams(); // voteId 가져오기

    const navigate = useNavigate();
    const [isClosedVoteModalOpen, setIsClosedVoteModalOpen] = useState(false);
    const [isDeleteVoteModalOpen, setIsDeleteVoteModalOpen] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVoterContainerVisible, setIsVoterContainerVisible] = useState(false);
    const dropdownRef = useRef(null);

    const openClosedVoteModal = () => setIsClosedVoteModalOpen(true);
    const closeClosedVoteModal = () => setIsClosedVoteModalOpen(false);
    const openDeleteVoteModal = () => setIsDeleteVoteModalOpen(true);
    const closeDeleteVoteModal = () => setIsDeleteVoteModalOpen(false);

    const handleVoteListView = () => {
        navigate(`/teachers/teacherVote`);
    };

    const handleVoteClose = () => {
        console.log("투표 마감 처리");
        closeClosedVoteModal();
    }

    const handleDeleteClose = () => {
        console.log("투표 삭제 처리");
        closeDeleteVoteModal();
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const toggleVoterContainer = () => {
        setIsVoterContainerVisible(!isVoterContainerVisible);
    }

    useEffect(() => {
        console.log(`Loading data for vote ID: ${voteId}`);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (dropdownRef.current) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            if (dropdownRef.current) {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };

    }, [voteId]);

    return (
        <div className="teacher_voteDetail_main_container">
            <div className="teacher_voteDetail_page_title_box">
                <h1 className="teacher_voteDetail_page_title">투표</h1>
                <span className="teacher_voteDetail_page_list_btn" onClick={handleVoteListView}>
                    투표 목록
                </span>
            </div>

            <div className="teacher_voteDetail_content_container">
                <div className="teacher_voteDetail_content_title_box">
                    <h3 className="teacher_voteDetail_content_title_box_name">
                        투표 상세 보기
                    </h3>
                </div>

                <div className="teacher_voteDetail_content_vote_container">
                    <div className="teacher_voteDetail_content_firstLine">
                        <div className="teacher_voteDetail_content_firstLine_left">
                            <div className="teacher_voteDetail_content_status">
                                <span className="teacher_voteDetail_content_status_text">진행 중</span>
                            </div>
                            <h3 className="teacher_voteDetail_content_title_text">진도 속도 어떤가요?</h3>
                        </div>
                        <div className="teacher_voteDetail_content_firstLine_right" ref={dropdownRef}>
                            <span className="teacher_voteDetail_moreBtn" onClick={toggleDropdown}>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </span>
                            <ul className={`teacher_voteDetail_dropdown_menu ${isDropdownOpen ? "open" : ""}`}>
                                <li>
                                    <button className="teacher_voteDetail_deleteBtn" onClick={openDeleteVoteModal}>
                                        삭제
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="teacher_voteDetail_content_description">
                        <p>지금 수업 진도가 빠른지 느린지 투표 부탁드립니다!</p>
                    </div>
                    <div className="teacher_voteDetail_content_voteBarList">
                        <div className="teacher_voteDetail_content_voteFirstList">
                            <div className="teacher_voteDetail_content_voteFirstList_text">
                                <span className="teacher_voteDetail_content_voteFirst_text">빠름</span>
                                <span className="teacher_voteDetail_content_voteSecond_text">23명</span>
                            </div>
                            <div className="teacher_voteDetail_content_voteBar">
                                <div className="teacher_voteDetail_content_voteProgressFirstBar"></div>
                            </div>
                        </div>
                        <div className="teacher_voteDetail_content_voteSecondList">
                            <div className="teacher_voteDetail_content_voteSecondList_text">
                                <span className="teacher_voteDetail_content_voteFirst_text">느림</span>
                                <span className="teacher_voteDetail_content_voteSecond_text">5명</span>
                            </div>
                            <div className="teacher_voteDetail_content_voteBar">
                                <div className="teacher_voteDetail_content_voteProgressSecondBar"></div>
                            </div>
                        </div>
                    </div>

                    <div className="teacher_voteDetail_content_additional_date_box">
                        <p className="">
                            <span className="teacher_voteDetail_content_deadline teacher_geen_text">
                                2024.08.26. 11:00
                            </span>
                            &nbsp;까지
                        </p>
                        <div className="teacher_voteDetail_content_right_box">
                            <p className="teacher_voteDetail_content_Participants" onClick={toggleVoterContainer}>
                                <span
                                    className="teacher_voteDetail_content_Participants_count teacher_geen_text">
                                    28
                                </span>
                                &nbsp;명 참여 ⟩
                            </p>
                            <span className="teacher_voteDetail_content_endBtn"
                                  onClick={openClosedVoteModal}>
                                마감
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`teacher_voteDetail_content_voter_container ${isVoterContainerVisible ? "open" : ""}`}>
                    <div className="teacher_voteDetail_content_voter_leftList">
                        <h3 className="teacher_voteDetail_content_voter_left_title">
                            전체 투표
                        </h3>
                        <div className="teacher_voteDetail_content_voter_left_text">
                            전체 <span>28</span>명
                        </div>
                        <div className="teacher_voteDetail_content_voterAll_list">
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">강보현</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">강현욱</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김상우</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김수정</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김승민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김태웅</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">노승빈</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">동재완</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">문재영</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">서준명</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">서창호</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">손유정</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">송예준</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">신지원</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">신지현</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">안성민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">엄지훈</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">오민택</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">오태경</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">유가영</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">이호준</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">전상민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">전유탁</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">정성진</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">조서영</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">최시호</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">최재원</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">홍화연</span>
                            </div>
                        </div>
                    </div>
                    <div className="teacher_voteDetail_content_voter_line"></div>

                    <div className="teacher_voteDetail_content_voter_rightList">
                        <h3 className="teacher_voteDetail_content_voter_right_title">
                            항목 별 투표
                        </h3>
                        <div className="teacher_voteDetail_content_voter_rightTop_text">
                            빠름 <span>23</span>명
                        </div>
                        <div className="teacher_voteDetail_content_voter_rightTopList">
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">강보현</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">강현욱</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김상우</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김수정</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김승민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">김태웅</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">노승빈</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">동재완</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">문재영</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">송예준</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">신지원</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">신지현</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">안성민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">엄지훈</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">오민택</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">오태경</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">유가영</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">이호준</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">전상민</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">전유탁</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">최시호</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">최재원</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">홍화연</span>
                            </div>
                        </div>

                        <div className="teacher_voteDetail_content_voter_rightLine"></div>

                        <div className="teacher_voteDetail_content_voter_rightBottom_text">
                            느림 <span>5</span>명
                        </div>
                        <div className="teacher_voteDetail_content_voter_rightBottomList">
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">서준명</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">서창호</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">손유정</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">정성진</span>
                            </div>
                            <div className="teacher_voteDetail_content_voter_profile">
                                <div className="teacher_voteDetail_content_voter_profile_img"></div>
                                <span className="teacher_voteDetail_content_voter_profile_name">조서영</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <TeacherModal isOpen={isDeleteVoteModalOpen} onClose={closeDeleteVoteModal}>
                <div className="teacher_close_vote_modal_content">
                    <p className="teacher_close_vote_message">투표를 삭제하시겠습니까?</p>
                    <div className="teacher_vote_DeleteButtons">
                        <button className="teacher_vote_deleteBtn" onClick={handleDeleteClose}>
                            투표 삭제
                        </button>
                        <button className="teacher_vote_deleteCancelBtn" onClick={closeDeleteVoteModal}>
                            삭제 취소
                        </button>
                    </div>
                </div>
            </TeacherModal>
        </div>
    )
}

export default TeacherVoteDetail;