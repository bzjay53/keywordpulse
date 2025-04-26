# 텔레그램 알림 API 가이드

KeywordPulse 애플리케이션의 텔레그램 알림 관련 API에 대한 개발자 가이드입니다. 이 문서는 텔레그램을 통해 키워드 분석 결과 및 알림을 전송하는 방법을 설명합니다.

## 목차

1. [API 엔드포인트 개요](#1-api-엔드포인트-개요)
2. [텔레그램 테스트 메시지 API](#2-텔레그램-테스트-메시지-api)
3. [키워드 분석 알림 API](#3-키워드-분석-알림-api)
4. [RAG 기반 분석 알림 API](#4-rag-기반-분석-알림-api)
5. [기본 알림 API](#5-기본-알림-api)
6. [오류 처리](#6-오류-처리)
7. [메시지 포맷 가이드](#7-메시지-포맷-가이드)

## 1. API 엔드포인트 개요

KeywordPulse는 다음과 같은 텔레그램 관련 API 엔드포인트를 제공합니다:

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/notify/telegram/test` | POST | 텔레그램 설정 테스트를 위한 메시지 전송 |
| `/api/notify/telegram` | POST | 키워드 분석 결과 알림 전송 |
| `/api/notify/telegram/rag` | POST | RAG 기반 상세 분석 결과 전송 |
| `/api/notify` | POST | 환경 변수 기반 기본 알림 전송 |

## 2. 텔레그램 테스트 메시지 API

사용자의 텔레그램 설정(봇 토큰 및 채팅 ID)이 올바르게 구성되었는지 테스트하기 위한 API입니다.

### 엔드포인트

```
POST /api/notify/telegram/test
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| token | string | 필수 | 텔레그램 봇 토큰 |
| chat_id | string | 필수 | 텔레그램 채팅 ID |
| message | string | 필수 | 전송할 테스트 메시지 |

### 요청 예시

```json
{
  "token": "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "chat_id": "123456789",
  "message": "이것은 테스트 메시지입니다."
}
```

### 응답

#### 성공 (200 OK)

```json
{
  "success": true,
  "message": "테스트 메시지가 성공적으로 전송되었습니다.",
  "details": {
    "ok": true,
    "result": {
      "message_id": 123,
      "from": { "id": 1234567890, "is_bot": true, "first_name": "YourBot", "username": "your_bot" },
      "chat": { "id": 123456789, "first_name": "User", "type": "private" },
      "date": 1709532345,
      "text": "이것은 테스트 메시지입니다."
    }
  }
}
```

#### 실패 (400 Bad Request)

```json
{
  "error": "필수 파라미터가 누락되었습니다. (token, chat_id, message)"
}
```

#### 실패 (500 Internal Server Error)

```json
{
  "error": "텔레그램 API 오류: Bad Request: chat not found",
  "details": {
    "ok": false,
    "error_code": 400,
    "description": "Bad Request: chat not found"
  }
}
```

## 3. 키워드 분석 알림 API

키워드 분석 결과 또는 커스텀 메시지를 텔레그램으로 전송하는 API입니다.

### 엔드포인트

```
POST /api/notify/telegram
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| token | string | 필수 | 텔레그램 봇 토큰 |
| chat_id | string | 필수 | 텔레그램 채팅 ID |
| keyword | string | 조건부 | 분석된 키워드 (customMessage가 없는 경우 필수) |
| score | number | 선택 | 키워드 점수 (0-100) |
| trends | array | 선택 | 키워드 트렌드 정보 배열 |
| customMessage | string | 조건부 | 커스텀 메시지 (keyword가 없는 경우 필수) |

### 요청 예시 (키워드 분석)

```json
{
  "token": "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "chat_id": "123456789",
  "keyword": "인공지능",
  "score": 87,
  "trends": [
    {"period": "일주일", "change": 5},
    {"period": "한달", "change": -2},
    {"period": "3개월", "change": 12}
  ]
}
```

### 요청 예시 (커스텀 메시지)

```json
{
  "token": "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "chat_id": "123456789",
  "customMessage": "<b>중요 알림</b>\n\n키워드 분석이 완료되었습니다. 웹사이트에서 확인해주세요."
}
```

### 응답

#### 성공 (200 OK)

```json
{
  "success": true,
  "message": "알림이 성공적으로 전송되었습니다.",
  "details": {
    "message_id": 124,
    "date": 1709532400
  }
}
```

## 4. RAG 기반 분석 알림 API

RAG(Retrieval Augmented Generation) 시스템을 사용하여 키워드 분석 결과를 텔레그램으로 전송하는 API입니다.

### 엔드포인트

```
POST /api/notify/telegram/rag
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| token | string | 필수 | 텔레그램 봇 토큰 |
| chat_id | string | 필수 | 텔레그램 채팅 ID |
| keywords | array | 필수 | 키워드 데이터 배열 |
| templateType | string | 선택 | 템플릿 유형 ('basic', 'detailed', 'marketing', 기본값: 'detailed') |
| maxKeywords | number | 선택 | 포함할 최대 키워드 수 (기본값: 5) |
| scoreThreshold | number | 선택 | 최소 점수 임계값 (기본값: 60) |

### keywords 배열 내 객체 구조

| 속성 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| keyword | string | 필수 | 키워드 텍스트 |
| score | number | 필수 | 키워드 점수 (0-100) |
| monthlySearches | number | 선택 | 월간 검색량 |
| competitionRate | number | 선택 | 경쟁률 (0-1) |

### 요청 예시

```json
{
  "token": "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "chat_id": "123456789",
  "keywords": [
    { "keyword": "인공지능", "score": 87, "monthlySearches": 12500, "competitionRate": 0.75 },
    { "keyword": "머신러닝", "score": 82, "monthlySearches": 8300, "competitionRate": 0.65 },
    { "keyword": "딥러닝", "score": 78, "monthlySearches": 6200, "competitionRate": 0.55 },
    { "keyword": "자연어처리", "score": 73, "monthlySearches": 4100, "competitionRate": 0.48 },
    { "keyword": "컴퓨터비전", "score": 69, "monthlySearches": 3700, "competitionRate": 0.45 }
  ],
  "templateType": "marketing",
  "maxKeywords": 3,
  "scoreThreshold": 75
}
```

### 응답

#### 성공 (200 OK)

```json
{
  "success": true,
  "message": "RAG 분석 결과가 성공적으로 전송되었습니다.",
  "keywordCount": 3,
  "templateType": "marketing",
  "details": {
    "message_id": 125,
    "date": 1709532500
  }
}
```

## 5. 기본 알림 API

환경 변수에 설정된 텔레그램 봇 토큰과 채팅 ID를 사용하여 알림을 전송하는 API입니다.

### 엔드포인트

```
POST /api/notify
```

### 환경 변수 설정

이 API를 사용하려면 서버에 다음 환경 변수가 설정되어 있어야 합니다:
- `TELEGRAM_BOT_TOKEN`: 텔레그램 봇 토큰
- `TELEGRAM_CHAT_ID`: 텔레그램 채팅 ID

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| analysisText | string | 필수 | 전송할 분석 텍스트 |
| format | string | 선택 | 포맷 유형 ('markdown', 'html', 기본값: 'html') |
| parseMode | string | 선택 | 텔레그램 파싱 모드 ('HTML', 'Markdown', 'MarkdownV2', 기본값: 'HTML') |
| disablePreview | boolean | 선택 | 웹 페이지 미리보기 비활성화 여부 |

### 요청 예시

```json
{
  "analysisText": "**키워드 분석 결과**\n\n키워드: 인공지능\n점수: 87\n\n*상세 내용은 웹사이트에서 확인하세요.*",
  "format": "markdown",
  "disablePreview": true
}
```

### 응답

#### 성공 (200 OK)

```json
{
  "success": true,
  "messageId": "126"
}
```

#### 실패 (500 Internal Server Error)

```json
{
  "success": false,
  "error": "TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다."
}
```

## 6. 오류 처리

모든 API 호출은 다음과 같은, 공통적인 오류 응답 형식을 가집니다:

```json
{
  "error": "오류 메시지",
  "details": { /* 추가 오류 정보 (옵션) */ }
}
```

### 일반적인 오류 코드

| HTTP 상태 코드 | 설명 |
|--------------|------|
| 400 | 잘못된 요청 (필수 파라미터 누락, 잘못된 형식 등) |
| 500 | 서버 오류 (텔레그램 API 통신 실패, 내부 오류 등) |

## 7. 메시지 포맷 가이드

### HTML 형식 태그

텔레그램 메시지에서 지원하는 HTML 형식 태그:

- `<b>...</b>`: 굵은 텍스트
- `<i>...</i>`: 기울임꼴 텍스트
- `<code>...</code>`: 고정폭 텍스트
- `<pre>...</pre>`: 형식이 지정된 고정폭 텍스트 블록
- `<a href="...">...</a>`: 링크
- `<s>...</s>`: 취소선
- `<u>...</u>`: 밑줄

### 마크다운 형식 사용 시 주의사항

마크다운 형식을 사용할 때는 다음 문자를 이스케이프 처리해야 합니다:
`_`, `*`, `[`, `]`, `(`, `)`, `~`, `` ` ``, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!`

예: `\*텍스트\*` -> `*텍스트*`

### 이모지 사용

이모지는 메시지에 직접 포함하거나 Unicode 포인트를 사용하여 포함할 수 있습니다:

- 📊 - 차트
- 📈 - 상승 차트
- 📉 - 하락 차트
- 🔍 - 검색
- ⚠️ - 경고
- ✅ - 확인
- ❌ - 오류 