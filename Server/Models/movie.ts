import { Schema,  model } from 'mongoose';

interface IMovie
{
  id: string,
  title: string,
  studio: string,
  genre: string[],
  director: string[],
  writers: string[],
  actors: string[],
  year: number,
  runningTime: number,
  briefDescription: string,
  mpaRating: string,
  posterLink: string,
  criticsRating: number
}

const movieSchema = new Schema<IMovie>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  studio: { type: String, required: true },
  genre: { type: [String], required: true },
  director: { type: [String], required: true },
  writers: { type: [String], required: true },
  actors: { type: [String], required: true },
  year: { type: Number, required: true },
  runningTime: { type: Number, required: true },
  briefDescription: { type: String, required: true },
  mpaRating: { type: String, required: true },
  posterLink: { type: String, required: true },
  criticsRating: { type: Number, required: true },
  });

let Movie = model<IMovie>('Movie', movieSchema);

export default Movie;