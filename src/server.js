import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import cors from "cors";

const options = {
  origin: "https://wetube-byungwoo.herokuapp.com",
  credentials: true,
  optionsSuccessSatus: 200,
};

const app = express();
const logger = morgan("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
// app.use(express.text()); string으로 변환해서 req.body에 제공 하나의 데이터만 할때 괜찮음.
app.use(cors(options));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET, // 쿠키에 sign할 때 쓰는 암호같은거?
    resave: false,
    saveUninitialized: false, // 로그인한 유저들만 세션을 받게 해줌
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });
app.use(flash());
app.use(localsMiddleware);
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));

export default app;
//jGY4i0Jqnn8kOz9SZHtw-ZIfOXtUGwkm
