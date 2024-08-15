import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import { PictureProvider } from './contexts/PictureContext';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <PictureProvider>
            <Header />
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Content>
            </PictureProvider>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;