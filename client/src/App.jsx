import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import Questions from "./pages/questions/Questions";
import QuestionDetails from "./pages/questions/QuestionDetails";
import AskQuestion from "./pages/questions/AskQuestion";
import Tags from "./pages/tags/Tags";
import Users from "./pages/users/Users";
import UserDetail from "./pages/users/UserDetail";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Social from "./pages/social/Social";
import { getAllUsers } from "./action/users";
import { getAllQuestions } from "./action/questions";
import { getAllPosts } from "./action/socialPost";
import NewPost from "./pages/social/NewPost";
import PostDetails from "./pages/social/PostDetails";
import { io } from "socket.io-client";

// import socket from "./socket";

const App = () => {
  const [mobileScreen, setmobileScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentUserReducer);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setmobileScreen(true);
      } else {
        setmobileScreen(false);
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllQuestions());
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
  const socket = io("https://codecrib.onrender.com");

  // Join user room
  const userId = user?.result?._id;
    socket.emit("join", userId);

    // Listen for server notifications
    socket.on("notification", (data) => {
      if (Notification.permission === "granted") {
        new Notification(data.title, { body: data.message });
      }
    });

    // Request permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => socket.disconnect();
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar
        mobileScreen={mobileScreen}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex px-2 max-w-7xl mx-auto min-h-screen">
        {!mobileScreen ? (
          <Sidebar />
        ) : (
          sidebarOpen && (
            <Sidebar
              mobileScreen={mobileScreen}
              setSidebarOpen={setSidebarOpen}
            />
          )
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/questions/ask" element={<AskQuestion />} />

          <Route path="/tags" element={<Tags />} />

          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />

          <Route path="/social" element={<Social />} />
          <Route path="/social/new" element={<NewPost />} />
          <Route path="/social/:id" element={<PostDetails />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
