// widgets/header/ui/Header.tsx
import React from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import {
  HomeOutlined,
  SaveOutlined,
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '@/entities/user/model/authSlice'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'
import styles from './Header.module.scss'

const { Header: AntHeader } = Layout

export const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Главная',
    },
    {
      key: '/saved',
      icon: <SaveOutlined />,
      label: 'Сохраненные запросы',
    },
  ]

  const userMenuItems = [
    {
      key: 'user-info',
      label: `Пользователь: ${user?.login || 'Гость'}`,
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <SearchOutlined className={styles.logoIcon} />
        <span>YouTube SPA</span>
      </div>

      <Menu
        theme='dark'
        mode='horizontal'
        selectedKeys={[location.pathname]}
        items={menuItems}
        className={styles.menu}
        onClick={({ key }) => navigate(key)}
      />

      <Dropdown
        menu={{ items: userMenuItems }}
        placement='bottomRight'
        arrow
        trigger={['click']}
      >
        <Button type='text' className={styles.userButton}>
          <Space>
            <Avatar size='small' icon={<UserOutlined />} />
            <span className={styles.userName}>{user?.login}</span>
          </Space>
        </Button>
      </Dropdown>
    </AntHeader>
  )
}