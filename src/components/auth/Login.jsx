import React, { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../states/AuthContext"; // Adjust the path as needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Use the Auth Context

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);

      signIn(user); // Update Auth Context
      navigate("/game"); // Redirect to game page after login
      localStorage.setItem("user", user);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };
  // Handle Email/Password Sign-In or Sign-Up
  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    try {
      let user;
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = result.user;
      }
      signIn(user); // Update Auth Context
      navigate("/game"); // Redirect to game page after login/signup
      localStorage.setItem("access token", user.accessToken);
    } catch (error) {
      console.error("Email/Password Auth Error:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleEmailPasswordAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-signin">
        <FcGoogle /> Sign in with Google
      </button>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Login;
