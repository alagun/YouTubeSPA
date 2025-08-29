import * as yup from 'yup'
import dayjs from 'dayjs'

export const registrationSchema = yup.object().shape({
  username: yup.string().required('Имя пользователя обязательно'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен быть не менее 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать минимум 1 заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать минимум 1 прописную букву')
    .matches(/[0-9]/, 'Пароль должен содержать минимум 1 цифру')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Пароль должен содержать минимум 1 специальный символ',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
  birthDate: yup
    .date()
    .required('Дата рождения обязательна')
    .test(
      'age-range',
      'Возраст должен быть от 10 до 100 лет',
      (value) => {
        if (!value) return false

        const age = dayjs().diff(dayjs(value), 'year')

        return age >= 10 && age <= 100
      },
    ),
  gender: yup.string().oneOf(['male', 'female'] as const).required('Укажите пол'),
  phone: yup.string(),
})

//password registerR1"