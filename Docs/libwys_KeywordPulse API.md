# 📑 OpenAPI 명세서 (KeywordPulse API)

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

