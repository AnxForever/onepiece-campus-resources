import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import ResourceDetail from './pages/ResourceDetail';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import UploadManagement from './pages/UploadManagement';
import LearningAnalytics from './pages/LearningAnalytics';
import StudyGroups from './pages/StudyGroups';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/upload" element={<UploadManagement />} />
          <Route path="/analytics" element={<LearningAnalytics />} />
          <Route path="/groups" element={<StudyGroups />} />
        </Routes>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          duration={3000}
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '12px',
              color: '#1f2937'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App;
