import jwt from "jsonwebtoken";
import User from "../models/users";
import sendEmail from "../utils/email";

export const register = async (req, res) => {
  try {
    const existEmail = await User.findOne({ email: req.body.email }).exec();
    if (existEmail) return res.status(500).json("Email này đã tồn tại");
    const newUser = await User(req.body).save();
    const accessToken = jwt.sign(
      newUser.toJSON(),
      process.env.ACCESS_TOKEN_SECRET
    );
    const message = `Đăng ký thành công, vui lòng truy cập vào đường link dưới đây để xác thực tài khoản: 
    `;
    await sendEmail(
      newUser.email,
      "Xác nhận tài khoản",
      message,
      `${process.env.CLIENT_URL_ONLINE}/verify?token=${accessToken}`
    );
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json("Đăng ký thất bại", error);
  }
};

export const login = async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email }).exec();
    if (!existUser)
      return res.status(400).json("Email bạn nhập không chính xác");
    if (!existUser.passwordAuthenticate(req.body.password))
      return res.status(400).json("Mật khẩu bạn nhập không chính xác");
    if (existUser.status != 1)
      return res
        .status(400)
        .json("Tài khoản này chưa kích hoạt hoặc đã bị khóa");
    // 👉 Convert về object thuần
    const userObject = existUser.toObject();

    // 👉 Xóa những trường nhạy cảm
    delete userObject.password;
    delete userObject.phone;
    delete userObject.salt;

    // 👉 Tạo access token từ object đã xóa thông tin
    const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({ accessToken, user: userObject  });
  } catch (error) {
    console.log(error);
    res.status(400).json("Đăng nhập thất bại");
  }
};
export const list = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json("Lấy danh sách thất bại");
  }
};
export const read = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).exec();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Lấy danh sách thất bại");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (req.body.oldPassword) {
      if (!user.passwordAuthenticate(req.body.oldPassword))
        return res.status(400).json("Mật khẩu cũ của bạn nhập không đúng");
    }
    if (user.passwordAuthenticate(req.body.newPassword))
      return res
        .status(400)
        .json("Mật khẩu mới không được trùng với mật khẩu cũ");
    const hashPassword = user.passwordEncode(req.body.newPassword);
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hashPassword },
      { new: true }
    ).exec();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Đổi mật khẩu thất bại");
  }
};

export const update = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id ?? req.user._id },
      req.body,
      { new: true }
    ).exec();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Lấy danh sách thất bại", error);
  }
};

export const remove = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id }).exec();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Lấy danh sách thất bại");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existUser = await User.findOne({ email: email }).exec();
    const accessToken = jwt.sign(
      existUser.toJSON(),
      process.env.ACCESS_TOKEN_SECRET
    );
    const message = `Chào ${email}, vui lòng truy cập vào đường link dưới đây để đặt lại mật khẩu `;
    await sendEmail(
      email,
      "Reset Account Password",
      message,
      `${process.env.CLIENT_URL_ONLINE}/reset-password?token=${accessToken}`
    );
    res.status(200).json({ email, accessToken });
  } catch (error) {
    res.status(400).json(`Có lỗi xảy ra, vui lòng thử lại sau`);
  }
};
