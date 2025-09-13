import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';


export default function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies({ query, page: currentPage }),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('There was an error, please try again...');
    }
  }, [error]);

  function handleSearchSubmit(searchQuery: string) {
    setQuery(searchQuery);
    setCurrentPage(1);
  }

  function handleMovieSelect(movie: Movie) {
    setSelectedMovie(movie);
  }

  function handleModalClose() {
    setSelectedMovie(null);
  }

  function handlePageChange({ selected }: { selected: number }) {
    setCurrentPage(selected + 1);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && data && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={data.results} onSelect={handleMovieSelect} />
        </>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </div>
  );
}
