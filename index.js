var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var Interface = require("readline").Interface;
var axios = require("axios");
var getIAMToken = function (_a) {
    var oAuthToken = _a.oAuthToken;
    return __awaiter(_this, void 0, void 0, function () {
        var endpoint, response, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    endpoint = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post(endpoint, {
                            yandexPassportOauthToken: oAuthToken,
                        })];
                case 2:
                    response = _b.sent();
                    console.log(response.data.iamToken);
                    return [2 /*return*/, response.data.iamToken];
                case 3:
                    error_1 = _b.sent();
                    console.error("Ошибка при обмене OAuth-токена на IAM-токен:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var translator = function (_a) {
    var IAM_TOKEN = _a.IAM_TOKEN, folderId = _a.folderId, targetLanguage = _a.targetLanguage, word = _a.word;
    return __awaiter(_this, void 0, void 0, function () {
        var apiUrl, responseAPI, data, translatedWord, error_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    apiUrl = "https://translate.api.cloud.yandex.net/translate/v2/translate";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(IAM_TOKEN),
                            },
                            body: JSON.stringify({
                                targetLanguageCode: targetLanguage,
                                texts: word,
                                folderId: folderId,
                            }),
                        })];
                case 2:
                    responseAPI = _d.sent();
                    if (!responseAPI.ok) {
                        throw new Error("API responded with HTTP ".concat(responseAPI.status));
                    }
                    return [4 /*yield*/, responseAPI.json()];
                case 3:
                    data = _d.sent();
                    translatedWord = ((_c = (_b = data.translations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.text) || null;
                    if (!translatedWord)
                        return [2 /*return*/];
                    return [2 /*return*/, translatedWord];
                case 4:
                    error_2 = _d.sent();
                    console.error("Ошибка при обращении к API Яндекс.Переводчик", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
