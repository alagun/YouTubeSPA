import React from 'react'
import { Card, Typography, Space, Button } from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import styles from './RegistrationPage.module.scss'
import { RegistrationForm } from '../../../features/registration-form'

const { Title, Text } = Typography

export const RegistrationPage: React.FC = () => {
  return (
    <div className={styles.registrationPage}>
      <div className={styles.backButton}>
        <Link to='/login'>
          <Button type='text' icon={<ArrowLeftOutlined />}>
            Назад к входу
          </Button>
        </Link>
      </div>

      <Card className={styles.card}>
        <Space direction='vertical' size='middle' className={styles.header}>
          <Title level={2} className={styles.title}>
            Регистрация
          </Title>
          <Text type='secondary' className={styles.subtitle}>
            Создайте аккаунт для доступа к YouTube SPA
          </Text>
        </Space>

        <RegistrationForm />

        <div className={styles.footer}>
          <Text type='secondary'>
            Уже есть аккаунт?{' '}
            <Link to='/login' className={styles.link}>
              Войти
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}