export interface MovieCardDto {
  title: string;
  slug: string;
  age_limit: number;
  trailer_link: string;
  description: string;
  year: number;
  length: string;
  genre: string;
  salon_name: string;
  showtimes: {
    start_time: string;
  }[];
}
