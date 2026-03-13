import type { JSX } from "react";
import { createElement } from "react";
// page components

import AiChatPage from "./pages/AiChatPage.tsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import StartPage from "./pages/StartPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import BookingSummaryPage from "./pages/BookingSummaryPage.tsx";
import snackspage from "./pages/SnacksPage.tsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.tsx";
import MoviesPage from "./pages/MoviesPage.tsx";
import CancelBookingPage from "./pages/CancelBookingPage.tsx";
import SuccessfulCancellationPage from "./pages/SuccessfulCancellationPage.tsx";
import UnsuccessfulCancellationPage from "./pages/UnsuccessfulCancellationPage.tsx";

interface Route {
  element: JSX.Element;
  path: string;
  loader?: Function;
  menuLabel?: string;
  index?: number;
  parent?: string;
}

export default [
  AiChatPage,
  MovieDetailsPage,
  NotFoundPage,
  StartPage,
  MenuPage,
  SearchPage,
  LoginPage,
  BookingPage,
  BookingSummaryPage,
  BookingConfirmationPage,
  snackspage,
  MoviesPage,
  CancelBookingPage,
  SuccessfulCancellationPage,
  UnsuccessfulCancellationPage,
]
  // map the route property of each page component to a Route,
  // that is converts each element so that each appears as StartPage.route, for example
  .map((x) => ({ element: createElement(x), ...x.route }) as Route)
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));
