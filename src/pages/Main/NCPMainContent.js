import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import './NCPMainContent.css';

const NCPMainContent = () => {
    return (
        <div className="ncp_main-content">
            <Swiper
                direction={'vertical'}
                slidesPerView={1}
                spaceBetween={30}
                mousewheel={{
                    sensitivity: 1,
                    releaseOnEdges: true,
                }}
                speed={700}
                keyboard={{
                    enabled: true,
                }}
                pagination={{
                    clickable: true,
                    type: 'bullets',
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                    },
                }}
                modules={[Pagination, Mousewheel, Keyboard]}
                className="ncp_main-content__swiper"
            >
                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--welcome">
                        <span className="ncp_main-content_firstSection__k-digital-logo">K-Digital Training</span>
                        <span className="ncp_main-content_firstSection__sub-desc">네이버 클라우드 주도 디지털 인재 양성교육</span>
                        <h1 className="ncp_main-content_firstSection__title">네이버 클라우드 캠프 <br/>교육생 모집</h1>
                        <span className="ncp_main-content_firstSection__description">클라우드 기반 자바 웹 & 데브옵스 개발자 과정</span>
                        <div className="ncp_main-content_firstSection__education-container">
                            <div className="ncp_main-content__firstSection__education-info">
                                <div className="ncp_main-content_firstSection__education_title_box">
                                    <div className="ncp_main-content_firstSection__education_mark"></div>
                                    <div className="ncp_main-content_firstSection__education_title">교육 일정</div>
                                </div>
                                <div className="ncp_main-content_firstSection__education_date">기수별 수강 기간<br/>15기 : 2024-07-02 ~ 2025-01-08</div>
                                <div className="ncp_main-content_firstSection__education_time">교육 시간<br/>평일 09:30 ~ 18:00 (스터디 진행 시 22:00 까지)</div>
                                <ul>
                                    <li>실전 프로젝트 기반 중심 수업</li>
                                    <li>훈련 장려금 지원</li>
                                    <li>수강료: <s>18,730,800원</s> → 0원</li>
                                </ul>
                            </div>

                            <div className="ncp_main-content_firstSection__education-support">
                                <div className="ncp_main-content_firstSection__education_title_box">
                                    <div className="ncp_main-content_firstSection__education_mark"></div>
                                    <div className="ncp_main-content_firstSection__education_title">교육 지원</div>
                                </div>
                                <ul>
                                    <li>수료 후 6개월 간 취업 지원</li>
                                    <li>네이버 클라우드 파트너사 취업 연계</li>
                                    <li>IT 현직자 취업 특강 지원</li>
                                    <li>수료생 멘토링 지원</li>
                                    <li>1:1 커리어 코칭</li>
                                    <li>수료 후 취업 서비스 지원</li>
                                    <li>그룹스터디 운영</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--reason">
                        <div className="ncp_main-content_secondSection__reason_desc">비전공자도, 전공자도<br/><span>네이버 클라우드 캠프</span>를 찾는 이유는?</div>
                        <div className="ncp_main-content_secondSection__reason_container">
                            <div className="ncp_main-content_secondSection__reason_box">
                                <div className="ncp_main-content_secondSection__reason_title">네이버 클라우드의<br/>교육 커리큘럼</div>
                                <div className="ncp_main-content_secondSection__reason_description">이름만 네이버 클라우드 캠프가
                                    아닙니다. <br/>주관부터 교육까지, 네이버 클라우드가 선도합니다.
                                </div>
                                <div className="ncp_main-content_secondSection__reason_icon_box">
                                    <img className="ncp_main-content_secondSection__reason_firstIcon"
                                         src="/images/main/HomeLearn_MainFirstIcon.png"
                                         alt="아이콘"
                                    />
                                </div>
                                <div className="ncp_main-content_secondSection__reason_svg">
                                    <svg width="100%" height="120px" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <path d="M0,0 C30,20 70,20 100,0 L100,40 L0,40 Z" fill="#7CEA87"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ncp_main-content_secondSection__reason_box">
                                <div className="ncp_main-content_secondSection__reason_title">20년 경력<br/>네이버 클라우드 인증 강사진
                                </div>
                                <div className="ncp_main-content_secondSection__reason_description">네이버 클라우드가 직접 선별하여 <br/>최고의
                                    교육을 위한 최고의 강사진을 선별하였어요.
                                </div>
                                <div className="ncp_main-content_secondSection__reason_icon_box">
                                    <img className="ncp_main-content_secondSection__reason_secondIcon"
                                         src="/images/main/HomeLearn_MainSecondIcon.png"
                                         alt="아이콘"
                                    />
                                </div>
                                <div className="ncp_main-content_secondSection__reason_svg">
                                    <svg width="100%" height="120px" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <path d="M0,0 C30,20 70,20 100,0 L100,40 L0,40 Z" fill="#7CEA87"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ncp_main-content_secondSection__reason_box">
                                <div className="ncp_main-content_secondSection__reason_title">30여년 교육기관<br/>NCAMP의 실무 프로젝트
                                    노하우
                                </div>
                                <div className="ncp_main-content_secondSection__reason_description">NCAMP의 프로젝트는 국립
                                    중앙도서관에<br/>소장될 정도로 사회적으로 인정받고 있답니다.
                                </div>
                                <div className="ncp_main-content_secondSection__reason_icon_box">
                                    <img className="ncp_main-content_secondSection__reason_thirdIcon"
                                         src="/images/main/HomeLearn_MainThirdIcon.png"
                                         alt="아이콘"
                                    />
                                </div>
                                <div className="ncp_main-content_secondSection__reason_svg">
                                    <svg width="100%" height="120px" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <path d="M0,0 C30,20 70,20 100,0 L100,40 L0,40 Z" fill="#7CEA87"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--favor">
                        <div className="ncp_main-content_thirdSection__favor_desc"><span>네이버 클라우드 캠프</span>라서<br/>가능한 혜택!
                        </div>
                        <div className="ncp_main-content_thirdSection__favor_firstContainer">
                            <div className="ncp_main-content_thirdSection__favor_box">
                                <span className="ncp_main-content_thirdSection__favor_span">혜택 1</span>
                                <div className="ncp_main-content_thirdSection__favor_title">월 최대<br/><span>316,000원</span>
                                </div>
                                <div className="ncp_main-content_thirdSection__favor_description">출석일수에 따라 훈련 장려금이
                                    지원됩니다.<br/>월 최대 316,000원 지원 / 제외 대상 : 근로자 & 사업자
                                </div>
                            </div>
                            <div className="ncp_main-content_thirdSection__favor_box">
                                <span className="ncp_main-content_thirdSection__favor_span">혜택 2</span>
                                <div className="ncp_main-content_thirdSection__favor_title"><span>네이버 클라우드 자격증</span><br/>취득
                                    지원
                                </div>
                                <div className="ncp_main-content_thirdSection__favor_description">네이버 클라우드를 더욱 깊게 이해하기
                                    위한<br/>NCA, NCP 자격증 취득 지원
                                </div>
                            </div>
                            <div className="ncp_main-content_thirdSection__favor_box">
                                <span className="ncp_main-content_thirdSection__favor_span">혜택 3</span>
                                <div className="ncp_main-content_thirdSection__favor_title"><span>네이버 클라우드 바우처 증정</span><br/>250만원 상당</div>
                                <div className="ncp_main-content_thirdSection__favor_description">250만원 상당의 바우처 증정하여<br/>개발에만 몰두할 수 있는 환경 제공</div>
                            </div>
                        </div>

                        <div className="ncp_main-content_thirdSection__favor_secondContainer">
                            <div className="ncp_main-content_thirdSection__favor_box">
                                <span className="ncp_main-content_thirdSection__favor_span">혜택 4</span>
                                <div className="ncp_main-content_thirdSection__favor_title">
                                    현직 개발자와의<br/><span>프로젝트 멘토링</span>
                                </div>
                                <div className="ncp_main-content_thirdSection__favor_description">250만원 상당의 바우처 증정으로<br/>원하시는
                                    모든 것을 개발할 수 있습니다.
                                </div>
                            </div>
                            <div className="ncp_main-content_thirdSection__favor_box">
                                <span className="ncp_main-content_thirdSection__favor_span">혜택 5</span>
                                <div className="ncp_main-content_thirdSection__favor_title">
                                    <span>전문 서적 지원</span><br/>네이버 클라우드 인증 강사진
                                </div>
                                <div className="ncp_main-content_thirdSection__favor_description">6개월 동안 총 8권의 전공 서적 지원<br/>네이버 클라우드가 인증한 Ncamp 최고의<br/>강사진에게 받는 개발 수업
                                </div>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--project">
                        <div className="ncp_main-content_fourthSection__project_title">네이버 클라우드의<br/><span>실무 프로젝트</span></div>
                        <div className="ncp_main-content_fourthSection__project_desc">과목별 실습으로 과정의 흐름을<br/>실무 중심 프로젝트에서 개발자의 마인드를 배웁니다.</div>
                        <div className="ncp_main-content_fourthSection__project_container">
                            <div className="ncp_main-content_fourthSection__project_box">
                                <div className="ncp_main-content_fourthSection__project_box_title">과정 1</div>
                                <div className="ncp_main-content_fourthSection__project_box_desc">IT와 개발을 이해하기 위한<br/><span>기본적인 개념 설명</span></div>
                            </div>
                            <div className="ncp_main-content_fourthSection__project_box">
                                <div className="ncp_main-content_fourthSection__project_box_title">과정 2</div>
                                <div className="ncp_main-content_fourthSection__project_box_desc">미니 프로젝트로<br/><span>간단한 시나리오 분석 전략 수립</span></div>
                            </div>
                            <div className="ncp_main-content_fourthSection__project_box">
                                <div className="ncp_main-content_fourthSection__project_box_title">과정 3</div>
                                <div className="ncp_main-content_fourthSection__project_box_desc">네이버 클라우드만의 노하우로<br/><span>실무 중심 프로젝트 진행</span></div>
                            </div>
                        </div>
                        <div className="ncp_main-content_fourthSection__project_btn">
                            <a href="https://ncamp.magicecole.com/Home/ProjectList">수료생 프로젝트 보러가기</a>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--apply">
                        <div className="ncp_main-content_fifthSection__apply_container">
                            <div className="ncp_main-content_fifthSection__apply_title">신청 방법</div>
                            <div className="ncp_main-content_fifthSection__apply_desc">국민내일배움카드 소지자는 <span>교육비 전액 무료 지원</span><br/>매월 <span>지원 훈련 장려금 지급</span></div>
                            <div className="ncp_main-content_fifthSection__apply_box">
                                <div className="ncp_main-content_fifthSection__apply_stepBox">
                                    <div className="ncp_main-content_fifthSection__apply_stepNum">STEP 01</div>
                                    <hr/>
                                    <div className="ncp_main-content_fifthSection__apply_stepTitle">수강신청</div>
                                    <div className="ncp_main-content_fifthSection__apply_stepDesc">신청 사이트 수강 신청</div>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_arrow">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_stepBox">
                                    <div className="ncp_main-content_fifthSection__apply_stepNum">STEP 02</div>
                                    <hr/>
                                    <div className="ncp_main-content_fifthSection__apply_stepTitle">1차 서류 전형</div>
                                    <div className="ncp_main-content_fifthSection__apply_stepDesc">서류 전형 및 사전 테스트</div>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_arrow">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_stepBox">
                                    <div className="ncp_main-content_fifthSection__apply_stepNum">STEP 03</div>
                                    <hr/>
                                    <div className="ncp_main-content_fifthSection__apply_stepTitle">2차 면접 전형</div>
                                    <div className="ncp_main-content_fifthSection__apply_stepDesc">면접 전형 및 인성 검사</div>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_arrow">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </div>
                                <div className="ncp_main-content_fifthSection__apply_stepBox">
                                    <div className="ncp_main-content_fifthSection__apply_stepNum">STEP 04</div>
                                    <hr/>
                                    <div className="ncp_main-content_fifthSection__apply_stepTitle">최종 선발</div>
                                    <div className="ncp_main-content_fifthSection__apply_stepDesc">최종 합격</div>
                                </div>
                            </div>
                        </div>

                        <div className="ncp_main-content_fifthSection__card_container">
                            <div className="ncp_main-content_fifthSection__card_box">
                                <div className="ncp_main-content_fifthSection__card_list">
                                    <ul className="ncp_main-content_fifthSection__card_text">
                                        <li>
                                            <img
                                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1712cbe9-c91d-44fb-8ad8-e1ea482cbf67?apiKey=f882c082add145da81e61630a3faa16c"
                                                alt="체크 아이콘"/>
                                            <span>내일배움카드 발급</span>이 발급 가능하고
                                        </li>
                                        <li>
                                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1712cbe9-c91d-44fb-8ad8-e1ea482cbf67?apiKey=f882c082add145da81e61630a3faa16c" alt="체크 아이콘" />
                                            <span>오전 9시 ~ 오후 6시</span>까지 수업 참여가 가능한
                                        </li>
                                        <li>
                                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1712cbe9-c91d-44fb-8ad8-e1ea482cbf67?apiKey=f882c082add145da81e61630a3faa16c" alt="체크 아이콘" />
                                            <span>취업을 목표</span>로 하는 미취업자, 대학 재 · 휴학 및 졸업 예정자
                                        </li>
                                    </ul>

                                    <ul className="ncp_main-content_fifthSection__card_grade">
                                        <li>[재학생 기준]</li>
                                        <li>4년제 : 2학년 2학기 종료 시점부터 지원 가능</li>
                                        <li>3년제 : 1학년 2학기 종료 시점부터 지원 가능</li>
                                        <li>2년제 : 입학 시점부터 지원 가능</li>
                                    </ul>
                                </div>
                                <div className="ncp_main-content_fifthSection__card_image_box">
                                    <img
                                        className="ncp_main-content_fifthSection_card_img"
                                        src="/images/main/HomeLearn_MainCardIcon.png"
                                        alt="카드 이미지" />
                                    <span className="ncp_main-content_fifthSection__card_btn">
                                        <a href="https://www.hrd.go.kr/hrdp/gi/pgiao/PGIAO0302D.do?svcMngnId=13535&svno=P0165&pageIndex=1&lawordFormatSeqNo=&gover=1">내일 배움 카드 발급 받기<i className="fa-solid fa-chevron-right"></i>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--map">
                        <div className="ncp_main-content_sixthSection__map_title">교육 장소</div>
                        <div className="ncp_main-content_sixthSection__map_desc">강남역 도보 4분 거리의 위치로<br/>지하철, 광역 버스 등 교통 시설 이용이 편리합니다.</div>
                        <div className="ncp_main-content_sixthSection__map_container">
                            <div className="ncp_main-content_sixthSection__map_img">
                                <img src="/images/main/HomeLearn_MainMap.png" alt="지도"/>
                            </div>
                            <div className="ncp_main-content_sixthSection__map_address_box">
                                <span className="ncp_main-content_sixthSection__map_text">NCAMP 비트캠프 강남 센터</span>
                                <div className="ncp_main-content_sixthSection__map_address_text">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/bec0035e-98fc-4557-a8b6-e799edce35bf?apiKey=f882c082add145da81e61630a3faa16c&" alt="로고"/>
                                    <span>상세주소</span>
                                    <span>서울 강남구 강남대로 94길 20 삼오빌딩 5-7층</span>
                                </div>
                                <div className="ncp_main-content_sixthSection__map_address_text">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd570749-b456-4b33-9e42-03e51b36a38c?apiKey=f882c082add145da81e61630a3faa16c&" alt="로고"/>
                                    <span>대중교통</span>
                                    <span>지하철 강남역 11번 출구로 나와 도보 4분</span>
                                </div>
                                <div className="ncp_main-content_sixthSection__map_address_text">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe87d6c6-3e4e-41e7-af63-92891991f811?apiKey=f882c082add145da81e61630a3faa16c&" alt="로고"/>
                                    <span>전화번호</span>
                                    <span>02 3486 0070</span>
                                </div>
                                <div className="ncp_main-content_sixthSection__map_address_text">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d6d4078c-a6bb-482d-8532-4fc8dbfe7641?apiKey=f882c082add145da81e61630a3faa16c&" alt="로고"/>
                                    <span>홈페이지</span>
                                    <span><a href="https://ncamp.kr">https://ncamp.kr</a></span>
                                </div>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>

                <SwiperSlide>
                    <section className="ncp_main-content__section ncp_main-content__section--question">
                        <div className="ncp_main-content_seventhSection__question_background">
                            <div className="ncp_main-content_seventhSection__question_container">
                                <div className="ncp_main-content_seventhSection__question_text">
                                    <span>아직 고민되는 부분이 있으시다면?</span>
                                    <span>1:1 상담 혹은 과정 설명을 신청하세요!<br/>궁금한 내용을 꼼꼼하게 설명해 드릴게요!</span>
                                    <span>문의 02 3486 0070</span>
                                    <span>NCAMP 비트캠프 강남 센터 고객님의 소중한 개인정보를<br/>상담 외 어떠한 목적으로도 사용하지 않습니다.</span>
                                </div>
                                <div className="ncp_main-content_seventhSection__question_image">
                                    <img
                                        className="ncp_main-content_seventhSection_question_img"
                                        src="/images/main/HomeLearn_MainQuestionIcon.png"
                                        alt="질문 이미지"/>
                                </div>
                            </div>
                        </div>
                    </section>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default NCPMainContent;
