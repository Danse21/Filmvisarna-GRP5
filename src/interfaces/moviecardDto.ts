export interface MovieCardDto {
  id: number;
  title: string;
  slug: string;
  age_limit: number;
  trailer_link: string;

  showtime_id: number;
  start_time: string;

  screen_name?: string;
}