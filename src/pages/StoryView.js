import { useEffect, useState } from "react";
import styled from "styled-components";
import logoSymbol2 from "../images/warp_logo_symbol_2.png";
import diaryExample from "../images/diary_example.png";
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
          if (
            data.joiners.includes(localStorage.getItem("incourse_user_email"))
          ) {
            setArticle({ ...data, id: docSnapshots.docs[0].id });
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
            가장 빠른 비즈니스 지름길, 와프 스토리입니다. <br />
            <br />
            와프 스토리의 코멘트와 종합 코멘트는 이탈릭체로 표시됩니다.
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
        <div className="content-title">사업을 간단히 소개해주세요.</div>
        <div className="content-paragraph">
          Jess: 저는 호주 태즈매니아에서 온 34살 제스라고 합니다. 2015년에
          사업을 시작했고, 그때 저는 셋째 아이를 임신했을 때였어요. 처음에는
          Etsy라는 플랫폼에서 다이어리 양식(노션 템플릿 같은)을 판매하다가
          지금은 호주에서 가장 큰 맞춤 다이어리 숍이 되었습니다.
        </div>
        <img className="content-img" src={diaryExample} alt="-"></img>
        <div className="content-paragraph">
          저희 제품에 대해서 간단하게 설명하자면, 다이어리 크기, 커버 재질,
          칸막이, 액세서리와 함께 모든 상황에 대한 300개 이상의 다이어리 양식을
          직접 고객이 고를 수 있습니다. 공부, 결혼계획, 교사를 위한 커리큘럼 등
          여러 목적에 맞는 다이어리도 만들 수 있어요. 사람마다 각자 다른
          라이프스타일이 있는데, 이것을 전부 우리 사이트에서 실현할 수 있다는
          것이 저희 제품의 최대 장점이에요.
          <p></p>
          약간의 아하 포인트가 또 있다면, 호주의 국가 장애 보험 제도를 이용하는
          사람들을 위한 다이어리 양식도 있어요. 이런 건 어떤 곳에서도 찾아볼 수
          없고, 모든 라이프스타일을 담겠다는 저희의 브랜딩을 더 강화하는 역할을
          하죠.
          <p></p>
          당연하게도 이제는 다이어리뿐만 아니라 다이어리 표지, 칸막이, 메모장,
          문구류까지 확장했고요, 다이어리와 함께 자기관리를 도와주는 용품들로
          가득한 '피스박스'를 받아보는 구독 배송 서비스도 시작했어요.
        </div>
        <div className="content-title">
          어떻게 아이디어를 떠올리게 되었나요?
        </div>
        <div className="content-paragraph">
          이 사업을 처음 시작했을 때 저는 두 아이의 엄마였고, 파트타임
          공무원이었어요. 매 일상이 지루했죠. 저는 사실 사업과는 거리가 먼
          사람이라고 항상 생각했었어요. 남들이 보기에도 그랬죠.
          <p></p>
          그러다가 둘째 아이가 태어난 후 취미로 시작했던게 다이어리였어요.
          다이어리를 좋아하고 자신만의 스타일대로 다이어리를 채워나가길 좋아하는
          큰 커뮤니티가 있어요. 아마 다이어리를 써본 분들이 아니라면 모를
          거에요.
          <p>
            • 한국에서는 '다꾸'라고 아예 고유명사가 될 정도로 꽤 유저가 있는
            시장이다. 다이어리 자체를 사고파는 시장도 물론 있지만, 다이어리에
            들어갈 스티커가 가장 많이 팔린다.
          </p>
          시중에 있는 다이어리 양식은 저한테 딱 맞는게 없었습니다. Etsy에서
          다이어리 양식들을 찾아서 다운받긴 했지만 하나같이 조금씩 부족했어요.
          또 파일마다 형식이 달라서 인쇄하고 쓸 수 있는 다이어리를 만들기까지
          비용이 엄청났어요. 그래서 저는 다이어리 취미 2년차에 양식을 직접
          만들어야겠다고 생각했습니다. 그때까지도 이게 사업이라는 생각은 한 번도
          한 적이 없었어요.
          <p></p>
          제가 만든 다이어리 양식을 몇 명 정도가 자기도 갖고 싶다고 하는 것을
          보고 급하게 Etsy에 올린 게 시작이었습니다. 그때 핵심은 호주에 인쇄까지
          되어있는 다이어리 양식 용지를 팔고 있는 곳은 한두군데밖에 없었어요.
          온라인에서 딱 맞는 양식을 사려면 미국에 주문해야 했는데 너무
          오래걸리고 비용도 비쌌죠. 제가 인쇄된 좋은 양식을 Etsy에 올리고 급하게
          커뮤니티에 이 스토어를 만들었다고 하자 주문이 들어오기 시작했습니다.
          <p>
            • 커뮤니티의 일원이었기 때문에 비슷한 사람들이 뭘 원하는지 알고
            있었고, 그것은 품질 좋게 인쇄된 다이어리 양식 종이, 그리고 엄청
            다양한 다이어리 양식. 딱 이 두가지였다.
          </p>
          처음 2년정도 Etsy에 주문이 들어오는 것들을 보면서 되게 기뻤어요. 근데
          그렇게 엄청난 규모는 아니었거든요. 지금의 규모 (월 1500만원)까지 가는
          데 가장 컸던 건 쇼피파이였어요.
          <p></p>
          처음엔 저도 반신반의했거든요. 이미 올 사람은 다 오고 있는 것 같다는
          생각이 작게나마 있었죠. 근데 백업용 쇼핑몰이 하나 필요하다는 생각에
          그냥 시험 삼아 쇼피파이로 쇼핑몰을 만들어 봤어요. 근데 새 세상이
          열리더라고요. 쇼피파이에 있는 수많은 앱들과 노출 프로그램들이 제가
          생각하지도 못했던 매출 성장을 가져다줬어요. 거의 5~6배 성장을 쇼핑몰만
          옮겼는데 해버렸으니까요.
          <p>
            • 제품이 좋은 상태에서 쇼피파이로 옮겨 기본적인 프로모션들을
            진행했던 게 크다. 제품이 경쟁력이 있으니까, 신규 상점 밀어주기
            혜택을 받았을 때 200% 활용할 수 있다. 재구매와 전환 지표가 좋으니
            프로모션에 더 과감하게 돈을 태울 수 있었던 것. 한 분야 1등이 유튜브
            개설하는 상황과 비슷하다고도 볼 수 있다.
          </p>
        </div>
        <div className="content-title">
          첫 번째 제품을 만들었던 과정을 알려주세요.
        </div>
        <div className="content-paragraph">
          이건 많은 분들에게 좀 도움이 되는 내용일 것 같아요. 저는 그림판으로
          로고를 만들었고, 스토어 이름도 커뮤니티에서 유행하던 말인 '플래너 피스
          찾기' 였어요. (우리나라로 치면 쇼핑몰 이름이 '다꾸 좀 치네', 혹은
          '댑악 다꾸' 이런 느낌이다.) 커뮤니티에서 시작했기 때문에 그럴 수
          있었던 거죠. 판매가 일어난 스토리는 정말 간결해요. 너 다이어리에
          진심인 사람이지, 나도 다이어리에 진심인 사람인데 진짜 딱 맞는 양식이
          없어서 내가 만들었어. 어때? → 반응이 좋아서 그냥 스토어를 열어버렸어.
          살 수 있어! 어때?
          <p>
            • 실제 구매가 일어나기까지는 많은 과정이 필요했지만, 커뮤니티가
            원하는 것을 맞춰주는 것이 가장 핵심이었다. 나머지는 감히 부가적이다.
          </p>
          첫 다이어리 양식 (메인 제품)은 Microsoft Publisher을 썼어요. 아이들을
          재워놓고 밤을 새워서 작업했죠. 최대한 제가 실제로 쓸 다이어리 양식과
          비슷하게 디자인하려고 노력했어요. 거의 저를 위한 제품을 만든거죠.
          <p></p>초기 단계에 쓴 돈은 꽤 적었어요. 사무실도 없었고, 거실 바닥과
          부엌에서 작업했어요. 남편이랑 오피웍스에 가서 프린터와 용지 구입에
          200달러를 썼고요. 그때 만든 제품으로도 판매가 일어났어요. 그 이후로는
          사무실을 집에 따로 만들었고, 상업용 프린터 두 대를 놓게 됐습니다. 제가
          정말 운이 좋았다고 생각하는 점 중에 하나는, 공장이나 다른 제조를 맡길
          필요없이 집에서 직접 생산이 가능한 제품으로 시작했다는 거에요. 원가가
          정말 적게 들었고, 따로 계약을 맞출 필요가 전혀 없었죠.
          <p></p>팔아보고 싶은 다이어리 양식이 있으면 2천원도 들지 않았어요.
          그러다 보니 고객 한 명이라도 '여기서 장소를 적을 수 있는 칸이 따로
          마련되면 좋을 것 같은데요'라는 피드백을 주면 그걸 바로 생산해서 팔 수
          있었죠.
          <p>
            • 원가가 적었기 때문에 제품 확장에서 이점을 가져갔다. 무형물
            판매업과 비슷한 장점이 두드러진다.
          </p>
          사업을 시작하고 1년 정도가 지난 후에야 저희는 다이어리 양식 용지만
          파는게 아닌 자체 다이어리를 제작해 달라는 요청이 많이 들어왔어요. 정말
          두려웠지만 그때 이제 해외 공장과 연락할 용기를 갖게 되었죠. 저희가
          자체 제작한 다이어리가 많이 팔릴 거라는 생각은 저희의 예측과는 완전히
          반대였지만, 그래도 해보기로 했습니다. 그리고 그 시도 덕분에 브랜드는
          더 다채로워지고 많은 기회가 열렸어요.
          <p>
            • 느리지만 수요를 보고 움직일 수 있는 구조를 만들게 되는 것은 리스크
            관리 측면에서 큰 강점이 된다. 이를 구축하는 방법은 하나뿐이다:
            고객의 피드백이 쌓이는 구조, 즉 브랜딩이라고 볼 수 있다.
          </p>
          <p>
            • 원가가 매우 적은 무형의 가치를 담아 팔게 되는 경우, 제품의 시도에
            들어가는 비용이 극도로 작아지면서 무한히 많은 시도를 할 수 있는
            환경이 갖춰진다. 국내에서 이와 비슷한 시도를 해볼 수 있는 방법에는
            몇 가지가 있는데, 모두 '기능을 가진 무형의 것'을 상품화해서 판다는
            점이 동일하다.
          </p>
          <p>
            • 노션 템플릿, 내 모닝 루틴 공유해서 블로그 유저 끌어모으기,
            콜드메일 양식 공유하기, 챗GPT 프롬프트 팔기, 유용한 툴 모음집 팔기,
            유튜브 음악 플레이리스트 공유하기
          </p>
          <p>
            • 이런 제품을 처음 만들어서 반응을 관찰하는 패턴은 정형화되어 있다:
            자신이 가장 진심인 분야에서 자기만 쓰는 형태의 제품이 만들어지고,
            주변 커뮤니티에서 공유하게 된다.{" "}
          </p>
          자체 다이어리를 제작하면서 가장 큰 변화는 이거였어요. 원래 다이어리
          중독자들이 가장 고객 타겟층이었는데, 다이어리 입문자 분들도 우리
          다이어리를 선택하면서 고객층으로 편입시킬수 있게 된 거였죠.
          <p>
            • 온라인 지식 교육 시장에서도 비슷한 형태가 관찰되는데, 가령
            셀러들이 쓰는 순위관리 혹은 발주 툴을 먼저 제공하여 셀러 네트워크
            사이에서 강점을 가진 후 셀러 입문 교육 강의를 런칭하는 경우이다.
            강의를 런칭하는 경우 yes risk → no risk로 확장하는 방식이기 때문에
            정말 쉽다. 허나 Jess의 경우 no risk → yes risk로써 두려움을 감내해야
            했다. 판단의 근거는 역시 고객의 목소리를 통한 수요 예측.
          </p>
        </div>
        <div className="content-title">실무</div>
        <div className="content-paragraph">
          매출의 대부분은 이제 쇼피파이에서 나고 있어요. Out of the Sandbox의
          유료 테마를 쓰고 있습니다. 광고를 허용하는 Facebook그룹에 들어가서
          제품에 대한 이야기를 공유함으로써 트래픽의 대부분이 생깁니다.
          Instagram으로도 약간의 트래픽이 생기고 있어요.
          <p></p>마케팅 예산은 적지만 Facebook 퍼포먼스 마케팅을 돌리고 있고,
          Instagram에서 인플루언서들에게 무료 플래너를 보내주고, 플래너를 쓰는
          게시글을 올려줄 경우 돈을 주는 방식으로 인플루언서 마케팅 하고
          있습니다.
          <p></p>공동창업자 사이에서는 트렐로, 구글 캘린더, 구글 드라이브 쓰고
          있습니다.
          <p></p>쇼피파이 앱도 중요한데, Judge.me, Selly, Recharge 쓰고
          있습니다. 싹 다 강추입니다. Omnisend로 이메일을 보내는데, 한달에 2번만
          보내는걸 절대원칙으로 쓰고 있어요.
        </div>
        <div className="content-title">와프 코멘트</div>
        <div className="content-paragraph">
          <p>Jess 스토리의 핵심은 커뮤니티, 기능성 무형 제품.</p>
          <p>
            필자가 NFT 투자를 통해 한창 수익을 올리고 있었을 때, 커뮤니티 네임드
            중 한 명이 자신을 위해 NFT 런칭 일정 공유 대시보드를 만든 것이
            작지만 빠르게 성장하는 사업이 되는 것을 지켜보았다. (BM:
            nft프로젝트들이 홍보를 위해 돈을 지불하고 일정 상단에 노출시키고
            메일을 등록하여 런칭 알림을 보냈다.) 커뮤니티 내의 일원이 되어,
            커뮤니티가 공유할 수 있는 무형의 제품을 만들고 공유해보는 형태라면
            당신의 제품에 대한 가치를 인정받을 수 있을 것이다.
          </p>
          <p>
            허나 역시 가장 사업이 되기 좋은 것은 다이어리 양식처럼 소모가
            빠르고, 계속 필요하며, 다양화가 쉬운 것.
          </p>
          <p>
            최근 1년간 인스타그램 갓생과 12계획 등의 트래픽이 급상승 중,
            최고수준/로알남 등의 사례를 참고하여 자기계발 커뮤니티부터 선점 후
            본인이 쓰는 다이어리 양식을 공유하고 반응을 보며 Jesi와 똑같이
            제품을 공급해보는 비즈니스를 추천한다. Jesi도 호주에서만의 판매로
            회사를 키웠듯 국내 시장도 부트스트랩핑에 충분한 규모이다.
          </p>
          <p>
            다이어리 양식을 제작할 능력이 없는 경우 jess의 사이트에 있는
            다이어리 제품들을 캡쳐 후 번역해서 그대로 가져다 팔아보면 된다.
          </p>
          <p>
            현재 가장 비슷한 형태의 사업으로 진행되고 있는 국내 사례로는
            DT굿노트가 있다. 매출액은 공개되지 않았으나, 판매량의 수는 Jess보다
            훨씬 못미치는 것으로 보인다. 또한 다이어리 양식을 파일의 형태로
            제공하여, 실물로 보내진 않고 있다. 고객이 직접 인쇄해서 사용해야
            한다는 이야기. 다꾸 인스타그램 계정을 운영중이다.
          </p>
          <p>
            2023년에는 어떠한 형태로든 차별화 전략이 필요하므로, 재사용 종이에
            인쇄되어 전기 소모량이나 에너지 계획을 기록하는 다이어리 양식과 함께
            친환경 브랜딩을 추천한다.
          </p>
          <p>
            시장 진입 전략의 경우 VLOG 혹은 특정 자기관리 생활을 공유하고 있는
            유튜버들에게 제품 협찬을 하거나 아예 확장 가능성을 염두에 두고
            유튜브 채널을 시작하는 것을 추천한다. 타겟 나이층은 2030 여성으로,
            2030 커뮤니티 (인스티즈, 더쿠, 여성시대) 등에서 사용되는 유머와
            밈으로 빠른 편집을 곁들인 방식을 추천. 당신이 여성이 아닐 경우, 여성
            출연자를 섭외하여 여성 구독자층이 신뢰감을 느낄 직업을 선정하고
            컨텐츠는 일상 자기관리로 잡는 것도 전환율을 높일 수 있다.
          </p>
          <p>
            이 글은 100명밖에 볼 수 없으므로, 마음을 천천히 먹고 시작해보길
            권한다.
          </p>
        </div>
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
