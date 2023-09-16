import { useEffect, useState } from "react";
import styled from "styled-components";
import logoSymbol2 from "../images/logo_symbol_2.png";
import storyScoreBanner from "../images/story_score_banner.png";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase_config";
import { useParams } from "react-router-dom";

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

function StoryView() {
  const { articleNum } = useParams();

  const [storyTitle, setStoryTitle] = useState(
    "23살에 음료수 브랜드를 월 110만 달러 규모로 성장시킨 비결"
  );
  const [storyTime, setStoryTime] = useState("2023.08.27(수) 11:00:00");
  const [scoreNumber, setScoreNumber] = useState(1);

  const [article, setArticle] = useState(null);

  function calculateScore(joiners) {
    const userEmail = localStorage.getItem("incourse_user_email");
    const index = joiners.indexOf(userEmail);

    if (index !== -1) {
      return index + 1;
    }
    return 0;
  }

  useEffect(() => {
    async function fetchArticle() {
      try {
        const articlesCollection = collection(firestore, "article");
        const q = query(
          articlesCollection,
          where("articleNum", "==", Number(articleNum))
        );
        const docSnapshots = await getDocs(q);

        console.log(docSnapshots);

        if (!docSnapshots.empty) {
          const docSnapshot = docSnapshots.docs[0];
          const data = docSnapshot.data();
          console.log(data, "여기보세요");
          data.id = docSnapshot.id;
          if (Array.isArray(data.joiners) && data.joiners.length < 100) {
            setArticle({ ...data, id: docSnapshots.docs[0].id });
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    }

    fetchArticle();
  }, []);

  useEffect(() => {
    if (article) {
      const userEmail = localStorage.getItem("incourse_user_email");
      if (!article.joiners.includes(userEmail)) {
        const updatedJoiners = [...article.joiners, userEmail];
        const isSoldOut = updatedJoiners.length >= 100;

        const articleDoc = doc(firestore, "article", article.id);

        console.log("updatedJoiners:", updatedJoiners);

        updateDoc(articleDoc, {
          joiners: updatedJoiners,
          isSoldout: isSoldOut,
        }).catch((error) => {
          console.error("Error updating article:", error);
        });
      }
      setScoreNumber(calculateScore(article.joiners));
    }
  }, [article]);

  if (!article) return <p>Article not found or already full.</p>;

  return (
    <WholeDiv>
      <div className="headerdiv">
        <div className="headerdiv-contentdiv">
          <div className="story-title">{article.articleTitle}</div>
          <div className="authordiv">
            <div className="author-logo"></div>
            <div className="author-text">인코스 뉴스레터</div>
          </div>
          <div className="story-time">
            {firestoreTimestampToFormattedDate(article.publishTime)}
          </div>
        </div>
      </div>
      <div className="introdiv">
        <div className="intro-contentdiv">
          <div className="intro-text">
            가장 빠른 비즈니스 지름길, 인코스입니다. <br />
            <br />
            경쟁에서 사소한 우위를 가져다주는 최전선 비즈니스 정보의 힘을 믿고,{" "}
            <br />
            그런 정보는 한정된 사람에게만 도달해야 의미가 있다고 믿습니다.{" "}
            <br />
            매일 100명만 읽을 수 있는 비즈니스 뉴스레터를 발행하고 있습니다.{" "}
            <br />
            <br />
            오늘도 지름길을 찾아 여기까지 와주셔서 감사드립니다. <br />
            시작하겠습니다.
          </div>
          <div className="scorebox">
            <div className="score-number">#{scoreNumber}</div>
            <div className="score-text">
              오늘 100명 중 {scoreNumber}번째로 입장하셨어요.
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="content-title">예시 단락 제목이에요.</div>
        <div className="content-paragraph">예시 단락이에요.</div>
      </div>
    </WholeDiv>
  );
}

export default StoryView;

const WholeDiv = styled.div`
  .headerdiv {
    background-color: black;
    color: white;
    padding: 110px 0 30px 0;

    .headerdiv-contentdiv {
      max-width: 760px;
      margin: 0 auto;

      .story-title {
        font-size: 36px;
        font-weight: 600;
      }

      .authordiv {
        display: flex;
        align-items: center;
        margin-top: 21px;

        .author-logo {
          width: 40px;
          height: 40px;
          background-image: url(${logoSymbol2});
          background-size: cover;
          border-radius: 999px;
        }

        .author-text {
          margin-left: 11px;
          font-size: 22px;
          font-weight: 400;
        }
      }

      .story-time {
        margin-top: 68px;

        font-size: 16px;
        font-weight: 400;
      }
    }
  }

  .introdiv {
    .intro-contentdiv {
      max-width: 760px;
      margin: 0 auto;

      .intro-text {
        font-size: 20px;
        font-weight: 400;
        margin-top: 136px;
      }

      .scorebox {
        height: 80px;
        margin-top: 38px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        background-image: url(${storyScoreBanner});
        background-size: cover;

        .score-number {
          font-size: 34px;
          margin-top: 10px;
          margin-left: 35px;
        }
        .score-text {
          font-size: 16px;
          margin-left: 35px;
          margin-bottom: 16px;
        }
      }
    }
  }

  .content {
    max-width: 760px;
    min-height: 500px;
    margin: 0 auto;

    .content-title {
      font-size: 32px;
      font-weight: 500;
      margin-top: 60px;
    }

    .content-paragraph {
      font-size: 20px;
      font-weight: 400;
      margin-top: 14px;
    }
  }
`;
