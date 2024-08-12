import './Footer.css';

const Footer = () => {
  return (
      <footer id="footer">
          <div className="f-box">
              <div className="h-logo">
                  <a className="navbar-brand" href="/">
                      <img src="/images/logo/HomeLearn_Footer_Logo.png" alt="로고"/>
                  </a>
              </div>
              <ul className="f-gnb">
                  <li>
                      <a href="#none">이용약관</a>
                  </li>
                  <li>
                      <a href="#none">개인정보처리방침</a>
                  </li>
                  <li>
                      <a href="#none">소개 페이지</a>
                  </li>
              </ul>
              <p className="f-information">
                  서울특별시 강남구 강남대로 94길 20, 7층 (역삼동) | 02-3486-4600
              </p>
              <p className="f-copyright">
                  COPYRIGHT ⓒ Home Learn, ALL RIGHTS RESERVED.
              </p>
              <div className="f-team">
                  <span>정성진</span>
                  <span>노승빈</span>
                  <span>김승민</span>
                  <span>서준명</span>
                  <span>김수정</span>
                  <span>안성민</span>
                  <span>동재완</span>
              </div>
          </div>
      </footer>
  );
};

export default Footer;
