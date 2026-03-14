export default async function moviesOfTheDayLoader({ params }: any) {
  const url = `/api/movie/moviestoday?date=${params.date}`;
  const res = await fetch(url);

  const text = await res.text(); // fånga rått svar
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text);

  if (!res.ok) {
    throw new Error(`Failed to load movies: ${res.status}`);
  }

  return JSON.parse(text);
}

/*export default async function moviesOfTheDayLoader({ params }: any) {

  const res = await fetch(`/api/movie/moviestoday?date=${params.date}`);

  if (!res.ok) {
    throw new Error("Failed to load movies");
  }

  return res.json();
}*/