import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_LOGIN_URL, API_REGISTER_URL, API_URL, API_USERS_URL } from '../config/api'
import type { TRegistrationForm } from '../../features/registration-form/models/registration'
import { IUser } from '@/entities/user/model/authSlice'

export interface IAuthResponse {
  token: string;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')

      return headers
    },
  }),
  endpoints: builder => ({
    login: builder.mutation<IAuthResponse, IAuthRequest>({
      query: credentials => ({
        url: API_LOGIN_URL,
        method: 'POST',
        body: credentials,
      }),
    }),
    // register: builder.mutation<IRegisterResponse, TRegistrationForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: builder.mutation<any, TRegistrationForm>({
      query: credentials => ({
        url: API_REGISTER_URL,
        method: 'POST',
        body: credentials,
      }),
    }),
    getUser: builder.query<IUser[], void>({
      query: () => ({
        url: API_USERS_URL,
        method: 'GET',
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetUserQuery, useLazyGetUserQuery } = authApi