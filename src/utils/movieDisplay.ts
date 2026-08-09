interface MovieNames {
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
}

interface MovieRating {
  rating?: string | number;
  ratingKinopoisk?: number;
}

export const primaryTitle = (film: MovieNames): string =>
  film.nameRu || film.nameEn || film.nameOriginal || "Без названия";

export const subtitleTitle = (film: MovieNames): string | null => {
  const primary = primaryTitle(film);

  if (film.nameEn && film.nameEn !== primary) {
    return film.nameEn;
  }

  if (film.nameOriginal && film.nameOriginal !== primary) {
    return film.nameOriginal;
  }

  return null;
};

export const filmRating = (film: MovieRating): string | number | null =>
  film.rating ?? film.ratingKinopoisk ?? null;

export const filmId = (film: {
  filmId?: number;
  kinopoiskId?: number;
}): number => film.filmId ?? film.kinopoiskId ?? 0;

export const truncateText = (text: string | undefined, limit = 120): string => {
  if (!text) {
    return "";
  }

  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim()}…`;
};
