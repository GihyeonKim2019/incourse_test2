import { useEffect, useState } from "react";
import styled from "styled-components";
import logoSymbol2 from "../images/warp_logo_symbol_2.png";
// import diaryExample from "../images/diary_example.png";
import storyScoreBanner from "../images/story_score_banner.png";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  // getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
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

  const [feedback, setFeedback] = useState("");
  const [sendedText, setSendedText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedback.trim()) {
      try {
        const docRef = await addDoc(collection(firestore, "feedbacks"), {
          content: feedback,
          userEmail: localStorage.getItem("incourse_user_email"),
          timestamp: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
        setFeedback("");
        setSendedText("성공적으로 전송되었습니다. 진심으로 감사드립니다.");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // const [storyTitle, setStoryTitle] = useState(
  //   "23살에 음료수 브랜드를 월 110만 달러 규모로 성장시킨 비결"
  // );
  // const [storyTime, setStoryTime] = useState("2023.08.27(수) 11:00:00");
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
    console.log(scoreNumber);
  }, [scoreNumber]);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const articlesCollection = collection(firestore, "article");
        const q = query(
          articlesCollection,
          where("articleNum", "==", Number(articleNum))
        );
        const docSnapshots = await getDocs(q);

        if (!docSnapshots.empty) {
          const docSnapshot = docSnapshots.docs[0];
          const data = docSnapshot.data();

          data.id = docSnapshot.id;
          if (Array.isArray(data.joiners) && data.joiners.length < 100) {
            setArticle({ ...data, id: docSnapshots.docs[0].id });
            setScoreNumber(data.joiners.length + 1);
          }
          if (
            data.joiners.includes(localStorage.getItem("incourse_user_email"))
          ) {
            setArticle({ ...data, id: docSnapshots.docs[0].id });
            setScoreNumber(calculateScore(data.joiners));
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    }

    fetchArticle();
  }, [articleNum]);

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
      // setScoreNumber(calculateScore(article.joiners));
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
            <div className="author-text">와프 스토리 뉴스레터</div>
          </div>
          <div className="story-time">
            {firestoreTimestampToFormattedDate(article.publishTime)}
          </div>
        </div>
      </div>
      <div className="introdiv">
        <div className="intro-contentdiv">
          <div className="intro-text">
            {/* 가장 빠른 비즈니스 지름길, 와프 스토리입니다. <br />
            <br />
            경쟁에서 사소한 우위를 가져다주는 최전선 비즈니스 정보의 힘을 믿고,{" "}
            <br />
            그런 정보는 한정된 사람에게만 도달해야 의미가 있다고 믿습니다.{" "}
            <br />
            매일 100명만 읽을 수 있는 비즈니스 뉴스레터를 발행하고 있습니다.{" "}
            <br />
            <br />
            오늘도 지름길을 찾아 여기까지 와주셔서 감사드립니다. <br />
            시작하겠습니다. */}
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
        {article.paragraphs.map((paragraph) => (
          <div>
            <div className="content-title">{paragraph.paragraphTitle}</div>
            <div
              className="content-paragraph"
              dangerouslySetInnerHTML={{ __html: paragraph.paragraphText }}
            ></div>
          </div>
        ))}
        <div className="feedbackdiv">
          <div className="feedback-title">피드백 하기</div>
          와프 스토리에 대한 의견을 남겨주시면 빠르게 반영하겠습니다.
          <div className="buttondiv">
            <textarea
              className="feedback-input"
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="의견을 남겨주세요."
            ></textarea>
            <div className="send-button" onClick={handleSubmit}>
              전송하기
            </div>
          </div>
          <div className="sended-text">{sendedText}</div>
        </div>
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
        color: white;
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

      p {
        margin-top: 24px;
        font-style: italic;
        margin-bottom: 48px;
        padding: 0 20px;
      }

      img {
        display: block;
        margin-top: 40px;
        margin-bottom: 10px;
      }
    }
  }

  .feedbackdiv {
    margin-top: 200px;
    font-size: 20px;
    padding-bottom: 100px;

    .feedback-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .buttondiv {
      margin-top: 20px;
      display: flex;
      align-items: end;

      .feedback-input {
        font-family: inherit;
        font-size: 18px;
        padding: 10px;
        flex-basis: 800px;
        flex-shrink: 1;
        height: 100px;
        border: 0;
        outline: none;
        background-color: rgb(243, 243, 243);
        text-align: up;

        vertical-align: bottom !important;
      }

      .send-button {
        margin-left: 40px;
        background-color: #8e35ff;
        width: 140px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
      }
    }

    .sended-text {
      margin-top: 10px;
      font-size: 18px;
      color: #8e35ff;
    }
  }
`;
