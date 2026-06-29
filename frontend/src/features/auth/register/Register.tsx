import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import { register } from "../../../store/auth/auth.thunks";
import { authErrorSelector, authLoadingSelector } from "../../../store/auth/auth.slice";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector(authErrorSelector);
  const loading = useSelector(authLoadingSelector);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(register({ firstname, lastname, email, password }));

    if (register.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1>Register</h1>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} />
        <input placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "..." : "Register"}</button>
      </form>
    </div>
  );
};

export default Register