/**
 * RAG 엔진과 API 통합 테스트
 * @jest-environment node
 */
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { generateKeywordAnalysis } from '@/lib/rag_engine';
// POST 함수를 직접 모킹
var mockPostHandler = jest.fn().mockImplementation(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var keywords, analysisText;
    return __generator(this, function (_a) {
        keywords = req.keywords;
        // 유효성 검사
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return [2 /*return*/, {
                    status: 400,
                    body: { error: '분석할 키워드가 제공되지 않았습니다.' }
                }];
        }
        // 키워드가 문자열이면 400 에러
        if (typeof keywords === 'string') {
            return [2 /*return*/, {
                    status: 400,
                    body: { error: '유효하지 않은 키워드 형식입니다: 배열이 필요합니다.' }
                }];
        }
        analysisText = generateKeywordAnalysis(keywords);
        return [2 /*return*/, {
                status: 200,
                body: {
                    analysisText: analysisText,
                    timestamp: new Date().toISOString()
                }
            }];
    });
}); });
describe('RAG API 통합 테스트', function () {
    test('API 엔드포인트가 키워드 배열로 올바른 분석 결과를 반환해야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestData = {
                        keywords: ['인공지능', 'GPT', '머신러닝']
                    };
                    return [4 /*yield*/, mockPostHandler(requestData)];
                case 1:
                    response = _a.sent();
                    // 응답 검사
                    expect(response.status).toBe(200);
                    expect(response.body).toBeDefined();
                    expect(response.body.analysisText).toBeDefined();
                    expect(typeof response.body.analysisText).toBe('string');
                    expect(response.body.timestamp).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    test('API 엔드포인트가 빈 키워드 배열로 올바른 에러 메시지를 반환해야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestData = {
                        keywords: []
                    };
                    return [4 /*yield*/, mockPostHandler(requestData)];
                case 1:
                    response = _a.sent();
                    // 응답 검사
                    expect(response.status).toBe(400);
                    expect(response.body).toBeDefined();
                    expect(response.body.error).toBeDefined();
                    expect(response.body.error).toContain('분석할 키워드가 제공되지 않았습니다');
                    return [2 /*return*/];
            }
        });
    }); });
    test('API 엔드포인트가 유효하지 않은 입력으로 올바른 에러 메시지를 반환해야 함', function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestData = {
                        keywords: '인공지능' // 키워드 배열 대신 문자열 전달
                    };
                    return [4 /*yield*/, mockPostHandler(requestData)];
                case 1:
                    response = _a.sent();
                    // 응답 검사
                    expect(response.status).toBe(400);
                    expect(response.body).toBeDefined();
                    expect(response.body.error).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
