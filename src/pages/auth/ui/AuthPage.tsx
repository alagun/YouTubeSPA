import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Select } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLazyGetUserQuery, useLoginMutation } from '../../../shared/api/authApi'
import styles from './AuthPage.module.scss'
import { setCredentials, setLoading } from '../../../entities/user/model/authSlice'
import { useAppDispatch } from '../../../app/store/store.hooks'

const { Title, Text } = Typography
const { Option } = Select

const testUsers = [
  {
    email: 'alexej.lagun@gmail.com',
    password: 'registerR1"',
    label: 'Alexej Lagun',
  },
  {
    email: 'jak.tokd@gmail.com',
    password: 'registerR1"',
    label: 'Jak Tokd',
  },
]

function removeFirstDot (email: string): string {
  const dotIndex = email.indexOf('.')

  if (dotIndex === -1) {
    return email
  }

  return email.slice(0, dotIndex) + email.slice(dotIndex + 1)
}

export const AuthPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [getUserData] = useLazyGetUserQuery()
  const [selectedUser, setSelectedUser] = useState<string>('')

  const handleUserChange = (value: string) => {
    setSelectedUser(value)
    const user = testUsers.find(u => u.email === value)

    if (user) {
      form.setFieldsValue({
        email: user.email,
        password: user.password,
      })
    }
  }

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true))
      const response = await login(values).unwrap()

      try {
        const userDataResponse = await getUserData().unwrap()

        const User = userDataResponse.find(item => item.email === removeFirstDot(values.email))

        dispatch(setCredentials({
          user: {
            id:  User?.id ? User.id : '0',
            username: User?.username ? User.username : 'Jane Doe',
            email: User?.email ? User.email : 'JaneDoe@example.com', // values.email
            age: User?.age ? User.age : 0,
            gender: User?.gender ? User.gender : 'unknowm',
            // isAuth: false,
            isAuth: true,
          },
          token: response.token,
        }))

        localStorage.setItem('token', response.token)

      } catch (userError) {
        console.error('Failed to fetch user data:', userError)
      }

      navigate('/', { replace: true })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error?.data?.errors)

      if (error.status === 401) {
        console.error('Неверный логин или пароль')
      } else {
        console.error('Ошибка при входе. Попробуйте позже.')
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <div className={styles.authHeader}>
          <Title level={2} className={styles.title}>
            Вход в YouTube SPA
          </Title>
          <Text type='secondary' className={styles.subtitle}>
            Введите ваши учетные данные для входа
          </Text>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Выберите тестового пользователя:
          </Text>
          <Select
            value={selectedUser}
            onChange={handleUserChange}
            placeholder='Выберите пользователя'
            style={{ width: '100%' }}
            size='large'
          >
            <Option value=''>Ручной ввод</Option>
            {testUsers.map(user => (
              <Option key={user.email} value={user.email}>
                {user.label}
              </Option>
            ))}
          </Select>
        </div>

        <Form
          form={form}
          name='login'
          onFinish={onFinish}
          layout='vertical'
          className={styles.authForm}
          size='large'
        >
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Пожалуйста, введите логин!' },
              { min: 3, message: 'Логин должен содержать минимум 3 символа' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Логин'
              autoComplete='username'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль!' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Пароль'
              autoComplete='current-password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              block
              className={styles.submitButton}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Text type='secondary'>
            Нет аккаунта?{' '}
            <Link to='/registration' className={styles.link}>
              Зарегистрироваться
            </Link>
          </Text>
        </div>

        <div className={styles.authFooter}>
          <Alert
            message='Тестовые данные'
            description='Используйте любые данные для входа (API демонстрационное)'
            type='info'
            showIcon
          />
        </div>
      </Card>
    </div>
  )
}