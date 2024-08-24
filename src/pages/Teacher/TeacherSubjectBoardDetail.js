import "./TeacherSubjectBoardDetail.css";
import { useEffect, useState } from "react";
import useGetFetch from "../../hooks/useGetFetch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";
import { LogIn } from "lucide-react";

// 과목 게시판상세
const TeacherSubjectBoardDetail = ({ baseUrl }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const mainLectures = location.state?.mainLectures || {
        name: "",
        description: "",
        imagePath: "",
    };

    const { data: subjectBoardDetail } = useAxiosGet(
        `/teachers/subjects/${mainLectures.subjectId}/boards/${id}`
    );

    const { data: subjectBoards } = useAxiosGet(
        `teachers/subjects/${mainLectures.subjectId}/boards/${id}`,
        []
    );

    
   console.log(mainLectures.imagePath);


    return (
        <div className="teacher_subject_board_detail_main_container">
            <div className="teacher_lecutre_type_container">
            <img
          className="subject_board_type_image"
          alt="과목이미지"
          src={`${baseUrl}/image/${mainLectures?.imagePath}`}
        
        />
                <div className="teacher_lecture_description_box">
                    <h1 className="teacher_lecture_type_name">{mainLectures.name}</h1>
                    <p className="teacher_lecture_type_description">{mainLectures.description}</p>
                </div>
            </div>
            <h2 className="teacher_subject_board_page_title">과목 게시판</h2>
            {/* 여기부터 과목 게시글 내용 */}
            <div className="teacher_subject_board_title_box">
                <span className="teacher_subject_board_title">
                    {subjectBoardDetail.title}
                </span>
                <span
                    className="teacher_subject_board_view_count"
                    style={{ fontSize: "28px" }}
                >
                    <i className="bi bi-eye teacher_subject_board_view_count_icon"></i>
                    &nbsp; {subjectBoardDetail.viewCount}
                </span>
            </div>
            <div className="teacher_subject_board_body_container">
                {subjectBoardDetail.fileName && (
                    <a
                        href={subjectBoardDetail.filePath}
                        download={subjectBoardDetail.fileName}
                        className="teacher_subject_board_file_download"
                    >
                        <i className="bi bi-file-earmark-arrow-down"></i>
                        <span className="teacher_subject_board_download_file_name">
                            {subjectBoardDetail.fileName}
                        </span>
                    </a>
                )}
                <p className="teacher_subject_board_content">
                    {subjectBoardDetail.content}
                </p>

            </div>
        </div>
    );
};

export default TeacherSubjectBoardDetail;