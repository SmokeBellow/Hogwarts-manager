import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = mode === "login" ? await api.login(username, password) : await api.register(username, password);
      login(res.token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="parchment-card" style={{ maxWidth: 420, width: "100%" }}>
        <h1 style={{ textAlign: "center", marginTop: 0 }}>Хогвартс: Путь Волшебника</h1>
        <p style={{ textAlign: "center" }}>
          {mode === "login" ? "Войди, чтобы продолжить обучение" : "Создай учётную запись волшебника"}
        </p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
          <input
            type="text"
            required
            placeholder="Никнейм"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <span className="error-text">{error}</span>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <button
          className="btn"
          style={{ marginTop: 14, width: "100%" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Ещё нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}
