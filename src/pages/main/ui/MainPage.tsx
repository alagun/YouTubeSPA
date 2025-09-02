import React, { useState } from 'react'
import { Layout, Input, Button, Row, Col, Typography, Space } from 'antd'
import { SearchOutlined, SaveOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons'
import { VideoList } from '@/widgets/video-list/ui/VideoList'
import { AppHeader } from '@/widgets/header'
import { SaveQueryModal } from '@/features/saved-queries/ui/SaveQueryModal'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'
import { clearSearch, setSearchQuery } from '@/features/search/model/searchSlice'
import styles from './MainPage.module.scss'

const { Content } = Layout
const { Title } = Typography

export const MainPage: React.FC = () => {
  const [isListView, setIsListView] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const searchQuery = useAppSelector(state => state.search.query)
  const dispatch = useAppDispatch()

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value))
  }

  const handleClearSearch = () => {
    dispatch(clearSearch())
  }

  return (
    <Layout className={styles.layout}>
      <AppHeader />

      <Content className={styles.content}>
        <div className={styles.searchSection}>
          <Row gutter={[16, 16]} align='middle' justify='center' style={{ marginLeft: 0, marginRight: 0 }}>
            <Col xs={24} md={18} lg={16}>
              <Input
                size='large'
                placeholder='Поиск видео на YouTube...'
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onPressEnter={e => handleSearch((e.target as HTMLInputElement).value)}
                prefix={<SearchOutlined />}
                suffix={
                  <Space>
                    {searchQuery && (
                      <Button
                        type='text'
                        icon={<SaveOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        title='Сохранить поиск'
                      />
                    )}
                  </Space>
                }
                allowClear
                onClear={handleClearSearch}
              />
            </Col>
            <Col>
              <Space>
                <AppstoreOutlined
                  style={{
                    color: !isListView ? '#1890ff' : '#999',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsListView(false)}
                  title='Вид карточек'
                />
                <UnorderedListOutlined
                  style={{
                    color: isListView ? '#1890ff' : '#999',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsListView(true)}
                  title='Вид списка'
                />
              </Space>
            </Col>
          </Row>
        </div>

        <div className={styles.resultsSection}>
          {searchQuery && (
            <Title level={4} className={styles.resultsTitle}>
              Результаты поиска: &ldquo;{searchQuery}&ldquo;
            </Title>
          )}
          <VideoList isListView={isListView} />
        </div>
      </Content>

      <SaveQueryModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        searchQuery={searchQuery}
      />
    </Layout>
  )
}