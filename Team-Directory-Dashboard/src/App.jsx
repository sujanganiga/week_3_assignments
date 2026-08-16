import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [posts, setPosts] = useState([]);
  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("name");

  // Fetch users
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Search users
  let filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.company.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Sort users
  filteredUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return a.company.name.localeCompare(b.company.name);
  });

  // Fetch posts and todos when user changes
  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setDetailsLoading(true);
    setPosts([]);
    setTodos([]);

    const userId = selectedUser.id;

    Promise.all([
      fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      ),
      fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
      ),
    ])
      .then(async ([postsResponse, todosResponse]) => {
        if (!postsResponse.ok || !todosResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const postsData = await postsResponse.json();
        const todosData = await todosResponse.json();

        setPosts(postsData);
        setTodos(todosData);

        setDetailsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setDetailsLoading(false);
      });
  }, [selectedUser]);

  // Select user
  const selectUser = (user) => {
    setSelectedUser(user);
    setError("");
  };

  // Close details
  const closeDetails = () => {
    setSelectedUser(null);
    setPosts([]);
    setTodos([]);
  };

  // Todo counts
  const completedTodos = todos.filter((todo) => todo.completed).length;

  const pendingTodos = todos.filter((todo) => !todo.completed).length;

  const percentage =
    todos.length === 0
      ? 0
      : Math.round((completedTodos / todos.length) * 100);

  if (loading) {
    return <h2>Loading users...</h2>;
  }

  if (error && !selectedUser) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="container">
      <h1>Team Directory</h1>

      {!selectedUser && (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
            </select>
          </div>

          <div className="users">
            {filteredUsers.map((user) => (
              <div
                className="user-card"
                key={user.id}
                onClick={() => selectUser(user)}
              >
                <h2>{user.name}</h2>

                <p>{user.email}</p>

                <p>
                  <strong>Company:</strong>{" "}
                  {user.company.name}
                </p>

                <p>
                  <strong>City:</strong> {user.address.city}
                </p>

                <button>View Details</button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedUser && (
        <div className="details">
          <button onClick={closeDetails}>← Back</button>

          <h2>{selectedUser.name}</h2>

          <p>{selectedUser.email}</p>

          <p>
            Company: {selectedUser.company.name}
          </p>

          {detailsLoading && <h3>Loading details...</h3>}

          {!detailsLoading && error && <p>{error}</p>}

          {!detailsLoading && !error && (
            <>
              <h2>Posts</h2>

              {posts.map((post) => (
                <div className="post" key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              ))}

              <h2>Todos</h2>

              <div className="todo-count">
                <p>Completed: {completedTodos}</p>

                <p>Pending: {pendingTodos}</p>

                <p>Progress: {percentage}%</p>
              </div>

              {todos.map((todo) => (
                <div className="todo" key={todo.id}>
                  <p>{todo.title}</p>

                  <span>
                    {todo.completed
                      ? "Completed"
                      : "Pending"}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;