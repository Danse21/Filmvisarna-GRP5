export interface MovieCardDto {
  id: number;
  title: string;
  slug: string;
  age_limit: number;
  trailer_link: string;
  next_showtime: {
    start_time: string;
    showtime_id: number;
    screen_name: string;
  };
}