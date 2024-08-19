import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import axios from "../../utils/axios";
import "./LoginFind.css";

function LoginFind() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중인지 여부 관리
  const navigate = useNavigate();
  const location = useLocation();
  const findType = location.pathname.includes("find-id") ? "id" : "password"; //  아이디 찾기 또는 비밀번호 찾기 구분

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // 이미 제출 중이면 아무 동작도 하지 않음
    }

    if (!email) {
      swal("입력 오류", "이메일을 입력하세요.", "warning"); // 이메일이 입력되지 않은 경우 경고
      return;
    }

    setIsSubmitting(true); // 제출 중 상태로 설정

    try {
      // API 요청 전 데이터와 요청 URL을 콘솔에 출력
      console.log(`Sending request to ${findType === "id" ? "/account/find-id" : "/account/send-code"}`);
      console.log("Email:", email);

      // 서버로 이메일 전송, 응답 처리
      const response = await axios.post(
        findType === "id" ? "/account/find-id" : "/account/send-code",
        { email }
      );

      console.log("Response:", response); // 서버 응답 출력

      if (response.status === 200) {
        // 요청 성공 시 사용자에게 알림 표시
        if (findType === "id") {
          swal("아이디 찾기 성공", `아이디: ${response.data}`, "success");
        } else {
          swal(
            "코드 전송 성공",
            "해당 이메일로 비밀번호 재설정 코드를 전송했습니다.",
            "success"
          );
          // 비밀번호 재설정 페이지로 이동, 이메일 전달
          navigate("/reset-password", { state: { email } });
        }
      } else {
        swal("오류", "해당 이메일로 등록된 정보가 없습니다.", "error"); // 요청 실패 시 오류 메시지 표시
      }
    } catch (error) {
      console.error("오류:", error); // 콘솔에 오류 출력
      swal("오류", "해당 이메일로 등록된 정보가 없습니다.", "error"); // 요청 실패 시 오류 메시지 표시
    } finally {
      setIsSubmitting(false); // 제출 완료 후 제출 중 상태 해제
    }
  };

  return (
    <div className="login-find-container">
      <form onSubmit={handleSubmit}>
        <h2 className="login-find-title">
          {findType === "id" ? "아이디 찾기" : "비밀번호 찾기"} {/* 페이지 제목 설정 */}
        </h2>
        <div className="login-find-input-group">
          <span className="login-find-email-title">이메일</span>
          <input
            className="login-find-input"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 입력값 업데이트
            disabled={isSubmitting} // 제출 중일 때 입력 필드 비활성화
          />
        </div>
        <div className="login-find-button-group">
          <button className="login-find-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "전송 중..." : "전송"} {/* 제출 중일 때 버튼 텍스트 변경 */}
          </button>
          <button
            className="login-find-back-button"
            type="button"
            onClick={() => navigate("/login")}
            disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
          >
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFind;
