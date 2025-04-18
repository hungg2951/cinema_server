import ShowTime from "../models/showTime";
import Movie from "../models/movie";
const moment = require("moment");

export const create = async (req, res) => {
  try {
    const { startAt, endAt, roomId } = req.body;

    const existShowTime = await ShowTime.find({
      $or: [
        {
          startAt: { $lt: endAt },
          endAt: { $gt: startAt },
        },
      ],
      roomId: { $in: roomId },
    })
      .populate("roomId")
      .populate("movieId")
      .exec();

    if (existShowTime.length)
      return res.status(400).json({
        message:
          "Khung giờ hoặc phòng chiếu của phim đang bị trùng, vui lòng chọn khung giờ khác.",
        existShowTime,
      });

    const showTime = await new ShowTime(req.body).save();
    return res.json(showTime);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Không thể tạo suất chiếu." });
  }
};

export const list = async (req, res) => {
  try {
    const showTimes = await ShowTime.find({})
      .populate("movieId")
      .populate({ path: "roomId", populate: { path: "formatId" } })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(showTimes);
  } catch (error) {
    return res.status(400).json({
      message: "Don't find all!",
    });
  }
};

export const read = async (req, res) => {
  const filter = { _id: req.params.id };
  try {
    const showTime = await ShowTime.findOne(filter)
      .populate("movieId")
      .populate({ path: "roomId", populate: { path: "formatId" } })
      .exec();
    return res.status(200).json(showTime);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Don't find one!",
    });
  }
};

export const update = async (req, res) => {
  const filter = { _id: req.params.id };
  const doc = req.body;
  const option = { new: true };
  try {
    // const movie = await Movie.findOne({ _id: req.body.movieId }).exec();
    // req.body.startAt = new Date(req.body.startAt);
    // req.body.endAt = new Date(req.body.startAt.getTime() + movie.runTime * 3600 * 1000);
    const showTime = await ShowTime.findOneAndUpdate(
      filter,
      doc,
      option
    ).exec();
    return res.status(200).json(showTime);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Don't update",
    });
  }
};

export const remove = async (req, res) => {
  const filter = { _id: req.params.id };
  try {
    const showTime = await ShowTime.findOneAndDelete(filter).exec();
    return res.status(200).json({
      message: "Delete Success!",
      showTime,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Don't remove!",
    });
  }
};

export const getShowTimeByDate = async (req, res) => {
  try {
    // Bắt đầu từ hôm nay
    const startOfToday = moment().startOf("day").toDate();
    // Kết thúc sau 2 ngày nữa (hôm nay + 2 ngày => 3 ngày)
    const endOfThirdDay = moment().add(2, "days").endOf("day").toDate();

    const showTimesByMovieId = await ShowTime.find(
      {
        movieId: req.params.id,
        startAt: { $gte: startOfToday, $lte: endOfThirdDay }, // Trong khoảng 3 ngày
      },
      "-movieTypeId"
    )
      .populate({
        path: "movieId",
        select: "name _id",
      })
      .populate({
        path: "roomId",
        populate:{
            path:"formatId",
            select:"name"
        }
      })
      .exec();

    if (Array.isArray(showTimesByMovieId) && showTimesByMovieId.length > 0) {
      return res.status(200).json(showTimesByMovieId);
    } else {
      return res.status(400).json({
        message: "Không có dữ liệu",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Không có dữ liệu",
    });
  }
};
