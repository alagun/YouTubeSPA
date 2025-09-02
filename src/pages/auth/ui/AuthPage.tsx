import React from 'react'
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../../shared/api/authApi'
import styles from './AuthPage.module.scss'
import { setCredentials, setLoading } from '../../../entities/user/model/authSlice'
import { useAppDispatch } from '../../../app/store/store.hooks'

const { Title, Text } = Typography

export const AuthPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true))
      const response = await login(values).unwrap()

      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken,
      }))

      message.success('Успешный вход!')
      navigate('/', { replace: true })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error?.data?.errors)

      if (error.status === 401) {
        message.error('Неверный логин или пароль')
      } else {
        message.error('Ошибка при входе. Попробуйте позже.')
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