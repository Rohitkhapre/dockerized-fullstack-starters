import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Components
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🐳 React Docker App
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/users" className="nav-link">Users</Link>
          <Link to="/posts" className="nav-link">Posts</Link>
          <Link to="/stats" className="nav-link">Stats</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
};

const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error">
    <h3>❌ Error</h3>
    <p>{error}</p>
    {onRetry && <button onClick={onRetry} className="btn btn-primary">Retry</button>}
  </div>
);

// Home Page
const HomePage = () => {
  const [appInfo, setAppInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppInfo();
  }, []);

  const fetchAppInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/`);
      setAppInfo(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch app information');
      console.error('Error fetching app info:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchAppInfo} />;

  return (
    <div className="page">
      <div className="hero">
        <h1>🚀 Welcome to React Docker App!</h1>
        <p>A production-ready React application running in Docker containers</p>
        <div className="hero-buttons">
          <Link to="/users" className="btn btn-primary">View Users</Link>
          <Link to="/posts" className="btn btn-secondary">View Posts</Link>
        </div>
      </div>

      {appInfo && (
        <div className="info-grid">
          <div className="info-card">
            <h3>📱 Application Info</h3>
            <p><strong>Version:</strong> {appInfo.version}</p>
            <p><strong>Timestamp:</strong> {new Date(appInfo.timestamp).toLocaleString()}</p>
          </div>
          
          <div className="info-card">
            <h3>🔗 Available Endpoints</h3>
            <ul>
              {Object.entries(appInfo.endpoints).map(([key, path]) => (
                <li key={key}>
                  <strong>{key}:</strong> {path}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Users Page
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.role.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchUsers} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>👥 Users</h1>
        <p>Manage and view all users in the system</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="grid">
        {filteredUsers.map(user => (
          <Link key={user.id} to={`/users/${user.id}`} className="card user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className={`role role-${user.role}`}>{user.role}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

// User Detail Page
const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
      setUser(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user details');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchUser} />;
  if (!user) return <ErrorMessage error="User not found" />;

  return (
    <div className="page">
      <button onClick={() => navigate('/users')} className="back-btn">
        ← Back to Users
      </button>
      
      <div className="user-detail">
        <div className="user-avatar-large">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-detail-info">
          <h1>{user.name}</h1>
          <p className="user-email">{user.email}</p>
          <span className={`role role-${user.role}`}>{user.role}</span>
        </div>
      </div>
    </div>
  );
};

// Posts Page
const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/posts`);
      setPosts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchPosts} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📝 Posts</h1>
        <p>Latest posts and articles</p>
      </div>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="card post-card">
            <h3>{post.title}</h3>
            <p className="post-content">{post.content}</p>
            <div className="post-author">
              <strong>By:</strong> {post.author?.name || 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Page
const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/stats`);
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchStats} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Statistics</h1>
        <p>Application metrics and server information</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>👥 Users</h3>
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-breakdown">
              <p>Admin: {stats.usersByRole.admin}</p>
              <p>Users: {stats.usersByRole.user}</p>
            </div>
          </div>

          <div className="stat-card">
            <h3>📝 Posts</h3>
            <div className="stat-number">{stats.totalPosts}</div>
          </div>

          <div className="stat-card">
            <h3>🖥️ Server</h3>
            <div className="server-info">
              <p><strong>Node:</strong> {stats.serverInfo.nodeVersion}</p>
              <p><strong>Platform:</strong> {stats.serverInfo.platform}</p>
              <p><strong>Uptime:</strong> {Math.floor(stats.serverInfo.uptime)}s</p>
            </div>
          </div>

          <div className="stat-card">
            <h3>💾 Memory</h3>
            <div className="memory-info">
              <p><strong>Used:</strong> {(stats.serverInfo.memory.heapUsed / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Total:</strong> {(stats.serverInfo.memory.heapTotal / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>ℹ️ About</h1>
        <p>Learn more about this application</p>
      </div>

      <div className="about-content">
        <div className="card">
          <h3>🐳 React Docker App</h3>
          <p>
            This is a production-ready React application running in Docker containers.
            It demonstrates modern web development practices including:
          </p>
          <ul>
            <li>React 18 with React Router</li>
            <li>RESTful API integration with Axios</li>
            <li>Responsive design and modern CSS</li>
            <li>Docker containerization</li>
            <li>Production optimizations</li>
          </ul>
        </div>

        <div className="card">
          <h3>🏗️ Architecture</h3>
          <p>
            The application uses a microservices architecture with:
          </p>
          <ul>
            <li><strong>Frontend:</strong> React served by nginx</li>
            <li><strong>Backend:</strong> Node.js/Express API</li>
            <li><strong>Containerization:</strong> Docker with security hardening</li>
            <li><strong>Networking:</strong> Container-to-container communication</li>
          </ul>
        </div>

        <div className="card">
          <h3>🔒 Security Features</h3>
          <ul>
            <li>Non-root container execution</li>
            <li>Read-only filesystems</li>
            <li>Security headers in nginx</li>
            <li>Capability dropping</li>
            <li>Resource limits</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={
            <div className="page">
              <div className="error">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App; 