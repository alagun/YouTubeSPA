import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, DatePicker, Form, Input, Radio, Modal } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

import { registrationSchema } from '../lib/ValidationSchema'

import styles from './RegistrationForm.module.scss'
import type { TRegistrationForm } from '../models/registration'
import { useRegisterMutation } from '../../../shared/api/authApi'
import { useAppDispatch } from '../../../app/store/store.hooks'
import { setLoading } from '../../../entities/user/model/authSlice'

export const RegistrationForm = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: undefined,
      gender: 'male',
      phone: '',
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [register, { isLoading }] = useRegisterMutation()

  const onSubmit = async (data: TRegistrationForm) => {
    try {
      dispatch(setLoading(true))
      await register(data).unwrap()

      Modal.success({
        title: 'Успешная регистрация!',
        content: 'Теперь вы можете войти в систему',
        onOk: () => navigate('/login'),
      })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      const serverMessage = error.response?.data?.message
      const defaultMessage = 'Произошла ошибка при регистрации'

      Modal.error({
        title: 'Ошибка',
        content: serverMessage || defaultMessage,
      })
    } finally {
      dispatch(setLoading(false))
    }

  }



  return (
    <Form onFinish={handleSubmit(onSubmit)} layout='vertical' className={styles.registrationForm}>
      <Form.Item label='Имя пользователя' help={errors.username?.message} validateStatus={errors.username ? 'error' : ''}>
        <Controller
          name='username'
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label='Email' help={errors.email?.message} validateStatus={errors.email ? 'error' : ''}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label='Пароль' help={errors.password?.message} validateStatus={errors.password ? 'error' : ''}>
        <Controller
          name='password'
          control={control}
          render={({ field }) => <Input.Password {...field} />}
        />
      </Form.Item>

      <Form.Item label='Подтверждение пароля' help={errors.confirmPassword?.message} validateStatus={errors.confirmPassword ? 'error' : ''}>
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => <Input.Password {...field} />}
        />
      </Form.Item>

      <Form.Item label='Дата рождения' help={errors.birthDate?.message} validateStatus={errors.birthDate ? 'error' : ''}>
        <Controller
          name='birthDate'
          control={control}
          render={({ field }) => (
            <DatePicker
              style={{ width: '100%' }}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={date => field.onChange(date ? date.toDate() : null)}
            />
          )}
        />
      </Form.Item>

      <Form.Item label='Пол' help={errors.gender?.message} validateStatus={errors.gender ? 'error' : ''}>
        <Controller
          name='gender'
          control={control}
          render={({ field }) => (
            <Radio.Group {...field}>
              <Radio value='male'>Мужской</Radio>
              <Radio value='female'>Женский</Radio>
            </Radio.Group>
          )}
        />
      </Form.Item>

      <Form.Item label='Номер телефона' help={errors.phone?.message} validateStatus={errors.phone ? 'error' : ''}>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Button type='primary' htmlType='submit'>
        Зарегистрироваться
      </Button>
    </Form>
  )
}