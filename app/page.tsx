"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, use proper auth
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("dss_auth", "true")
    } else {
      alert("Username atau password salah")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("dss_auth")
  }

  return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}
