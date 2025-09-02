import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface SearchResponse {
  items: Video[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface SearchParams {
  q: string;
  maxResults?: number;
  order?: string;
  pageToken?: string;
}

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  if (!apiKey) {
    throw new Error('YouTube API key is not configured. Please check your .env file')
  }

  return apiKey
}


export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.googleapis.com/youtube/v3/',
  }),
  endpoints: builder => ({
    searchVideos: builder.query<SearchResponse, SearchParams>({
      query: ({ q, maxResults = 12, order = 'relevance', pageToken }) => {
        const apiKey = getApiKey()

        const params: Record<string, string> = {
          part: 'snippet',
          type: 'video',
          q: q,
          maxResults: maxResults.toString(),
          order,
          key: apiKey,
        }

        if (pageToken) {
          params.pageToken = pageToken
        }

        return {
          url: 'search',
          params,
        }
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.q}`
      },
    }),
  }),
})

export const { useSearchVideosQuery, useLazySearchVideosQuery } = youtubeApi