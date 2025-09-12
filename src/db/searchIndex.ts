import mongoose from "mongoose";
import { Movie } from "./fileSchema";
export const searchIndexex = async () => {
  try {
    const colection = Movie.collection;
    const indexes = await colection.listSearchIndexes().toArray();
    const exist = indexes.some((i) => i.name === "movieSearch");
    if (!exist) {
      console.log(
        `creating the serach index as it's not awalible in list ${exist}`
      );
      await colection.createSearchIndex({
        name: "movieSearch",
        definition: {
          mappings: {
            dynamic: false,
            fields: {
              fileName: { type: "string" },
            },
          },
        },
      });
    } else {
      console.log(`search index already exist in database: ${indexes[0].name}`);
    }
} catch (error: any) {
      throw new Error(`search index already exist in database: ${error.message}`)

  }
};
