import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

// Отображает Модальное окно
export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    // обработка нажатия клавиши Escape
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // обработка клика по фону модального окна
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div 
      className={css.backdrop} 
      role="dialog" 
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img
          src={movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : 'https://via.placeholder.com/800x600?text=No+Image'
          }
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
