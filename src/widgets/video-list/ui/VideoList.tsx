import React, { useEffect } from 'react'
import { Row, Col, Card, List, Typography, Spin, Empty } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useSearchVideosQuery } from '@/shared/api/youtubeApi'
import { setPageToken } from '@/features/search/model/searchSlice'
import type { Video } from '@/shared/api/youtubeApi'
import styles from './VideoList.module.scss'
import { useAppDispatch, useAppSelector } from '@/app/store/store.hooks'

const { Text, Title } = Typography

interface VideoListProps {
  isListView: boolean;
}

export const VideoList: React.FC<VideoListProps> = ({ isListView }) => {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(state => state.search.query)
  const maxResults = useAppSelector(state => state.search.maxResults)
  const order = useAppSelector(state => state.search.order)
  const currentPage = useAppSelector(state => state.search.currentPage)
  const pageTokens = useAppSelector(state => state.search.pageTokens)

  const pageToken = pageTokens[currentPage - 1]

  const { data, error, isLoading } = useSearchVideosQuery(
    {
      q: searchQuery,
      maxResults: maxResults || 12,
      order: order || 'relevance',
      pageToken,
    },
    { skip: !searchQuery },
  )

  useEffect(() => {
    if (data?.nextPageToken && !pageTokens[currentPage]) {
      dispatch(setPageToken({ page: currentPage, token: data.nextPageToken }))
    }
  }, [data?.nextPageToken, currentPage, dispatch, pageTokens])

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size='large' />
        <Text>Загрузка видео...</Text>
      </div>
    )
  }

  if (error) {
    console.error('YouTube API Error:', error)

    return (
      <Empty
        description='Ошибка загрузки видео. Проверьте ключ API.'
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  if (!data?.items?.length) {
    return (
      <Empty
        description={searchQuery ? 'Видео не найдены' : 'Введите поисковый запрос'}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const renderCardView = () => (
    <Row gutter={[16, 16]}  style={{ marginLeft: 0, marginRight: 0 }}>
      {data.items.map((video: Video) => (
        <Col xs={24} sm={12} md={8} lg={6} key={video.id.videoId}>
          <Card
            hoverable
            className={styles.videoCard}
            cover={
              <div className={styles.thumbnailContainer}>
                <img
                  alt={video.snippet.title}
                  src={video.snippet.thumbnails.medium.url}
                  className={styles.thumbnail}
                />
                <div className={styles.playOverlay}>
                  <PlayCircleOutlined className={styles.playIcon} />
                </div>
              </div>
            }
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
          >
            <Card.Meta
              title={<Text ellipsis={{ tooltip: video.snippet.title }}>{video.snippet.title}</Text>}
              description={
                <div className={styles.videoInfo}>
                  <Text type='secondary' className={styles.channelTitle}>
                    {video.snippet.channelTitle}
                  </Text>
                  <Text type='secondary' className={styles.publishedDate}>
                    {formatDate(video.snippet.publishedAt)}
                  </Text>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  )

  const renderListView = () => (
    <List
      itemLayout='horizontal'
      dataSource={data.items}
      renderItem={(video: Video) => (
        <List.Item
          className={styles.listItem}
          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
        >
          <div className={styles.listContent}>
            <div className={styles.thumbnailWrapper}>
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className={styles.listThumbnail}
              />
              <div className={styles.playOverlay}>
                <PlayCircleOutlined className={styles.playIcon} />
              </div>
            </div>
            <div className={styles.listInfo}>
              <Title level={5} className={styles.videoTitle}>
                {video.snippet.title}
              </Title>
              <Text type='secondary' className={styles.channelName}>
                {video.snippet.channelTitle}
              </Text>
              <Text type='secondary' className={styles.videoDate}>
                {formatDate(video.snippet.publishedAt)}
              </Text>
              <Text className={styles.videoDescription}>
                {video.snippet.description}
              </Text>
            </div>
          </div>
        </List.Item>
      )}
    />
  )

  return (
    <div className={styles.container}>
      <div className={styles.videosContainer}>
        {isListView ? renderListView() : renderCardView()}
      </div>
    </div>
  )
}