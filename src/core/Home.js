import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Home</h2>
      <p className="lead">Welcome to the Social Network web app</p>
      <p className="lead">... in development by Jason Alway... using MERN Stack</p>
      <hr />
      <h6>GitHub links</h6>
        <p>
        <a className="nav-link" href="https://github.com/jtalway/social-network-client">Client</a>
        <a className="nav-link" href="https://github.com/jtalway/social-network-api">API</a>
        </p>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>

);

export default Home;
