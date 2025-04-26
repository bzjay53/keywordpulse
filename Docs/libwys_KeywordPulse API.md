# 📑 OpenAPI 명세서 (KeywordPulse API)

## 목차
1. [인증](#인증)
2. [검색 API](#검색-api)
3. [분석 API](#분석-api)
4. [트렌드 API](#트렌드-api)
   - [트렌딩 키워드 API](#트렌딩-키워드-api)
   - [관련 키워드 API](#관련-키워드-api)
   - [키워드 트렌드 API](#키워드-트렌드-api)
5. [동기화 API](#동기화-api)
6. [알림 API](#알림-api)
7. [오류 코드](#오류-코드)
8. [제한 사항](#제한-사항)

## 인증

대부분의 API 엔드포인트는 인증 없이 제한된 사용이 가능하지만, 완전한 기능을 위해서는 사용자 인증이 필요합니다.

### JWT 인증
```
Authorization: Bearer {JWT_TOKEN}
```

JWT 토큰은 로그인 성공 시 발급되며, 토큰의 유효 기간은 24시간입니다. 만료 시 재로그인이 필요합니다.

## 검색 API

키워드 검색 및 관련 키워드 정보를 제공합니다.

### 요청

```
POST /api/search
Content-Type: application/json

{
  "keyword": "AI 마케팅"
}
```

### 응답

```json
{
  "keywords": [
    {
      "keyword": "AI 마케팅 전략",
      "monthlySearches": 32500,
      "competitionRate": 0.42,
      "score": 87,
      "recommendation": "강력 추천"
    },
    {
      "keyword": "마케팅 자동화 AI",
      "monthlySearches": 28700,
      "competitionRate": 0.35,
      "score": 82,
      "recommendation": "강력 추천"
    },
    // ... 추가 키워드
  ],
  "cached": false
}
```

## 분석 API

키워드 배열을 입력받아 RAG 기반의 분석 텍스트를 생성합니다.

### 요청

```
POST /api/analyze
Content-Type: application/json

{
  "keywords": ["AI 마케팅", "콘텐츠 전략", "자동화 툴"]
}
```

### 응답

```json
{
  "analysisText": "## 키워드 분석 결과\n\n이번 분석된 키워드 중 **'AI 마케팅'**이 가장 높은 추천 점수인 87점을 기록했습니다...",
  "timestamp": "2023-05-10T14:30:00Z"
}
```

## 트렌드 API

### 트렌딩 키워드 API

특정 카테고리의 트렌딩 키워드를 반환합니다.

#### 요청

```
GET /api/trending?category=all&count=10&geo=KR
```

#### 매개변수

- `category` (선택): 키워드 카테고리 ('all', 'business', 'technology', 'entertainment', 'health')
- `count` (선택): 반환할 키워드 수 (기본값: 10)
- `geo` (선택): 지역 코드 (기본값: 'KR')

#### 응답

```json
{
  "keywords": [
    {
      "keyword": "AI 생성 모델",
      "count": 342,
      "change": 45
    },
    {
      "keyword": "디지털 마케팅",
      "count": 298,
      "change": 20
    },
    // ... 추가 키워드
  ],
  "metadata": {
    "category": "all",
    "count": 10,
    "geo": "KR",
    "timestamp": "2023-05-25T09:30:00Z"
  }
}
```

### 관련 키워드 API

입력 키워드와 관련된 검색어 목록을 반환합니다.

#### 요청

```
GET /api/related?keyword=MCP 블렌더&count=10&geo=KR
```

#### 매개변수

- `keyword` (필수): 검색 키워드
- `count` (선택): 반환할 관련 키워드 수 (기본값: 10)
- `geo` (선택): 지역 코드 (기본값: 'KR')

#### 응답

```json
{
  "keyword": "MCP 블렌더",
  "relatedKeywords": [
    "MCP 블렌더 튜토리얼",
    "MCP 블렌더 다운로드",
    "Blender MCP 설치 방법",
    "MCP 블렌더 윈도우 11",
    "Claude AI 블렌더 연동",
    // ... 추가 관련 키워드
  ],
  "metadata": {
    "count": 10,
    "geo": "KR",
    "timestamp": "2023-05-25T09:35:00Z"
  }
}
```

### 키워드 트렌드 API

키워드의 시간에 따른 검색량 추이 데이터를 제공합니다.

#### 요청

```
GET /api/trend?keyword=AI 마케팅&timeRange=month&geo=KR
```

#### 매개변수

- `keyword` (필수): 검색 키워드
- `timeRange` (선택): 시간 범위 ('day', 'week', 'month', 'year') (기본값: 'month')
- `geo` (선택): 지역 코드 (기본값: 'KR')

#### 응답

```json
{
  "keyword": "AI 마케팅",
  "trendData": [
    {
      "date": "2023-04-25",
      "value": 42
    },
    {
      "date": "2023-04-26",
      "value": 45
    },
    // ... 추가 날짜별 데이터
  ],
  "metadata": {
    "timeRange": "month",
    "dataPointsCount": 30,
    "geo": "KR",
    "timestamp": "2023-05-25T09:40:00Z"
  }
}
```

## 동기화 API

키워드 분석 결과를 Google Sheets에 저장합니다.

### 요청

```
POST /api/sync
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "keywords": [
    {
      "keyword": "AI 마케팅",
      "monthlySearches": 32500,
      "competitionRate": 0.42,
      "score": 87
    },
    // ... 추가 키워드
  ],
  "timestamp": "2023-05-10T14:30:00Z"
}
```

### 응답

```json
{
  "success": true,
  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1a2b3c...",
  "timestamp": "2023-05-10T14:30:05Z"
}
```

## 알림 API

분석 결과를 Telegram으로 전송합니다.

### 요청

```
POST /api/notify
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "analysisText": "## 키워드 분석 결과\n\n이번 분석된 키워드 중 **'AI 마케팅'**이 가장 높은 추천 점수인 87점을 기록했습니다..."
}
```

### 응답

```json
{
  "success": true,
  "messageId": "12345",
  "timestamp": "2023-05-10T14:30:10Z"
}
```

## 오류 코드

모든 API는 다음과 같은 공통 오류 코드를 사용합니다:

| 상태 코드 | 설명 |
|----------|-----|
| 400 | 잘못된 요청 (파라미터 누락 또는 형식 오류) |
| 401 | 인증 필요 또는 권한 없음 |
| 403 | 접근 권한 없음 |
| 404 | 리소스를 찾을 수 없음 |
| 429 | 요청 한도 초과 |
| 500 | 서버 내부 오류 |

## 제한 사항

- 비로그인 사용자: 일일 5회의 검색 제한
- 로그인 사용자: 일일 50회의 검색 제한
- 동기화 및 알림 API는 로그인 사용자만 사용 가능
- 일부 API는 응답 결과 캐싱을 적용하여 1시간 동안 동일한 요청에 대해 캐시된 결과 제공

```yaml
openapi: 3.0.4
info:
  title: "KeywordPulse API"
  version: "1.0.0"
  description: |
    서버리스 환경에서 실시간 키워드 분석 서비스를 제공하기 위한 RESTful API 명세입니다.  
    Vercel Python Serverless Functions로 구현됩니다.  
  termsOfService: "https://keywordpulse.example.com/terms"
  contact:
    name: "지원팀"
    email: "support@keywordpulse.example.com"
servers:
  - url: "https://keywordpulse.vercel.app/api"
    description: "Production Vercel Serverless API"
paths:
  /search:
    post:
      summary: "키워드 검색 및 점수화"
      operationId: "searchKeywords"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SearchRequest'
      responses:
        '200':
          description: "검색 결과 성공"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SearchResponse'
        '400': { description: "잘못된 요청" }
        '500': { description: "서버 오류" }
  /analyze:
    post:
      summary: "RAG 기반 분석 텍스트 생성"
      operationId: "generateAnalysis"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyzeRequest'
      responses:
        '200':
          description: "분석 성공"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyzeResponse'
        '400': { description: "잘못된 요청" }
        '500': { description: "서버 오류" }
  /sync:
    post:
      summary: "Google Sheets 동기화"
      operationId: "syncToSheets"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SyncRequest'
      responses:
        '200':
          description: "동기화 성공"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SyncResponse'
        '401': { description: "인증 오류" }
        '500': { description: "서버 오류" }
  /notify:
    post:
      summary: "Telegram 알림 전송"
      operationId: "sendNotification"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NotifyRequest'
      responses:
        '200':
          description: "전송 성공"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NotifyResponse'
        '401': { description: "인증 오류" }
        '500': { description: "서버 오류" }
components:
  schemas:
    SearchRequest:
      type: object
      required: ["keyword"]
      properties:
        keyword:
          type: string
          description: "분석할 키워드 문자열"
          example: "AI 마케팅"
    KeywordInfo:
      type: object
      properties:
        keyword:
          type: string
        monthlySearches:
          type: integer
        competitionRate:
          type: number
          format: float
        score:
          type: integer
        recommendation:
          type: string
    SearchResponse:
      type: object
      properties:
        keywords:
          type: array
          items:
            $ref: '#/components/schemas/KeywordInfo'
        cached:
          type: boolean
          description: "캐시 사용 여부"
    AnalyzeRequest:
      type: object
      required: ["keywords"]
      properties:
        keywords:
          type: array
          items:
            type: string
    AnalyzeResponse:
      type: object
      properties:
        analysisText:
          type: string
          description: "RAG 기반 분석 결과 텍스트"
    SyncRequest:
      type: object
      required: ["keywords", "timestamp"]
      properties:
        keywords:
          type: array
          items:
            $ref: '#/components/schemas/KeywordInfo'
        timestamp:
          type: string
          format: date-time
    SyncResponse:
      type: object
      properties:
        success:
          type: boolean
        spreadsheetUrl:
          type: string
    NotifyRequest:
      type: object
      required: ["analysisText"]
      properties:
        analysisText:
          type: string
    NotifyResponse:
      type: object
      properties:
        success:
          type: boolean
        messageId:
          type: string
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
security:
  - ApiKeyAuth: []
```  

> **요약**: 위 명세는 OpenAPI 3.0 기반으로 KeywordPulse의 핵심 API 경로, 요청/응답 형태, 보안 스키마까지 포함합니다.

---

> **참고**:
> - OpenAPI 기본 구조 가이드 ([swagger.io](https://swagger.io/docs/specification/v3_0/basic-structure/?utm_source=chatgpt.com))
> - 예제 스펙 템플릿 ([github.com](https://github.com/Redocly/openapi-template/blob/gh-pages/openapi.yaml?utm_source=chatgpt.com))
> - FastAPI 자동 문서화 활용 ([fastapi.tiangolo.com](https://fastapi.tiangolo.com/tutorial/first-steps/?utm_source=chatgpt.com), [fastapi.tiangolo.com](https://fastapi.tiangolo.com/reference/openapi/docs/?utm_source=chatgpt.com))
> - 예시 및 예제 추가 방법 ([swagger.io](https://swagger.io/docs/specification/v3_0/adding-examples/?utm_source=chatgpt.com))
> - OpenAPI 3.0 공식 사양 ([swagger.io](https://swagger.io/specification/?utm_source=chatgpt.com))

