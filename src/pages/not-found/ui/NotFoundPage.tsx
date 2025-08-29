import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>404 - Страница не найдена</h1>
      <Button type='primary' onClick={() => navigate('/')}>
        Вернуться на главную
      </Button>
    </div>
  )
}