"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (username: string, password: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/school-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <Card className="w-full max-w-md shadow-lg relative z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">Sistem Penunjang Keputusan</p>
            <p className="text-muted-foreground mt-1 text-lg">SMK Kanisius Ungaran</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <Input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold">
              Login
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            Demo: username: <strong>admin</strong>, password: <strong>admin123</strong>
          </p>
        </div>
      </Card>
    </div>
  )
}
