import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Failed to login')
    }
  };

  return (
    <form onSubmit={handleSubmit}
    className="
    login-form
    animate__animated 
    animate__fadeInDown 
    animate__faster">
      <label>
        <input
          type="email"
          value={email}
          placeholder='email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <input
          type="password"
          value={password}
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button disabled={loading} className="login-submit-button" type="submit">Login</button>
      <Link to="/reset-password" className="reset-password">Reset password</Link>
      {error && <p>{error}</p>}
    </form>
  );

}
 
export default Login;