import React from "react";
import Router from "./routes/Router";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Router />
      </main>
    </div>
  );
}
