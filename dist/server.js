"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = 8080;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// import routes
const loginRoute_1 = __importDefault(require("./routes/auth/loginRoute"));
const registerRoute_1 = __importDefault(require("./routes/auth/registerRoute"));
const verify_code_1 = __importDefault(require("./routes/auth/verify-code"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
// routes
app.use("/auth/register", registerRoute_1.default);
app.use("/auth/verify-code", verify_code_1.default);
app.use("/auth/login", loginRoute_1.default);
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON syntax. Please check the format of the data.",
    });
  }
  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});
const startFn = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield (0, dbConfig_1.default)();
      app.listen(PORT, () => console.log("Running on http://localhost:8080"));
    } catch (error) {
      console.error(error);
    }
  });
startFn();
