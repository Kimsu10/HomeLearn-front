import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import swal from "sweetalert";
import axios from "../../utils/axios";
import "./LoginFind.css";

function LoginFind() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const findType = location.pathname.includes("find-id") ? "id" : "password";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      swal("입력 오류", "이메일을 입력하세요.", "warning");
      return;
    }

    try {
      const response = await axios.post(
        findType === "id" ? "/account/find-id" : "/account/send-code",
        { email }
      );

      if (response.status === 200) {
        if (findType === "id") {
          swal("아이디 찾기 성공", `아이디: ${response.data}`, "success");
        } else {
          swal(
            "코드 전송 성공",
            "해당 이메일로 비밀번호 재설정 코드를 전송했습니다.",
            "success"
          );
          navigate("/reset-password", { state: { email } }); // 이메일을 상태로 전달
        }
      } else {
        swal("오류", "해당 이메일로 등록된 정보가 없습니다.", "error");
      }
    } catch (error) {
      console.error("오류:", error);
      swal("오류", "해당 이메일로 등록된 정보가 없습니다.", "error");
    }
  };

  return (
    <div className="login-find-container">
      <form onSubmit={handleSubmit}>
        <h2 className="login-find-title">
          {findType === "id" ? "아이디 찾기" : "비밀번호 찾기"}
        </h2>
        <div className="login-find-input-group">
          <span className="login-find-email-title">이메일</span>
          <input
            className="login-find-input"
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-find-button-group">
          <button className="login-find-button" type="submit">
            전송
          </button>
          <button
            className="login-find-back-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFind;
