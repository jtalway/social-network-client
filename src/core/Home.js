import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Home</h2>
      <p className="lead">Welcome to the Social Network app</p>
      <p className="lead">... in development by Jason Alway... using MERN Stack</p>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>

);

export default Home;
