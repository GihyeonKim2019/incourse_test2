import styled from "styled-components";
import loginBackgroundImage from "../images/background_f1.png";
import logoSymbolImage from "../images/warp_logo_symbol.png";
import GoogleSignin from "./GoogleSignin";
// import loginIconGoogle from "../images/login_icon_google.png";
import loginIconKakao from "../images/login_icon_kakao.png";
import { useState } from "react";

function Login() {
  const [alertText, setAlertText] = useState("");

  const kakaoClickHandle = async (e) => {
    setAlertText("카카오 로그인은 현재 준비중입니다.");
  };

  return (
    <WholeDiv>
      <div className="logindiv">
        <div className="loginbox">
          <img
            className="logo-symbol-image"
            src={logoSymbolImage}
            alt="와프 스토리 1인 기업가 비즈니스 교육"
          />
          <div className="loginbox-text-1">가장 빠른 비즈니스 성공 사례,</div>
          <div className="loginbox-text-2">와프 스토리</div>
          <div className="loginbox-buttonbox">
            <GoogleSignin />
            <div className="buttondiv-kakao" onClick={kakaoClickHandle}>
              <img
                className="buttondiv-kakao-logo"
                src={loginIconKakao}
                alt="카카오로 로그인하기"
              />
              <div className="buttondiv-kakao-text">
                카카오로 1초만에 로그인
              </div>
            </div>
            <div className="alert-text">{alertText}</div>
          </div>
        </div>
      </div>
    </WholeDiv>
  );
}

export default Login;

const WholeDiv = styled.div`
  background-image: url(${loginBackgroundImage});
  background-size: cover;
  background-position: center center;
  height: 100vh;
  width: 100%;

  .logindiv {
    max-width: 400px;
    display: flex;
    margin: 0 auto;

    .loginbox {
      flex-basis: 400px;
      margin-top: 90px;
      padding: 25px;

      -webkit-backdrop-filter: blur(50px) brightness(100%);
      backdrop-filter: blur(50px) brightness(100%);
      background-color: #ffffff03;

      display: flex;
      flex-direction: column;
      align-items: center;

      .logo-symbol-image {
        width: 100px;
        margin-top: 70px;
      }

      .loginbox-text-1 {
        margin-top: 50px;
        font-size: 26px;
        color: white;
        font-weight: 800;
      }

      .loginbox-text-2 {
        font-size: 26px;
        color: white;
        font-weight: 800;
      }

      .loginbox-buttonbox {
        margin-top: 90px;
        margin-bottom: 150px;
        width: 100%;

        .buttondiv-google {
          height: 60px;
          background-color: white;
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .buttondiv-google-logo {
            height: 30px;
            width: 30px;
            margin-left: 30px;
          }

          .buttondiv-google-text {
            margin-left: 15px;
          }
        }

        .buttondiv-google:hover {
          cursor: pointer;
          background-color: #f7f7f7;
          transition: all 0.2s ease-out;
        }

        .buttondiv-kakao {
          height: 60px;
          background-color: #fee500;
          display: flex;
          align-items: center;

          .buttondiv-kakao-logo {
            height: 30px;
            width: 30px;
            margin-left: 30px;
          }

          .buttondiv-kakao-text {
            margin-left: 15px;
          }
        }
        .buttondiv-kakao:hover {
          cursor: pointer;
          background-color: #eed700;
          transition: all 0.2s ease-out;
        }
      }
    }
  }

  .alert-text {
    margin-top: 14px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
