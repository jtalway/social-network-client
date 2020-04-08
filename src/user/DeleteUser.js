import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, signout } from "../auth";
import { remove } from "./apiUser";

class DeleteUser extends Component {

  state = {
    redirect: false
  };

  // DELETE ACCOUNT
  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        // signout user
        signout(() => console.log("User is deleted."));
        // redirect
        this.setState({ redirect: true })
      }
    });
  };

  // CONFIRM DELETE
  deleteConfirmed = () =>{
    let answer = window.confirm("Are you sure you want to delete your account?");
    if(answer) {
      this.deleteAccount();
    }
  };

  // RENDER
  render () {
    if(this.state.redirect) {
      return <Redirect to="/" />
    }
    return (
      <button onClick={this.deleteConfirmed} className="btn btn-raised btn-sm btn-danger">
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
