import React from "react";
import { Routes,Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { HomeDetail } from"./pages/HomeDetail";
import { Contact } from "./pages/Contact";

function App(): React.JSX.Element {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/posts/:id" element={<HomeDetail />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </div>
  );
};

export default App;
