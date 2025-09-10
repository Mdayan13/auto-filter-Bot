import {  session } from "grammy";
import { Movie, } from "../schemas/fileSchema";
import { bot } from "..";

export const serchtheMovie = async (
  moviename: string,
  options?: { limit?: number; skip?: number; year?: number; genre?: string }
) => {
  await bot.use(
    session({
      initial() {
        return { movieName: undefined };
      },
    })
  );
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
                fuzzy: { maxEdits: 2 },
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
      },
    },
    {
      $addFields: {
        score: { $meta: "searchScore" },
      },
    },
    {
      $sort: {
        score: -1,
        year: -1,
      },
    },
    {
      $limit: options?.limit || 20,
    },
    {
      $project: {
        fileUniquId: 1,
        fileName: 1,
        score: 1,
      },
    },
  ]);
  console.log("return", movies);
  return movies;
};
