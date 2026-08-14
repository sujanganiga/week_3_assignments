import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [error, setError] = useState("");

  // Fetch all posts
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    return post.title.toLowerCase().includes(search.toLowerCase());
  });

  // Fetch comments
  const showComments = (post) => {
    setSelectedPost(post);
    setCommentsLoading(true);
    setComments([]);

    fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        return response.json();
      })
      .then((data) => {
        setComments(data);
        setCommentsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setCommentsLoading(false);
      });
  };

  // Close comments
  const closeComments = () => {
    setSelectedPost(null);
    setComments([]);
    setError("");
  };

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  if (error && !selectedPost) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="container">
      <h1>Blog Post Explorer</h1>

      {!selectedPost && (
        <>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="posts">
            {filteredPosts.map((post) => (
              <div
                className="card"
                key={post.id}
                onClick={() => showComments(post)}
              >
                <h2>{post.title}</h2>

                <p>{post.body.substring(0, 100)}...</p>

                <button>View Comments</button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedPost && (
        <div className="details">
          <button onClick={closeComments}>Close</button>

          <h2>{selectedPost.title}</h2>

          <p>{selectedPost.body}</p>

          <h3>Comments</h3>

          {commentsLoading && <p>Loading comments...</p>}

          {!commentsLoading && error && <p>{error}</p>}

          {!commentsLoading &&
            !error &&
            comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <h4>{comment.name}</h4>
                <p>{comment.body}</p>
                <small>{comment.email}</small>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;