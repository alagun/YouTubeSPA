import * as yup from 'yup'

export const schema = yup.object({
  name: yup.string().required('Название обязательно'),
  query: yup.string().required('Запрос обязателен'),
  order: yup.string().optional().default('relevance'),
  maxResults: yup.number()
    .min(1, 'Минимум 1 видео')
    .max(50, 'Максимум 50 видео')
    .optional()
    .default(12),
})

export type FormData = yup.InferType<typeof schema>