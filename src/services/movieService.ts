import axios from 'axios';
import type { MoviesResponse } from '../types/movie';

interface FetchMoviesParams {
  query: string;
  page?: number;
}

export async function fetchMovies({ query, page = 1 }: FetchMoviesParams): Promise<MoviesResponse> {
  const url = 'https://api.themoviedb.org/3/search/movie';
  const options = {
    params: { 
      query, 
      page,
      include_adult: false, 
      language: 'en-US' 
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<MoviesResponse>(url, options); 
    return response.data;
  } catch {
    throw new Error('Failed to fetch movies');
  }
}