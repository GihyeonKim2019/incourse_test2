import styled from "styled-components";
import logoTitleImg from "../images/logo_title.png";

function Footer() {
  return (
    <WholeDiv>
      <div className="footerdiv">
        <img className="logo-title-image" src={logoTitleImg} />
        <div className="content-leftdiv">
          <div className="business-name">(주)인코스코퍼레이션</div>
          <div className="business-info-div">
            <div>
              대표: 박채근 | 사업자등록번호: 302-81-777777 | 통신판매업
              신고번호: 2020-영등포-7777
            </div>
            <div>
              이메일: co@incourse.club | 주소: 서울시 동대문구 경희대로 26
              감의원창업센터 414호
            </div>
          </div>
          <div>@Incourse Inc.</div>
        </div>
      </div>
    </WholeDiv>
  );
}

export default Footer;

const WholeDiv = styled.div`
  background: #424242;
  min-height: 30px;
  color: white;
  padding: 90px 0 90px 0;

  .footerdiv {
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo-title-image {
    width: 230px;
    margin-bottom: 30px;
  }

  .business-name {
    margin-bottom: 20px;
  }

  .business-info-div {
    margin-bottom: 16px;
  }
`;
