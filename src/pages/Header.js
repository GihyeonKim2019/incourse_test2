import styled from "styled-components";
import logoTitleImg from "../images/warp_logo_title.png";
import { Link } from "react-router-dom";
import { auth } from "../firebase_config";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)"
  });
  return <>{isMobile && children}</>
}

export const Pc = ({children}) => {
  const isPc = useMediaQuery({
    query: "(min-width: 769px)"
  });
  return <>{isPc && children}</>
}


function Header() {
  const [isLogined, setIsLogined] = useState(
    localStorage.getItem("incourse_islogined") === "true"
  );
  const [isToggled, setIsToggled] = useState(false);

  const toggleClickHandle = async (e) => {
    setIsToggled(!isToggled);
  }

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
        <Mobile>
          <div className="mobile-hamburger" onClick={toggleClickHandle}>메뉴</div>
          <div className="mobile-toggled-menu">
            {isToggled && (
              <div className="mobile-toggled-lidiv">
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
            )}
          </div>
        </Mobile>
        <Pc><Link to={"/us"}>
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
        )}</Pc>
      </div>
    </WholeDiv>
  );
}

export default Header;

const WholeDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #8e35ff;
  height: 50px;
  font-family: Pretendard Variable;

  a {
    text-decoration: none;
  }

  .logodiv {
    .logoimgdiv {
      width: 150px;
      height: 22px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
      background-image: url(${logoTitleImg});
    }
  }

  .mobile-hamburger {
    color: white;
    margin-right: 20px;
  }

  .mobile-toggled-menu {
    position: absolute;
    
    background-color: #8732f4;
    top: 50px;
    
    right: 0px;

    a {
      font-size: 16px;
    }

    .mobile-menuli {
      height: 40px;
      font-size: 16px;
    }
  }

  .menudiv {
    display: flex;
    align-items: center;

    .menuli {
      display: flex;
      padding: 0 20px;
      justify-content: center;
      align-items: center;
      color: white;
      height: 40px;
    }
  }
`;
