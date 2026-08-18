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


  const getPosts = async () => {
    try{
        let f_posts=await fetch("https://jsonplaceholder.typicode.com/posts");
        let parsed_posts=await f_posts.json();
        // console.log(parsed_posts);
        setPosts(parsed_posts);
        setLoading(false);

    }
    catch(error){
        console.log(error)
        setLoading(false);
    }

  }

  useEffect(() => {
    getPosts()
  }, []);

  const filteredPosts = posts.filter((post) => {
    return post.title.toLowerCase().includes(search.toLowerCase());
  });

  const showComments = async(post) => {

    try {
      setSelectedPost(post);
      setCommentsLoading(true);
      setComments([]);
      let f_comments=await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
      let parsed_comments=await f_comments.json();
      setComments(parsed_comments);
      setCommentsLoading(false)
      
    } catch (error) {
      console.log(error.message);
      setCommentsLoading(false)
      
    }

  };

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

                <button id="ViewCom">View Comments</button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedPost && (
        <div className="details">
          <button onClick={closeComments}>Close</button>

          <h2 id="comPosTi">{selectedPost.title}</h2>

          <p id="comPosBody">{selectedPost.body}</p>
          <div className="actualCom">
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
          
        </div>
      )}
    </div>
  );
}

export default App;