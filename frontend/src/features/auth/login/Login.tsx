import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import { login } from "../../../store/auth/auth.thunks";
import { authErrorSelector, authLoadingSelector } from "../../../store/auth/auth.slice";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector(authErrorSelector);
  const loading = useSelector(authLoadingSelector);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1>Login</h1>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? "..." : "Login"}</button>
      </form>
    </div>
  )
}

export default Login