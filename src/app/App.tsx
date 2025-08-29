import React from 'react'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { Outlet } from 'react-router-dom'
import './styles/global.scss'

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  )
}

export default App