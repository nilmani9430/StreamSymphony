import "./App.css";
import Home from "./Components/Profile/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import YouTubeStream from "./Components/YouTubeStream";
import { Toaster } from "react-hot-toast";

function App() {
  const [userstate, setUserState] = useState({});
  return (
    <div className="App">
      <Toaster />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              userstate && userstate._id ? (
                <Home
                  setUserState={setUserState}
                  username={userstate.fname}
                />
              ) : (
                <Login setUserState={setUserState} />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={<Login setUserState={setUserState} />}
          ></Route>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/stream" element={<YouTubeStream />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
