import styled from "styled-components";
import logoTitleImg from "../images/logo_title.png";
import { Link } from "react-router-dom";
import { auth } from "../firebase_config";
import { useState, useEffect } from "react";

function Header() {
  const [isLogined, setIsLogined] = useState(
    localStorage.getItem("incourse_islogined") === "true"
  );

  useEffect(() => {
    setIsLogined(localStorage.getItem("incourse_islogined") === "true");
  }, []);

  return (
    <WholeDiv>
      <div className="logodiv">
        <Link to={"/"}>
          <div className="logoimgdiv"></div>
        </Link>
      </div>
      <div className="menudiv">
        <Link to={"/us"}>
          <div className="menuli">소개</div>
        </Link>
        {/* <Link to={"/articles"}>
          <div className="menuli">서킷 레터</div>
        </Link> */}
        {!isLogined && (
          <Link to={"/login"}>
            <div className="menuli">로그인</div>
          </Link>
        )}
        {isLogined && (
          <Link to={"/mypage"}>
            <div className="menuli">마이 페이지</div>
          </Link>
        )}
        {isLogined && (
          <div
            onClick={() => {
              auth.signOut();
              localStorage.setItem("incourse_islogined", "false");
              setIsLogined(false);
            }}
            className="menuli"
          >
            로그아웃
          </div>
        )}
      </div>
    </WholeDiv>
  );
}

export default Header;

const WholeDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #d80600;
  height: 50px;
  font-family: Pretendard Variable;

  a {
    text-decoration: none;
  }

  .logodiv {
    .logoimgdiv {
      width: 170px;
      height: 22px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      background-image: url(${logoTitleImg});
    }
  }

  .menudiv {
    display: flex;
    align-items: center;

    .menuli {
      display: flex;
      padding: 0 20px;
      justify-content: center;
      color: white;
    }
  }
`;
