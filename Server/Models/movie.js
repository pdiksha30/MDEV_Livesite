"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
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
let Movie = (0, mongoose_1.model)('Movie', movieSchema);
exports.default = Movie;
//# sourceMappingURL=movie.js.map