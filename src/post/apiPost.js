// UPDATE
export const create = (userId, token, post) => {
  // send token in the headers and post as body
  return fetch(`${ process.env.REACT_APP_API_URL }/post/new/${ userId }`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ token }`
    },
    body: post
  })
  // handle the response
  .then(response => {
    return response.json();
  })
  // catch errors
  .catch(err => console.log(err));
};

// LIST
export const list = page => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// SINGLE POST
export const singlePost = (postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "GET",
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// LIST BY USER
export const listByUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/posts/by/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${ token }`
    },
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// REMOVE POST
export const remove = (postId, token) => {
  return fetch(`${ process.env.REACT_APP_API_URL }/post/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${ token }`
    }
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// UPDATE POST
export const update = (postId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// LIKE
// which user liked which post
export const like = (userId, token, postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({userId, postId})
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// UNLIKE
export const unlike = (userId, token, postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({userId, postId})
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// COMMENT
export const comment = (userId, token, postId, comment) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId, comment })
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};

// UNCOMMENT
export const uncomment = (userId, token, postId, comment) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({userId, postId, comment})
  })
  .then(response => {
    return response.json();
  })
  .catch(err => console.log(err));
};
