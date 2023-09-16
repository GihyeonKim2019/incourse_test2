import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Reset } from "styled-reset";

import "./fonts/pretendardvariable.css";
import "./global.css";

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Us from "./pages/Us";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import StoryView from "./pages/StoryView";

function App() {
  return (
    <BrowserRouter>
      <div
        className="App"
        style={{ fontFamily: "Pretendard Variable", lineHeight: "normal" }}
      >
        <Reset />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/us" element={<Us />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/storyview/:articleNum" element={<StoryView />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
