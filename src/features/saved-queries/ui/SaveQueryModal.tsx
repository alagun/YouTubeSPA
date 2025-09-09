import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { addQuery, updateQuery, SavedQuery } from '../model/savedQueriesSlice'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'
import { schema, FormData } from '../lib/ValidationSchema'
import styles from './SaveQueryModal.module.scss'

const { Option } = Select

interface SaveQueryModalProps {
  visible: boolean;
  onCancel: () => void;
  searchQuery: string;
  editingQuery?: SavedQuery | null;
  onSuccess?: () => void;
}

const orderOptions = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'date', label: 'По дате' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'title', label: 'По названию' },
  { value: 'viewCount', label: 'По количеству просмотров' },
]

export const SaveQueryModal: React.FC<SaveQueryModalProps> = ({
  visible,
  onCancel,
  searchQuery,
  editingQuery = null,
  onSuccess,
}) => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.auth.user)

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: editingQuery?.name || '',
      query: editingQuery?.query || searchQuery,
      order: editingQuery?.order || 'relevance',
      maxResults: editingQuery?.maxResults || 12,
    },
  })

  useEffect(() => {
    if (visible) {
      reset({
        name: editingQuery?.name || '',
        query: editingQuery?.query || searchQuery,
        order: editingQuery?.order || 'relevance',
        maxResults: editingQuery?.maxResults || 12,
      })
    }
  }, [visible, editingQuery, searchQuery, reset])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editingQuery) {
        dispatch(updateQuery({
          ...editingQuery,
          ...data,
        }))
      } else {
        let userId = currentUser?.id

        if (!userId) {
          const currentUserStr = localStorage.getItem('currentUser')

          if (currentUserStr) {
            const currentUserData = JSON.parse(currentUserStr)

            userId = currentUserData.id
          }
        }

        if (!userId) {
          console.error('Пользователь не авторизован')
          onCancel()

          return
        }

        dispatch(addQuery({
          name: data.name,
          query: data.query,
          order: data.order,
          maxResults: data.maxResults,
          userId: userId,
        }))
      }

      onCancel()
      reset()
      onSuccess?.()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Ошибка при сохранении запроса')
    }
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  return (
    <Modal
      title={editingQuery ? 'Редактировать запрос' : 'Сохранить поисковый запрос'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      className={styles.modal}
      width={500}
    >
      <Form
        layout='vertical'
        onFinish={handleSubmit(onSubmit)}
        className={styles.form}
      >


        <Form.Item
          label='Поисковый запрос'
          validateStatus={errors.query ? 'error' : ''}
          help={errors.query?.message}
        >
          <Controller
            name='query'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={!editingQuery}
                placeholder='Поисковый запрос'
                size='large'
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label='Название'
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Введите название запроса'
                size='large'
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label='Сортировать по'
          validateStatus={errors.order ? 'error' : ''}
          help={errors.order?.message}
        >
          <Controller
            name='order'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder='Выберите сортировку'
                size='large'
                allowClear
              >
                {orderOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label='Максимальное количество видео'
          validateStatus={errors.maxResults ? 'error' : ''}
          help={errors.maxResults?.message}
        >
          <Controller
            name='maxResults'
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={1}
                max={50}
                placeholder='От 1 до 50'
                size='large'
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>

        <Form.Item className={styles.buttons}>
          <Button onClick={handleCancel} size='large'>
            Отмена
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={isSubmitting}
            size='large'
          >
            {editingQuery ? 'Обновить' : 'Сохранить'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}