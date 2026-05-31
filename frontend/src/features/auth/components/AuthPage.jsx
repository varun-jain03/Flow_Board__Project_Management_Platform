import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser, registerUser } from "../store/authSlice.js";
import Button from "../../../shared/ui/Button.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Alert from "../../../shared/ui/Alert.jsx";

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    dispatch(clearAuthError());
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await dispatch(
        loginUser({ email: form.email, password: form.password }),
      );
      if (loginUser.fulfilled.match(result)) navigate("/organizations");
    } else {
      const result = await dispatch(registerUser(form));
      if (registerUser.fulfilled.match(result)) navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-brand-900 via-surface to-surface p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold">
            F
          </span>
          <span className="text-xl font-bold text-white">FlowBoard</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Ship projects with clarity
          </h2>
          <p className="mt-4 max-w-md text-lg text-slate-400">
            Organizations, workspaces, boards, and tasks — all in one
            collaborative platform built for modern teams.
          </p>
        </div>
        <p className="text-sm text-slate-600">
          Full-stack project management · React + Node.js
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <span className="text-2xl font-bold text-white">FlowBoard</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin
              ? "Sign in to continue to your workspace"
              : "Register to get started"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Alert message={error} onClose={() => dispatch(clearAuthError())} />

            {!isLogin && (
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
              />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" loading={loading}>
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="font-medium text-brand-400 hover:text-brand-300"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
