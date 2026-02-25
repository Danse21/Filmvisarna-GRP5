export interface MovieCardDto {
  title: string;
  slug: string;
  age_limit: number;
  trailer_link: string;
  description: string;
  year: number;
  length: string;
  genre: string;
  screen_name: string;
  showtime: {
    start_time: string;
    showtime_id: number;
    screen_id: number;
  }[];
}
