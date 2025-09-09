import React, { useState, useEffect } from 'react'
import { Layout, Table, Button, Space, Typography, Card, message, Grid } from 'antd'
import { EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'
import { deleteQuery, SavedQuery, loadQueries } from '@/features/saved-queries/model/savedQueriesSlice'
import { setSearchQuery, setSearchParams } from '@/features/search/model/searchSlice'
import { SaveQueryModal } from '@/features/saved-queries/ui/SaveQueryModal'
import { AppHeader } from '@/widgets/header'
import styles from './SavedQueriesPage.module.scss'

const { Content } = Layout
const { Title, Text } = Typography
const { useBreakpoint } = Grid

export const SavedQueriesPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const screens = useBreakpoint()
  const savedQueries = useAppSelector(state => state.savedQueries.queries)
  const currentUser = useAppSelector(state => state.auth.user)

  const [editingQuery, setEditingQuery] = useState<SavedQuery | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  useEffect(() => {
    dispatch(loadQueries())
  }, [dispatch, currentUser])

  const userQueries = savedQueries

  const handleExecuteQuery = (query: SavedQuery) => {
    dispatch(setSearchQuery(query.query))
    dispatch(setSearchParams({
      maxResults: query.maxResults || 12,
      order: query.order || 'relevance',
    }))
    navigate('/')
    message.success(`Выполняется запрос: "${query.name}"`)
  }

  const handleEditQuery = (query: SavedQuery) => {
    setEditingQuery(query)
    setIsEditModalVisible(true)
  }

  const handleDeleteQuery = (id: string) => {
    dispatch(deleteQuery(id))
    message.success('Запрос удален')
  }

  const handleEditSuccess = () => {
    setIsEditModalVisible(false)
    setEditingQuery(null)
    message.success('Запрос успешно обновлен')
  }

  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => <Text strong>{name}</Text>,
      },
      {
        title: 'Запрос',
        dataIndex: 'query',
        key: 'query',
        render: (query: string) => <Text ellipsis>{query}</Text>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsive: ['md'] as any,
      },
      {
        title: 'Сортировка',
        dataIndex: 'order',
        key: 'order',
        render: (order: string) => {
          const orderLabels: { [key: string]: string } = {
            relevance: 'По релевантности',
            date: 'По дате',
            rating: 'По рейтингу',
            title: 'По названию',
            viewCount: 'По просмотрам',
          }

          return orderLabels[order] || 'По релевантности'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsive: ['lg'] as any,
      },
      {
        title: 'Кол-во',
        dataIndex: 'maxResults',
        key: 'maxResults',
        render: (maxResults: number) => maxResults || 12,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsive: ['lg'] as any,
      },
      {
        title: 'Действия',
        key: 'actions',
        width: 120,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_: any, record: SavedQuery) => (
          <Space size='small' direction={screens.xs ? 'vertical' : 'horizontal'} className={styles.actionButtons}>
            <Button
              type='primary'
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecuteQuery(record)}
              size='small'
              block={screens.xs}
            >
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditQuery(record)}
              size='small'
              block={screens.xs}
            >
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuery(record.id)}
              size='small'
              block={screens.xs}
            >
            </Button>
          </Space>
        ),
      },
    ]

    if (screens.xs) {
      return baseColumns.filter(col => col.key === 'name' || col.key === 'actions',
      )
    }

    if (screens.sm && !screens.md) {
      return baseColumns.filter(col => col.key === 'name' || col.key === 'query' || col.key === 'actions',
      )
    }

    return baseColumns
  }

  const renderMobileCards = () => (
    <div className={styles.mobileCards}>
      {userQueries.map(query => (
        <Card key={query.id} className={styles.queryCard} size='small'>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <Text strong className={styles.queryName}>{query.name}</Text>
              <Text type='secondary' ellipsis className={styles.queryText}>
                {query.query}
              </Text>
            </div>
            <div className={styles.cardActions}>
              <Button
                type='primary'
                icon={<PlayCircleOutlined />}
                onClick={() => handleExecuteQuery(query)}
                size='small'
              >
                Выполнить
              </Button>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditQuery(query)}
                  size='small'
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteQuery(query.id)}
                  size='small'
                />
              </Space>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <Layout className={styles.layout}>
      <AppHeader />

      <Content className={styles.content}>
        <Card className={styles.card}>
          <Title level={2} className={styles.title}>
            Сохраненные запросы
          </Title>

          {userQueries.length === 0 ? (
            <div className={styles.emptyState}>
              <Title level={4}>Нет сохраненных запросов</Title>
              <p>Сохраните свой первый запрос поиска на главной странице</p>
            </div>
          ) : (
            <>
              {screens.xs ? (
                renderMobileCards()
              ) : (
                <div className={styles.tableContainer}>
                  <Table
                    columns={getColumns()}
                    dataSource={userQueries.map(query => ({ ...query, key: query.id }))}
                    pagination={false}
                    className={styles.fadeIn}
                    // size={screens.sm ? 'middle' : 'small'}
                  />
                </div>
              )}
            </>
          )}
        </Card>

        <SaveQueryModal
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false)
            setEditingQuery(null)
          }}
          searchQuery={editingQuery?.query || ''}
          editingQuery={editingQuery}
          onSuccess={handleEditSuccess}
        />
      </Content>
    </Layout>
  )
}