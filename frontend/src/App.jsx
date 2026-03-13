import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/portfolio/Layout";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import WorkDetailPage from "./pages/WorkDetailPage";
import TeachPage from "./pages/TeachPage";
import WritingPage from "./pages/WritingPage";
import BlogPostPage from "./pages/BlogPostPage";
import GalleryPage from "./pages/GalleryPage";
import CVPage from "./pages/CVPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<WorkDetailPage />} />
            <Route path="/teach" element={<TeachPage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/writing/:slug" element={<BlogPostPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
