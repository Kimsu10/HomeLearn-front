import React, {useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import './TeacherSideBar.css';
import useGetFetch from "../../hooks/useGetFetch";

const TeacherSideBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const location = useLocation();

    const { data: subject, error: subjectError } = useGetFetch("/data/student/mainpage/sidebar.json", []);

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/teachers/subject')) {
            setDropdownOpen('subject');
        } else if (path.startsWith('/teachers/notice')) {
            setDropdownOpen('notice');
        } else if (path.startsWith('/teachers/contact')) {
            setDropdownOpen('contact');
        } else {
            setDropdownOpen(null);
        }
    }, [location]);

    const toggleDropdown = (menu) => {
        setDropdownOpen(prevState => prevState === menu ? null : menu);
    };

    const isActive = (path) => {
        if (path === '/teachers') {
            return location.pathname === '/teachers' || location.pathname === '/teachers/';
        }
        return location.pathname.startsWith(path);
    };

    if(subjectError) {
        return <div>Error loading sidebar data</div>;
    }

    return (
        <div className="teacher_sideBar_container">
            <div className="teacher_sideBar_content">
                {/* Profile */}
                <div className="teacher_sideBar_profile_box">
                    <div className="teacher_sideBar_profile_left">
                        <div className="teacher_sideBar_profile_image">
                            <img className="teacher_sideBar_profile_img" alt="프로필"/>
                        </div>
                    </div>
                    <div className="teacher_sideBar_profile_right">
                        <span className="teacher_sideBar_profile_name">{/*{teacher.name}*/}신지원</span>
                        <span className="teacher_sideBar_profile_curriculum">{/*{curriculum.name} {curriculum.th}기*/}네이버 클라우드 데브옵스 10기</span>
                        <div className="teacher_sideBar_profile_progress_bar">
                            <div className="teacher_sideBar_profile_progress"></div>
                        </div>
                        <span
                            className="teacher_sideBar_profile_progress_text">{/*{curriculum.progress?.toFixed(1)} / 100%*/}75.2 / 100%</span>
                    </div>
                </div>

                <div className="teacher_sideBar_seperate_line"></div>

                <div className="teacher_sideBar_link">
                    <ul className="teacher_sideBar_menu">
                        {/* 1. Dashboard */}
                        <li>
                            <NavLink to="/teachers" end
                                     className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                대시보드
                            </NavLink>
                        </li>
                        {/* 2. Subject */}
                        <li className={`teacher_sideBar_dropdown ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                            <div
                                className={`teacher_sideBar_dropdownHeader ${isActive('/teachers/subject') ? 'active' : ''}`}
                                onClick={() => toggleDropdown('subject')}>
                                과목
                                <span
                                    className={`teacher_sideBar_dropdownArrow ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                                    <i className="fa-solid fa-caret-down"></i>
                                </span>
                            </div>
                            <ul className={`teacher_sideBar_subMenu ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                                <li>
                                    <span className="teacher_sideBar_subject_add_btn">과목 등록</span>
                                </li>
                                <div className="teacher_sideBar_seperate_line"></div>
                                {subject.subject?.map((el) => (
                                    <li key={el.id}>
                                        <NavLink to={`/teachers/${el.name}/board`}
                                                 className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                            {el.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        {/* 3. Assignment */}
                        <li>
                            <NavLink to="/teachers/assignment"
                                     className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                과제
                            </NavLink>
                        </li>
                        {/* 4. Lecture */}
                        <li>
                            <NavLink to="/teachers/lecture"
                                     className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                강의
                            </NavLink>
                        </li>
                        {/* 5. Question Board */}
                        <li>
                            <NavLink to="/teachers/questionBoard"
                                     className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                질문 게시판
                            </NavLink>
                        </li>
                        {/* 6. Notice */}
                        <li className={`teacher_sideBar_dropdown ${dropdownOpen === 'notice' ? 'open' : ''}`}>
                            <div
                                className={`teacher_sideBar_dropdownHeader ${isActive('/teachers/notice') ? 'active' : ''}`}
                                onClick={() => toggleDropdown('notice')}>
                                공지사항
                                <span
                                    className={`teacher_sideBar_dropdownArrow ${dropdownOpen === 'notice' ? 'open' : ''}`}>
                                        <i className="fa-solid fa-caret-down"></i>
                                    </span>
                            </div>
                            <ul className={`teacher_sideBar_subMenu ${dropdownOpen === 'notice' ? 'open' : ''}`}>
                                <li>
                                    <NavLink to="/teahcers/notice/teacherNotice"
                                             className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                        강사 공지사항
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/teachers/notice/managerNotice"
                                             className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                        매니저 공지사항
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        {/* 7. Contact */}
                        <li className={`teacher_sideBar_dropdown ${dropdownOpen === 'contact' ? 'open' : ''}`}>
                            <div
                                className={`teacher_sideBar_dropdownHeader ${isActive('/teachers/contact') ? 'active' : ''}`}
                                onClick={() => toggleDropdown('contact')}>
                                문의
                                <span
                                    className={`teacher_sideBar_dropdownArrow ${dropdownOpen === 'contact' ? 'open' : ''}`}>
                                        <i className="fa-solid fa-caret-down"></i>
                                    </span>
                            </div>
                            <ul className={`teacher_sideBar_subMenu ${dropdownOpen === 'contact' ? 'open' : ''}`}>
                                <li>
                                    <NavLink to="/teachers/contact/teacherContact"
                                             className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                        강사 문의
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/teachers/contact/managerContact"
                                             className={({isActive}) => isActive ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}>
                                        매니저 문의
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        {/* 8. Vote */}
                        <li>
                            <NavLink to="/teachers/vote"
                                     className={({isActive}) => isActive ? 'student_sideBar_link active' : 'student_sideBar_link'}>
                                투표
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="teacher_sideBar_line"></div>
        </div>
    );
}

export default TeacherSideBar;