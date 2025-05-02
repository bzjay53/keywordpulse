var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import React, { useState } from 'react';
import { StarRating } from './StarRating';
import analytics from '@/lib/analytics';
export var FeedbackForm = function (_a) {
    var onSubmit = _a.onSubmit, onClose = _a.onClose, _b = _a.initialRating, initialRating = _b === void 0 ? 0 : _b, _c = _a.contextData, contextData = _c === void 0 ? {} : _c, _d = _a.compact, compact = _d === void 0 ? false : _d;
    var _e = useState(initialRating), rating = _e[0], setRating = _e[1];
    var _f = useState(''), feedback = _f[0], setFeedback = _f[1];
    var _g = useState(false), submitting = _g[0], setSubmitting = _g[1];
    var _h = useState(false), submitted = _h[0], setSubmitted = _h[1];
    var _j = useState(null), error = _j[0], setError = _j[1];
    // 분석 이벤트: 별점 변경
    var handleRatingChange = function (newRating) {
        setRating(newRating);
        analytics.logEvent({
            eventType: analytics.EventType.FEATURE_USAGE,
            category: 'feedback',
            action: 'rating_changed',
            value: newRating
        });
    };
    var getCurrentContext = function () {
        return __assign({ url: window.location.href, path: window.location.pathname, referrer: document.referrer }, contextData);
    };
    var getBrowserInfo = function () {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenSize: "".concat(window.screen.width, "x").concat(window.screen.height)
        };
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var feedbackData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (rating === 0) {
                        setError('평점을 선택해주세요');
                        return [2 /*return*/];
                    }
                    if (!feedback.trim()) {
                        setError('피드백 내용을 입력해주세요');
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    feedbackData = {
                        rating: rating,
                        feedback: feedback,
                        context: getCurrentContext(),
                        timestamp: new Date().toISOString(),
                        browser: JSON.stringify(getBrowserInfo()),
                        platform: navigator.platform
                    };
                    // 분석 이벤트: 피드백 제출
                    analytics.logEvent({
                        eventType: analytics.EventType.FEEDBACK,
                        value: rating,
                        label: feedback,
                        metadata: {
                            context: getCurrentContext(),
                            formType: compact ? 'compact' : 'full'
                        }
                    });
                    if (!onSubmit) return [3 /*break*/, 3];
                    return [4 /*yield*/, onSubmit(feedbackData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    // 기본 제출 로직 (개발용)
                    console.log('피드백 데이터:', feedbackData);
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 4:
                    _a.sent(); // 제출 지연 시뮬레이션
                    _a.label = 5;
                case 5:
                    setSubmitted(true);
                    setTimeout(function () {
                        if (onClose) {
                            onClose();
                        }
                    }, 2000);
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    setError('피드백 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    console.error('피드백 제출 오류:', err_1);
                    // 분석 이벤트: 피드백 제출 실패
                    analytics.logError('피드백 제출 실패', 'FEEDBACK_SUBMIT_ERROR', {
                        errorDetails: err_1 instanceof Error ? err_1.message : '알 수 없는 오류'
                    });
                    return [3 /*break*/, 8];
                case 7:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    if (submitted) {
        return (<div className="feedback-form-success">
        <div className="success-icon">✓</div>
        <h3>피드백이 성공적으로 제출되었습니다!</h3>
        <p>소중한 의견 감사합니다.</p>
      </div>);
    }
    return (<form onSubmit={handleSubmit} className={"feedback-form ".concat(compact ? 'compact' : '')}>
      <div className="feedback-header">
        <h3>{compact ? '간편 피드백' : '서비스 개선을 위한 피드백'}</h3>
        {onClose && (<button type="button" className="close-button" onClick={function () {
                onClose();
                // 분석 이벤트: 피드백 폼 닫기
                analytics.logButtonClick('feedback_form_close', 'feedback', {
                    feedbackEntered: !!feedback.trim(),
                    ratingSelected: rating > 0
                });
            }}>
            ✕
          </button>)}
      </div>
      
      <div className="rating-container">
        <label>이 페이지가 얼마나 유용했나요?</label>
        <StarRating value={rating} onChange={handleRatingChange} size={compact ? 'small' : 'medium'}/>
      </div>
      
      <div className="feedback-input-container">
        <label htmlFor="feedback-text">개선을 위한 의견을 알려주세요</label>
        <textarea id="feedback-text" value={feedback} onChange={function (e) { return setFeedback(e.target.value); }} placeholder="서비스를 개선하는데 도움이 될 의견을 알려주세요" rows={compact ? 3 : 5} onFocus={function () {
            // 분석 이벤트: 피드백 입력 시작
            analytics.logFeatureUsage('feedback', 'text_focus');
        }}/>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="feedback-actions">
        {onClose && !compact && (<button type="button" className="cancel-button" onClick={function () {
                onClose();
                // 분석 이벤트: 피드백 취소
                analytics.logButtonClick('feedback_form_cancel', 'feedback', {
                    feedbackEntered: !!feedback.trim(),
                    ratingSelected: rating > 0
                });
            }} disabled={submitting}>
            취소
          </button>)}
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? '제출 중...' : '의견 제출하기'}
        </button>
      </div>
      
      <div className="feedback-privacy-notice">
        제출된 피드백은 서비스 개선을 위해서만 사용됩니다.
      </div>
    </form>);
};
