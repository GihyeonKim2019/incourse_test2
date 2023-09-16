import styled from "styled-components";
import todayStoryThumbnail from "../images/today_story_thumbnail.png";
import iconArrowLeft from "../images/icon_arrow_left.png";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase_config";
import { useEffect, useState } from "react";

function firestoreTimestampToFormattedDate(timestamp) {
  const xdate = new Date(timestamp.seconds * 1000);
  const formattedDate = xdate
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
    .replace(/\. /g, ".");
  const formattedTime = xdate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${formattedDate} ${formattedTime}`;
}

function Home() {
  const currentTime = new Date();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayStory, setTodayStory] = useState({
    articleTitle: "",
    articleNum: 1,
    joiners: [],
    publishTime: 1693816187,
    soldoutTime: 1693826187,
    apexText: "",
  });
  const [todayPublishTime, setTodayPublishTime] = useState(new Date());
  const [buttonText, setButtonText] = useState("");
  const [expectedText, setExpectedText] = useState("");
  const [enterButtonClickable, setEnterButtonClickable] = useState(false);
  const [publishTimePassed, setPublishTimePassed] = useState(false);

  useEffect(() => {
    {
      const interval = setInterval(() => {
        const now = new Date();
        const timestampDate = new Date(todayPublishTime.seconds * 1000);
        const timeDiff = timestampDate - now;

        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          setButtonText(
            `오픈까지 ${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          );
          setExpectedText("오픈예정");
          setPublishTimePassed(false);
        } else {
          setPublishTimePassed(true);
          setButtonText("읽기");
          setExpectedText("");
          clearInterval(interval);
          fetchListings();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [todayPublishTime]);

  useEffect(() => {
    fetchListings();
  }, []);

  const navigate = useNavigate();

  function enterButtonOnClick() {
    const isLogined = localStorage.getItem("incourse_islogined");
    console.log("enterButtonOnClick executed");
    if (enterButtonClickable && isLogined == "true") {
      navigate(`/storyview/${todayStory.articleNum}`);
    } else if (!enterButtonClickable && isLogined) {
      console.log("아티클 soldout");
    } else if (!isLogined) {
      navigate("/login");
    }
  }

  const fetchListings = async () => {
    try {
      const listingRef = collection(db, "article");
      const q = query(listingRef, orderBy("articleNum", "desc"), limit(1));
      const docSnap = await getDocs(q);
      const listings = [];
      docSnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setTodayStory({
        articleTitle: listings[0].data.articleTitle,
        articleNum: listings[0].data.articleNum,
        joiners: listings[0].data.joiners,
        publishTime: listings[0].data.publishTime,
        soldoutTime: listings[0].data.soldoutTime,
        apexText: listings[0].data.apexText,
        isSoldout: listings[0].data.isSoldout,
      });

      setTodayPublishTime(listings[0].data.publishTime);

      if (listings[0].data.joiners.length < 100) {
        if (publishTimePassed) {
          console.log("1-1 approved");
          setEnterButtonClickable(true);
        }
      }
      const userEmail = localStorage.getItem("incourse_user_email");
      if (listings[0].data.joiners.includes(userEmail)) {
        console.log("1-2 approved");
        setEnterButtonClickable(true);
      }

      console.log(enterButtonClickable);
      console.log(publishTimePassed);

      // var tempToday = {
      //   articleTitle: "",
      //   articleNum: 1,
      //   joiners: [],
      //   publishTime: 2694816187000,
      //   soldoutTime: 2694826187000,
      //   apexText: "",
      // };
      // listings.forEach((item) => {
      //   const itemTime = new Date(item.data.publishTime.seconds * 1000);
      //   // console.log(itemTime - currentTime);
      //   // console.log("item.data.publishTime: ", itemTime);
      //   // console.log("currentTime: ", currentTime);
      //   if (itemTime > currentTime && itemTime < tempToday.publishTime) {
      //     tempToday = {
      //       articleTitle: item.data.articleTitle,
      //       articleNum: item.data.articleNum,
      //       joiners: item.data.joiners,
      //       publishTime: itemTime,
      //       soldoutTime: item.data.soldoutTime,
      //       apexText: item.data.apexText,
      //     };
      //   }
      // });

      // setTodayStory(tempToday);
      // console.log(tempToday);
      // setTodayPublishTime(new Date(tempToday.publishTime * 1000));

      console.log("야", listings);
      setListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WholeDiv>
      <div className="today-story-div">
        <div className="today-story-header-text">오늘의 스토리</div>
        <div className="today-story-time">
          {firestoreTimestampToFormattedDate(todayPublishTime)}
          <div className="today-story-expected-text">{expectedText}</div>
        </div>
        <div className="today-story-contentdiv">
          <div className="today-story-leftdiv">
            <img className="today-story-image" src={todayStoryThumbnail} />
            <div className="today-story-title">{todayStory.articleTitle}</div>
          </div>
          <div className="today-story-centerdiv"></div>
          <div className="today-story-rightdiv">
            <div className="ticket-info-div">
              <div className="ticket-count-text">
                {Math.max(100 - todayStory.joiners.length, 0)}명 남았어요!
              </div>
              <div className="ticket-info-text">
                인코스의 스토리는 하루 동안만 오픈되며, 매일 100명만 읽을 수
                있습니다.
              </div>
            </div>
            <div>
              <div className="division-line"></div>
              <div className="business-info-title">사업 정보</div>
              <div className="business-info-div">
                <div className="business-info-li">
                  <div className="business-info-li-text">월 순익</div>
                  <div className="business-info-li-subtext">
                    $12,000,000 Revenue/mo
                  </div>
                </div>
                <div className="business-info-li">
                  <div className="business-info-li-text">공동창업자 수</div>
                  <div className="business-info-li-subtext">1</div>
                </div>
                <div className="business-info-li">
                  <div className="business-info-li-text">현재 직원 수</div>
                  <div className="business-info-li-subtext">57</div>
                </div>
              </div>
              <div className="apex-title-text">Apex moment</div>
              <div className="apex-content-text">{todayStory.apexText}</div>
              <div
                className={`join-button-div ${
                  enterButtonClickable ? "clickable" : ""
                }`}
                onClick={enterButtonClickable ? enterButtonOnClick : null}
              >
                <div className="join-button-text">{buttonText}</div>
              </div>
              <div className="join-info-div">
                <div className="join-info-time">08:11:19</div>
                <div className="join-info-text">후 열람 불가</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="incourse-introduce-div">
        <div className="incourse-introduce-header-text">What's Incourse?</div>
        <div className="incourse-introduce-contentdiv">
          <div className="incourse-introduce-content-text">
            인코스는 글로벌 기준 가장 효율적인 방법으로 비즈니스를 성공시킬 수
            있는 프리미엄 정보를 극소수의 사람에게 제공하는 뉴스레터입니다. 매일
            오전 11시에 100개의 한정 수량이 오픈되며, 소진 시 열람이 불가합니다.
          </div>
          <Link to={"/us"} className="incourse-introduce-content-buttondiv">
            <div className="incourse-introduce-content-button-text">
              더 알아보기
            </div>
            <img
              src={iconArrowLeft}
              className="incourse-introduce-content-button-logo"
            />
          </Link>
        </div>
      </div>
    </WholeDiv>
  );
}

export default Home;

const WholeDiv = styled.div`
  a {
    text-decoration: none;
  }

  .today-story-div {
    max-width: 1200px;
    margin: 0 auto;
    .today-story-header-text {
      font-size: 32px;
      font-weight: 600;
      margin-top: 60px;
    }
    .today-story-time {
      font-size: 18px;
      margin-top: 18px;
      display: flex;
    }
    .today-story-expected-text {
      color: #d80600;
      margin-left: 11px;
    }
    .today-story-contentdiv {
      margin-top: 18px;
      display: flex;
    }

    .today-story-leftdiv {
      flex-basis: 540px;
      flex-shrink: 1;

      .today-story-image {
        width: 100%;
      }

      .today-story-title {
        font-size: 28px;
        line-height: 34px;
        font-weight: 600;
        margin-top: 35px;
      }
    }

    .today-story-centerdiv {
      flex-basis: 95px;
    }

    .today-story-rightdiv {
      background-color: #f6f6f6;
      padding: 35px 40px;
      flex-basis: 500px;
      flex-shrink: 1;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .ticket-info-div {
        .ticket-count-text {
          color: #d80600;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 13px;
        }
        .ticket-info-text {
          margin-bottom: 23px;
          line-height: 18px;
        }
      }

      .division-line {
        border-top: 1px solid #444444;
        margin-bottom: 16px;
      }

      .business-info-title {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 23px;
      }

      .business-info-div {
        margin-bottom: 40px;

        .business-info-li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 11px;
          .business-info-li-text {
            font-size: 16px;
            font-weight: 600;
          }
          .business-info-li-subtext {
            font-size: 16px;
            font-weight: 400;
          }
        }
      }

      .apex-title-text {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 26px;
      }

      .apex-content-text {
        font-size: 18px;
        line-height: 22px;
        margin-bottom: 23px;
      }

      .join-button-div {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #d80600;
        height: 85px;
        color: white;
        margin-bottom: 23px;
        cursor: not-allowed;
        opacity: 0.5;

        .join-button-text {
          font-size: 28px;
          font-weight: 600;
        }
      }

      .join-button-div.clickable {
        cursor: pointer;
        opacity: 1;
      }

      .join-info-div {
        display: flex;
        justify-content: end;
        font-size: 16px;

        .join-info-time {
          color: #d70500;
        }
      }
    }
  }

  .incourse-introduce-div {
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 90px;
    margin-bottom: 90px;

    .incourse-introduce-header-text {
      font-size: 32px;
      font-weight: 600;
    }

    .incourse-introduce-contentdiv {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;

      .incourse-introduce-content-text {
        flex-basis: 700px;
        font-size: 18px;
        line-height: 22px;
      }

      .incourse-introduce-content-buttondiv {
        flex-basis: 340px;
        height: 80px;
        background-color: black;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .incourse-introduce-content-button-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-left: 30px;
        }

        .incourse-introduce-content-button-logo {
          width: 18px;
          margin-right: 30px;
        }
      }
    }
  }
`;
