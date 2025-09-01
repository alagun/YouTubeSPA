import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './store.types'

const useAppSelector = useSelector.withTypes<RootState>()
const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export { useAppDispatch, useAppSelector }
