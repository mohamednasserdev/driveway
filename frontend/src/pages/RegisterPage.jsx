import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User, Car, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Please check your email for the code.");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const fields = [
    {
      field: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Mohamed Nasser",
      icon: <User size={14} />,
    },
    {
      field: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      icon: <Mail size={14} />,
    },
    {
      field: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Min. 6 characters",
      icon: <Lock size={14} />,
      toggle: () => setShowPassword(!showPassword),
      show: showPassword,
    },
    {
      field: "confirmPassword",
      label: "Confirm Password",
      type: showConfirm ? "text" : "password",
      placeholder: "Repeat password",
      icon: <Lock size={14} />,
      toggle: () => setShowConfirm(!showConfirm),
      show: showConfirm,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-20">
      {/* Background circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Car size={28} color="white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Create Account
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Join DriveWay and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(
              ({ field, label, type, placeholder, icon, toggle, show }) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    {icon} {label}
                  </label>
                  <div className="relative">
                    <input
                      type={type}
                      value={form[field]}
                      onChange={update(field)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white/5 text-white placeholder-slate-500 transition-all ${
                        toggle ? "pr-12" : ""
                      } ${
                        errors[field]
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500"
                      }`}
                    />
                    {toggle && (
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                  {errors[field] && (
                    <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer border-none disabled:opacity-60 hover:-translate-y-0.5 mt-2"
            >
              <UserPlus size={18} />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-semibold no-underline hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
