import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/posts.jpg";

class EditPost extends Component {
  constructor() {
    super()
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    }
  }

  init = postId => {
          singlePost(postId).then(data => {
              if (data.error) {
                  this.setState({ redirectToProfile: true });
              } else {
                  this.setState({
                      // id is not post.postedBy._id
                      id: data.postedBy._id,
                      title: data.title,
                      body: data.body,
                      error: ""
                  });
              }
          });
      };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  // IS VALID
  isValid =() => {
    const { title, body, fileSize } = this.state;
    if(fileSize > 200000) {
      this.setState({error: "File size should be less than 200kb.", loading: false});
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
      // CHANGED ERROR HANDLING -------------------------------------
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
        const postId = this.state.id;
        // grab token
        const token = isAuthenticated().token;
        // send everything to create method in apiPost to create a new post
        update(postId, token, this.postData).then(data => {
            if (data.error) this.setState({error: data.error});
            else {
              // clear all old fields after submission
              this.setState({
                loading: false,
                title: "",
                body: "",
                redirectToProfile: true
              });
            }
        });
      }
    };


  // FORM
  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
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
        Update Post
      </button>
    </form>
  );


  render () {
    const { id, title, body, redirectToProfile, error, loading } = this.state;

    if(redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>

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

        <img
          style={{height: "200px", width: "auto"}}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`}
          onError={i => (i.target.src = `${DefaultPost}`)}
          alt={title}
        />

        {isAuthenticated().user.role === "admin" &&
          this.editPostForm(title, body)}

        {isAuthenticated().user._id === id &&
          this.editPostForm(title, body)}
      </div>
    );

  }

}

export default EditPost;
