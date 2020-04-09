import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">
      <h2>Welcome</h2>
      <p className="lead">Social Network web app... in development by Jason Alway... using MERN Stack</p>
      <hr />
      <h6>GitHub links</h6>
      <ul className="nav">
        <li className="nav-item">
          <a className="nav-link" href="https://github.com/jtalway/social-network-client">Client</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://github.com/jtalway/social-network-api">API</a>
        </li>
      </ul>

    </div>
    <div className="container">
      <Posts />
    </div>
  </div>

);

export default Home;
