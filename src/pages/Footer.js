import styled from "styled-components";
import logoTitleImg from "../images/warp_logo_title.png";

function Footer() {
  return (
    <WholeDiv>
      <div className="footerdiv">
        <img
          className="logo-title-image"
          src={logoTitleImg}
          alt="인코스, 가장 빠른 비즈니스 지름길"
        />
        <div className="content-leftdiv">
          <div className="business-name">와프 스토리</div>
          <div className="business-info-div">
            <div></div>
            <div>이메일: warpstory@gmail.com</div>
          </div>
          <div>@Warpstory Inc.</div>
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
