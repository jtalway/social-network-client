import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";

class NewPost extends Component {

  constructor() {
    super()
    this.state= {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  // IS VALID
  isValid =() => {
    const { title, body, fileSize } = this.state;
    if(fileSize > 2000000) {
      this.setState({error: "File size should be less than 2 mb.", loading: false});
      return false;
    }
    if(title.length === 0 || body.length === 0) {
      this.setState({error: "All fields are required.", loading: false});
      return false;
    }
    // if no errors return true
    return true;
  };

  // HANDLE CHANGE
  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    // grab the value, if name is photo grab event.target.files o/w : value
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    // grab file size
    const fileSize = name === "photo" ? (event.target.files.length && event.target.files[0].size) : 0;
    // set the name and value
    this.postData.set(name, value);
    // Set State
    this.setState({ [name]: value, fileSize});
  };

  // CLICK SUBMIT
  clickSubmit = event => {
    // prevent default click behavior
    event.preventDefault();
    // ...Loading...
    this.setState({loading: true});

    // validators
    if(this.isValid()) {
      // grab user id
      const userId = isAuthenticated().user._id;
      // grab token
      const token = isAuthenticated().token;
      // send everything to create method in apiPost to create a new post
      create(userId, token, this.postData).then(data => {
          if (data.error) this.setState({error: data.error});
          else {
            // clear all old fields after submission
            this.setState({
              loading: false,
              title: "",
              body: "",
              photo: "",
              redirectToProfile: true
            });
          }
      });
    }
  };

  // FORM
  newPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"/>
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}/>
      </div>
      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}/>
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Create Post
      </button>
    </form>
  );

  // RENDER
  render () {
    const {
      title,
      body,
      photo,
      user,
      error,
      loading,
      redirectToProfile
    } = this.state;

    if(redirectToProfile) {
      return <Redirect to={`/user/${ user._id }`} />;
    }


    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create New Post</h2>

        <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
            ""
        )}

        {this.newPostForm(title, body)}

      </div>
    );
  }
}

export default NewPost;
