import styled from "styled-components";
import loginBackgroundImage from "../images/background_f1.png";
import logoSymbolImage from "../images/logo_symbol.png";
import GoogleSignin from "./GoogleSignin";

function Login() {
  return (
    <WholeDiv>
      <div className="logindiv">
        <div className="loginbox">
          <img className="logo-symbol-image" src={logoSymbolImage} />
          <div className="loginbox-text-1">가장 빠른 비즈니스 지름길,</div>
          <div className="loginbox-text-2">인코스</div>
          <div className="loginbox-buttonbox">
            <GoogleSignin />
            <div className="buttondiv-kakao">
              <img className="buttondiv-kakao-logo" />
              <div className="buttondiv-kakao-text">
                카카오로 1초만에 로그인
              </div>
            </div>
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
      }
    }
  }
`;
