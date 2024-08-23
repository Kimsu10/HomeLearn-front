import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TeacherQuestionBoardDetail.css";
import useAxiosGet from "../../hooks/useAxiosGet";
import StudentPatchModal from "../../components/Modal/StudentModal/StudentPatchModal";
import useAxiosPost from "../../hooks/useAxiosPost";
import useAxiosDelete from "../../hooks/useAxiosDelete";

const TeacherQuestionBoardDetail = ({ username, baseUrl }) => {
    const { boardId } = useParams();
    console.log(boardId);
    const loginUserName = localStorage.getItem("loginUser");
    const [openReModal, setOpenReModal] = useState({});

    const toggleReModal = (index) => {
        setOpenReModal((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // 작성글 GET 요청
    const { data: questionBoardDetail } = useAxiosGet(
        `/teachers/question-boards/${boardId}`
    );

    // 글 삭제 요청
    const { deleteRequest } = useAxiosDelete(
        `/teachers/question-boards/${boardId}`
    );

    // 글 수정 폼
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        file: null,
        username: username,
    });

    // 댓글 GET 요청
    const { data: comments } = useAxiosGet(
        `/teachers/question-boards/${boardId}/comments`
    );

    // 댓글 작성 요청
    const { postRequest } = useAxiosPost(
        `/teachers/question-boards/${boardId}/comments`
    );

    const questionBoardId = questionBoardDetail?.questionBoardId;
    const commentId = comments[0]?.commentId;

    // 댓글 삭제
    const { deleteRequest: deleteComment } = useAxiosDelete(
        `/teachers/question-boards/${questionBoardId}/comments/${commentId}`
    );

    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [text, setText] = useState("");
    const maxLength = 500;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");

    const textareas = document.querySelectorAll(
        ".teacher_question_comment_write_textarea"
    );

    textareas.forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";

        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    });

    useEffect(() => {
        if (questionBoardDetail) {
            setFormData({
                title: questionBoardDetail.title || "",
                content: questionBoardDetail.content || "",
                file: questionBoardDetail.filename || "",
            });
        }
    }, [questionBoardDetail]);

    const handleCheckTextCount = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";

        const curText = e.target.value;
        if (curText.length <= maxLength) {
            setText(curText);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file" && files.length > 0) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: files[0],
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            handleChange(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
    };

    const handleDelete = () => {
        if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
            deleteRequest()
                .then(() => {
                    alert("게시물이 삭제되었습니다.");
                })
                .catch((err) => {
                    console.error("게시물 삭제 실패:", err);
                    alert("게시물 삭제에 실패했습니다.");
                });
        }
    };

    const handleDeleteComment = () => {
        if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
            deleteComment()
                .then(() => {
                    alert("게시물이 삭제되었습니다.");
                })
                .catch((err) => {
                    console.error("게시물 삭제 실패:", err);
                    alert("게시물 삭제에 실패했습니다.");
                });
        }
    };

    const handleCommentSubmit = () => {
        const commentData = { content: text };
        postRequest(commentData);
        window.location.reload();
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const splitDate = (writeDate) => {
        if (writeDate) {
            return writeDate.slice(0, 10);
        }
        return "날짜 불러오기 실패";
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="teacher_main_container">
            <div className="teacher_question_detail_page_title_box">
                <h1 className="teacher_question_detail_page_title">질문 게시판</h1>
            </div>
            {/* 조회한 자유 게시판 글 */}
            <div className="teacher_question_detail_container">
                <h1 className="teacher_question_detail_title">{questionBoardDetail?.title}</h1>
                <p className="teacher_question_detail_content">
                    {questionBoardDetail?.content}
                </p>
                <div className="teacher_question_detail_info_box">
                    <div className="teacher_question_watcher_info_box">
                        <i className="bi bi-eye"></i>&nbsp;
                        <span className="teacher_question_view_count">
                            {questionBoardDetail?.viewCount}
                        </span>
                        &nbsp;&nbsp;
                        <i className="bi bi-star"></i>&nbsp;
                        <span className="teacher_question_view_like_count">
                            {questionBoardDetail?.scrapCount}
                        </span>
                    </div>
                    <div className="teacher_question_writer_info_box">
                        <span className="teacher_question_writer_name">
                            {questionBoardDetail?.author}&nbsp;
                        </span>
                        | &nbsp;
                        <span className="teacher_question_writer_date">
                            {splitDate(questionBoardDetail?.createTime)} &nbsp;
                        </span>
                        작성
                    </div>
                </div>
            </div>
            {/* 댓글 리스트 */}
            <div className="teacher_question_writer_comment_box">
                <i className="bi bi-chat"></i> &nbsp;
                <span className="teacher_question_comment_count">
                    {questionBoardDetail?.commentCount}
                </span>
            </div>
            {/* 댓글 작성 및 목록 */}
            <div className="teacher_question_comment_list_container">
                <div className="teacher_question_comment_write_form">
                    <div className="teacher_question_user_info_box">
                        <img
                            src={
                                questionBoardDetail.imagePath
                                    ? `${baseUrl}/image/${questionBoardDetail.imagePath}`
                                    : "/images/TeacherProfile.png"
                            }
                            className="teacher_question_user_profile"
                            alt=""
                        />
                        &nbsp;&nbsp;&nbsp;
                        <span className="teacher_question_user_name">
                            {loginUserName || "Unknown User"}
                        </span>
                    </div>
                    <textarea
                        className="teacher_question_current_write_textarea"
                        value={text}
                        onChange={handleCheckTextCount}
                        maxLength={maxLength}
                    ></textarea>
                    <div className="teacher_question_current_write_setting_box">
                        <div className="teacher_textarea_letter_count_box">
                            <span className="teacher_textarea_letter_count">{text.length}</span>
                            &nbsp;/&nbsp;
                            {maxLength}
                        </div>
                        <button
                            className="teacher_submit_btn"
                            onClick={handleCommentSubmit}
                        >
                            답변 등록
                        </button>
                    </div>
                </div>
            </div>
            {/* 기존 댓글 목록 */}
            {comments?.map((el, index) => (
                <div key={index} className="teacher_question_comment_list">
                    <div className="teacher_question_comment_written_user_info_box">
                        <div className="teacher_question_comment_user_info_box">
                            <img
                                src={
                                    comments[index]?.author === "ChatGPT"
                                        ? "/images/AIProfile.png"
                                        : comments[index]?.profileImageName === null
                                            ? "/images/TeacherProfile.png"
                                            : `${baseUrl}/image/${comments?.profileImageName}`
                                }
                                className="teacher_question_comment_user_profile"
                                alt=""
                            />
                            &nbsp;
                            <span className="teacher_question_comment_user_name">{el.author}</span>
                        </div>
                        {comments[index]?.author === loginUserName && (
                            <i
                                className="bi bi-three-dots-vertical teacher_question_comment_three_dot teacher_recomment_btn"
                                onClick={() => toggleReModal(index)}
                            ></i>
                        )}
                        {openReModal[index] && (
                            <div className="teacher_question_recomment_modify_box">
                                <button className="teacher_question_detail">수정</button>
                                <hr className="teacher_devide_button_border" />
                                <button
                                    className="teacher_question_detail"
                                    onClick={handleDeleteComment}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                    <textarea className="teacher_question_comment_write_textarea" readOnly>
                        {el.content}
                    </textarea>
                    <div className="teacher_question_comment_writedate_box">
                        <span className="teacher_question_comment_written_date">
                            {splitDate(el?.createTime)}&nbsp;
                            {formatTime(el?.createTime)}
                        </span>
                    </div>
                </div>
            ))}
            {/* 대댓글 목록 */}
            {questionBoardDetail?.recomments &&
                questionBoardDetail?.recomments.map((recomment, index) => (
                    <div key={index} className="teacher_question_recoment_list">
                        <div className="teacher_question_recoment_box">
                            <div className="teacher_question_written_user_info_box">
                                <div className="teacher_question_user_info_box">
                                    <img
                                        src={
                                            recomment?.author === "ChatGPT"
                                                ? "/images/AIProfile.png"
                                                : `${baseUrl}/image/${recomment?.userProfileImage}`
                                        }
                                        className="teacher_question_user_profile"
                                        alt=""
                                    />
                                    &nbsp;
                                    <span className="teacher_question_user_name">
                                        {recomment?.username}
                                    </span>
                                </div>

                                {/* <i className="bi bi-three-dots-vertical teacher_question_three_dot"></i> */}
                                <div className="teacher_question_recomment_modify_box">
                                    <button className="teacher_question_detail">수정</button>
                                    <hr className="teacher_devide_button_border" />
                                    <button className="teacher_question_detail">삭제</button>
                                </div>
                            </div>
                            <textarea className="teacher_question_write_textarea" readOnly>
                                {recomment?.text}
                            </textarea>
                            <div className="teacher_question_writedate_box">
                                <span className="teacher_question_written_date">{recomment?.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default TeacherQuestionBoardDetail;