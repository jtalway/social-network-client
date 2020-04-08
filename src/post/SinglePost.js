import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import DefaultPost from "../images/posts.jpg";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  }

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    // return -1 if not found
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  likeToggle = () =>{
    if(!isAuthenticated()) {
      this.setState({ redirectToSignin: true })
      return false;
    }
    // if true, make put request to backend to /unlike o/w make request to /like
    let callApi = this.state.like ? unlike : like;

    // grab values
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  // DELETE POST - run by confirm delete below
  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true })
      }
    });
  };

  // CONFIRM DELETE
  deleteConfirmed = () =>{
    let answer = window.confirm("Are you sure you want to delete your post?");
    if(answer) {
      this.deletePost();
    }
  };

  renderPost = post => {
    const posterId = post.postedBy
      ? `/user/${ post.postedBy._id }`
      : "";
    const posterName = post.postedBy
      ? post.postedBy.name
      : "Unknown";
    const { like, likes } = this.state;

      return (
          <div className="card-body">
            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
              alt={post.title}
              onError={i => i.target.src = `${DefaultPost}`}
              className="img-thumbnail mb-3"
              style={{ height: "auto", width: "100%", objectFit: "cover"}}
            />

            {like ? (
              <h3 onClick={ this.likeToggle }>
                <i
                  className="fa fa-thumbs-up text-success bg-dark"
                  style={{ padding: "10px", borderRadius: "100%" }}
                ></i>{" "}
                  { likes } Likes
              </h3>
            ) : (
              <h3 onClick={ this.likeToggle }>
                <i
                  className="fa fa-thumbs-up text-warning bg-dark"
                  style={{ padding: "10px", borderRadius: "100%" }}
                ></i>{" "}
                  { likes } Likes
              </h3>
            )}

            <p className="card-text">{ post.body }</p>
            <br/>
            <p className="font-italic mark">
              Posted by {" "}
              <Link to={`${ posterId }`}>
                { posterName }
              </Link>
              {" "}
              on { new Date(post.created).toDateString() }
            </p>
            <div className="d-inline-block">
              <Link
                to={`/`}
                className="btn btn-raised btn-sm btn-primary mr-5"
              >
                Back to posts
              </Link>

              {isAuthenticated().user &&
                 isAuthenticated().user._id === post.postedBy._id && (
                <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-sm btn-warning mr-5"
                >
                  Update Post
                </Link>
                <button onClick={ this.deleteConfirmed } className="btn btn-raised btn-sm btn-danger">
                  Delete Post
                </button>
                </>
              )}

              <div>
    {isAuthenticated().user &&
        isAuthenticated().user.role === "admin" && (
            <div class="card mt-5">
                <div className="card-body">
                    <h5 className="card-title">Admin</h5>
                    <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                    </p>
                    <Link
                        to={`/post/edit/${post._id}`}
                        className="btn btn-raised btn-warning btn-sm mr-5"
                    >
                        Update Post
                    </Link>
                    <button
                        onClick={this.deleteConfirmed}
                        className="btn btn-raised btn-danger"
                    >
                        Delete Post
                    </button>
                </div>
            </div>
        )}
</div>
            </div>
          </div>
      );
  };


  render () {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if(redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}

        <Comment
          postId={ post._id }
          comments={ comments.reverse() }
          updateComments={this.updateComments}
        />

      </div>
    );
  }
}

export default SinglePost;
