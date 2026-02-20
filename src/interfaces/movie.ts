export default interface Movie {
  movie_id: number;
  title: string;
  genre: string;
  duration_minutes: number;
  description: string;
  age_limit: number;
  image_url: string;
  imdb_link: string;
  rottentomatoes_link: string;
  slug: string;
  trailer_link: string;
}
