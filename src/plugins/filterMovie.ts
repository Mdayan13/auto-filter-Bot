import { Movie } from "../db/fileSchema";

export const filterMovie = async (
  moviename: string,
  options?: {
    limit?: number;
    skip?: number;
    year?: number;
    genre?: string;
    language?: string;
    quality?: string;
    isSeries?: boolean;
    seriesNumber?: number;
  }
) => {
  const movies = await Movie.aggregate([
    {
      $search: {
        index: "movieSearch",
        compound: {
          should: [
            {
              text: {
                query: moviename,
                path: "fileName",
                fuzzy: { maxEdits: 2, maxExpansions: 10 },
              },
            },
            {
              text: {
                query: moviename,
                path: "fileName",
                score: { boost: { value: 5 } },
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        ...(options?.genre && { genre: options.genre }),
        ...(options?.year && { year: options.year }),
        ...(options?.language && { languages: options.language }),
        ...(options?.quality && { quality: options.quality }),
        ...(options?.isSeries && { isSeries: options.isSeries }),
        ...(options?.seriesNumber && { season: options.seriesNumber }),
      },
    },
    {
      $addFields: {
        score: { $meta: "searchScore" },
      },
    },
    {
      $sort: options?.isSeries
        ? { fileName: 1, season: 1, episode: 1 } // sort by series name + season + episode
        : { score: -1, year: -1 },
    },
    {
      $limit: options?.limit || 20,
    },
    {
      $project: {
        fileUniquId: 1,
        fileName: 1,
        isSeries: 1,
        quality: 1,
        season: 1,
        episode: 1,
        languages: 1,
        score: 1,
        year: 1,
      },
    },
  ]);
  console.log("return", movies);
  return movies;
};
