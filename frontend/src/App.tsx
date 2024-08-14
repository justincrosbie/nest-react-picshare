import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import AddPicture from './pages/AddPicture';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Header />
          <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/add-picture" element={<AddPicture />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;