import React, { useState } from 'react';
import { Layout, Menu, Button, Row, Col, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

type TextAlign = 'left' | 'right' | 'center' | 'justify';

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff',
  };

  const logoStyle: React.CSSProperties = {
      width: '134px',
      height: '35px',    
      fontFamily: 'Roboto Serif',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '30px',
      lineHeight: '35px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center' as TextAlign,
      color: '#000000',
  };

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const menuItems = [
    { key: '/', label: 'Home', onClick: () => navigate('/') },
    { key: '/favorites', label: 'Favorites', onClick: () => navigate('/favorites') },
  ];

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </>
  );

  const renderDesktopMenu = () => (
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
      <Col>
        <div className="logo" style={logoStyle}>
          <Link to="/">PicShare</Link>
        </div>
    </Col>
    <Col>
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
        >
          {renderMenuItems()}
        </Menu>
      </Col>
      <Col>
        <Button 
          type="primary" 
          style={{ marginRight: '10px' }}
          onClick={() => navigate('/add-picture')}
        >
          Share Pic
        </Button>
        <Button onClick={logout}>Log Out</Button>
      </Col>
    </Row>
  );

  const renderMobileMenu = () => (
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
      <Col>
        <div className="logo">
          <Link to="/">PicShare</Link>
        </div>
      </Col>
      <Col>
        <Button 
          type="primary" 
          icon={<MenuOutlined />} 
          onClick={() => setMobileMenuVisible(true)}
        />
      </Col>
    </Row>
  );

  return (
    <Header style={headerStyle}>
      {user ? (
        isMobile ? (
          <>
            {renderMobileMenu()}
            <Drawer
              title="Menu"
              placement="right"
              onClose={() => setMobileMenuVisible(false)}
              visible={mobileMenuVisible}
            >
              <Menu mode="vertical" selectedKeys={[location.pathname]}>
                {renderMenuItems()}
                <Menu.Item key="add-picture" onClick={() => navigate('/add-picture')}>
                  Share Pic
                </Menu.Item>
                <Menu.Item key="logout" onClick={logout}>
                  Log Out
                </Menu.Item>
              </Menu>
            </Drawer>
          </>
        ) : (
          renderDesktopMenu()
        )
      ) : (
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col>
            <div className="logo">
              <Link to="/">PicShare</Link>
            </div>
          </Col>
          <Col>
            <Link to="/login"><Button type="primary">Log In</Button></Link>
          </Col>
        </Row>
      )}
    </Header>
  );
};

export default AppHeader;