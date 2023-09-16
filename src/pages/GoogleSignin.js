import "firebase/firestore";
import "firebase/auth";
import { signInWithGoogle } from "../firebase_config";
import { auth } from "../firebase_config";
import { useNavigate } from "react-router-dom";

function GoogleSignin(props) {
  const navigate = useNavigate();

  auth.onAuthStateChanged((user) => {
    if (user !== null) {
      console.log("로그인되었습니다.");
      console.log(user);
      localStorage.setItem("incourse_islogined", true);
      localStorage.setItem("incourse_user_email", user.email);
      localStorage.setItem("incourse_user_photo", user.photoURL);
      localStorage.setItem("incourse_user_nickname", user.displayName);
      //   localStorage.setItem
      navigate("/");
      window.location.reload();
    }
  });

  return (
    <div onClick={signInWithGoogle} className="buttondiv-google">
      <img className="buttondiv-google-logo" />
      <div className="buttondiv-google-text">Continue with google</div>
    </div>
  );
}

export default GoogleSignin;
