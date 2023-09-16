import styled from "styled-components";

function MyPage() {
  const userEmail = localStorage.getItem("incourse_user_email");
  const userPhoto = localStorage.getItem("incourse_user_photo");
  const userNickname = localStorage.getItem("incourse_user_nickname");

  return (
    <WholeDiv>
      <div className="contentdiv">
        <div className="mypage-header-text">안녕하세요, {userNickname}님</div>
        <img className="mypage-user-photo" src={userPhoto} />
        <div className="userinfo-title-text">회원 정보</div>
        <div className="userinfo-contentdiv">
          <div className="userinfo-li">
            <div className="userinfo-li-text">닉네임</div>
            <div className="userinfo-li-subtext">{userNickname}</div>
          </div>
          <div className="userinfo-li">
            <div className="userinfo-li-text">이메일</div>
            <div className="userinfo-li-subtext">{userEmail}</div>
          </div>
        </div>
        <div className="userletter-title-text">
          <div className="userletter-title-text1">내가 읽은 레터</div>
          <div className="userletter-title-text2">총 0개</div>
        </div>
        <div className="userletter-contentdiv">아직 읽은 레터가 없어요.</div>
        <div className="usermembership-title-text">내 멤버십</div>
        <div className="usermembership-contentdiv">곧 공개 예정이에요!</div>
      </div>
    </WholeDiv>
  );
}

export default MyPage;

const WholeDiv = styled.div`
  .contentdiv {
    max-width: 1200px;
    margin: 0 auto;

    .mypage-header-text {
      margin-top: 210px;
      font-size: 26px;
      font-weight: 600;
    }
    .mypage-user-photo {
      margin-top: 34px;
      border-radius: 9999px;
      width: 130px;
      height: 130px;
    }
    .userinfo-title-text {
      margin-top: 90px;
      font-size: 22px;
      font-weight: 600;
    }
    .userinfo-contentdiv {
      padding: 12px 37px 28px 37px;
      margin-top: 38px;
      background-color: #f5f5f5;

      .userinfo-li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;

        .userinfo-li-text {
          font-size: 18px;
          font-weight: 600;
        }

        .userinfo-li-subtext {
          font-size: 18px;
        }
      }
    }

    .userletter-title-text {
      font-size: 22px;
      font-weight: 600;
      margin-top: 46px;
      display: flex;

      .userletter-title-text2 {
        margin-left: 10px;
        color: #d80600;
      }
    }

    .userletter-contentdiv {
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 280px;
      margin-top: 34px;
    }

    .usermembership-title-text {
      font-size: 22px;
      font-weight: 600;
      margin-top: 46px;
    }

    .usermembership-contentdiv {
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 280px;
      margin-top: 34px;
      margin-bottom: 90px;
    }
  }
`;
