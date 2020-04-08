import React, { Component } from "react";
import { Link } from "react-router-dom";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from "../images/avatar.png";
import { isAuthenticated } from "../auth";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    // use findPeople method from apiUser.js
    findPeople(userId, token).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        // if we get user, set user in state
        this.setState({ users: data });
      }
    });
  };

// CLICK FOLLOW
  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    // use follow method from apiUser.js
    follow(userId, token, user._id)
    .then(data => {
      if(data.error) {
        this.setState({ error: data.error })
      } else {
        // find this user in array
        let toFollow = this.state.users;
        // cut that user out
        toFollow.splice(i, 1);
        // update state
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        });
      }
    });
  };

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
        <img
          style={{height: "200px", objectFit: "cover"}}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
          onError={i => (i.target.src = `${DefaultProfile}`)}
          alt={user.name}
        />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">
              {user.email}
            </p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-sm btn-primary"
            >
              View Profile
            </Link>
            <button
              onClick={() => this.clickFollow(user, i)}
              className="btn btn-sm btn-raised btn-info float-right">
                Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  render () {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container">
          <h2 className="mt-5 mb-5">Find People</h2>

          { open && (
            <div className="alert alert-success">
              <p>{ followMessage }</p>
            </div>
          )}

          {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
