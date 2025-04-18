import MovieType from "../models/movieType";
import Movie from "../models/movie";

export const create = async (req, res) => {
  try {
    const movieTypes = req.body;
    const exitMovieType = await MovieType.findOne({ name: req.body.name, }).exec();
    
    if (movieTypes.length > 0 && movieTypes.length !== undefined) {
      const exits = await MovieType.find({}).exec();
      for (const allItem of exits) {
        for (const req of movieTypes) {
         if(allItem.imdbId == req.imdbId){
          return res.status(500).json("Thể loại phim đã tồn tại");
         }
        }
      }
    } else {
      if (exitMovieType) {
        return res.status(500).json("Thể loại phim đã tồn tại");
      }
    }
    const movieType = await MovieType.insertMany(movieTypes);

    res.json(movieType);
  } catch (error) {
    res.status(400).json({
      message: "don't create",
      error,
    });
  }
};

export const read = async (req, res) => {
  try {
    const movieType = await MovieType.findOne({ _id: req.params.id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(movieType);
  } catch (error) {
    res.status(400).json({
      message: "don't find",
    });
  }
};

export const list = async (req, res) => {
  try {
    const movieType = await MovieType.find({}).exec();
    res.json(movieType);
  } catch (error) {
    res.status(400).json({
      message: "don't find",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const movieType = await MovieType.findOneAndDelete({
      _id: req.params.id,
    }).exec();
    res.json(movieType);
  } catch (error) {
    res.status(400).json({
      message: "don't find",
    });
  }
};

export const update = async (req, res) => {
  try {
    const movieType = await MovieType.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec();
    res.json(movieType);
  } catch (error) {
    res.status(400).json({
      message: "don't find",
    });
  }
};

export const readMovieOfMovieType = async (req, res) => {
  try {
    const movieTypeId = await MovieType.findById({ _id: req.params.id }).exec();
    const movies = await Movie.find({ movieTypeId })
      .select("-movieTypeId")
      .exec();
    return res.status(200).json({
      movieTypeId,
      movies,
    });
  } catch (error) {
    return res.status(400).json({
      message: "don't find",
    });
  }
};

export const searchByGenre = async (req, res) => {
  try {
    const searchString = req.query.q ? req.query.q : "";
    const result = await MovieType.find({
      name: new RegExp(searchString, "i"),
    }).exec();
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: `don't find, ${error}`,
    });
  }
};

export const getNameById = async (req, res) => {
  try {
    const name = await MovieType.findOne({ _id: req.params.id }).exec();
    res.status(200).json({
      name: name.name,
    });
  } catch (error) {
    res.status(400).json({
      message: `don't find, ${error}`,
    });
  }
};
