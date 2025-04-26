# 텔레그램 알림 API 가이드

## 1. 개요

KeywordPulse는 텔레그램을 통해 키워드 분석 결과 및 알림을 전송하는 기능을 제공합니다. 이 문서는 개발자가 텔레그램 알림 API를 효과적으로 사용할 수 있도록 설계되었습니다.

## 2. API 엔드포인트

KeywordPulse는 다음과 같은 텔레그램 관련 API 엔드포인트를 제공합니다:

### 2.1 텔레그램 설정 테스트

```
POST /api/notify/telegram/test
```

**목적**: 사용자가 입력한 텔레그램 봇 토큰과 채팅 ID를 검증하고 테스트 메시지를 전송합니다.

**요청 본문**:
```json
{
  "token": "YOUR_TELEGRAM_BOT_TOKEN",
  "chat_id": "YOUR_CHAT_ID",
  "message": "테스트 메시지입니다."
}
```

**응답**:
- 성공 시:
  ```json
  {
    "success": true,
    "message": "텔레그램 메시지가 성공적으로 전송되었습니다."
  }
  ```
- 실패 시:
  ```json
  {
    "success": false,
    "error": "오류 메시지"
  }
  ```

**코드 예제**:
```typescript
// 텔레그램 설정 테스트
const testTelegramSettings = async (token: string, chatId: string, message: string) => {
  try {
    const response = await fetch('/api/notify/telegram/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        chat_id: chatId,
        message,
      }),
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('테스트 메시지 전송 성공');
    } else {
      console.error('테스트 메시지 전송 실패:', data.error);
    }
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
```

### 2.2 키워드 분석 알림 전송

```
POST /api/notify/telegram
```

**목적**: 키워드 분석 결과를 텔레그램으로 전송합니다.

**요청 본문**:
```json
{
  "token": "YOUR_TELEGRAM_BOT_TOKEN",
  "chat_id": "YOUR_CHAT_ID",
  "keyword": "검색 키워드",
  "score": 75.5,
  "trend": "상승",
  "custom_message": "추가 메시지 (선택사항)"
}
```

**응답**:
- 성공 시:
  ```json
  {
    "success": true,
    "message": "키워드 분석 결과가 텔레그램으로 전송되었습니다."
  }
  ```
- 실패 시:
  ```json
  {
    "success": false,
    "error": "오류 메시지"
  }
  ```

**코드 예제**:
```typescript
// 키워드 분석 결과 전송
const sendKeywordAnalysis = async (
  token: string,
  chatId: string,
  keyword: string,
  score: number,
  trend: string,
  customMessage?: string
) => {
  try {
    const response = await fetch('/api/notify/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        chat_id: chatId,
        keyword,
        score,
        trend,
        custom_message: customMessage,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
```

### 2.3 RAG 기반 상세 분석 결과 전송

```
POST /api/notify/telegram/rag
```

**목적**: RAG 기술을 활용한 상세 키워드 분석 결과를 텔레그램으로 전송합니다.

**요청 본문**:
```json
{
  "token": "YOUR_TELEGRAM_BOT_TOKEN",
  "chat_id": "YOUR_CHAT_ID", 
  "keyword": "검색 키워드",
  "analysis": "키워드에 대한 RAG 상세 분석 결과",
  "template_type": "full" // 'full', 'summary', 'compact' 중 선택
}
```

**응답**:
- 성공 시:
  ```json
  {
    "success": true,
    "message": "RAG 분석 결과가 텔레그램으로 전송되었습니다."
  }
  ```
- 실패 시:
  ```json
  {
    "success": false,
    "error": "오류 메시지"
  }
  ```

**코드 예제**:
```typescript
// RAG 분석 결과 전송
const sendRagAnalysis = async (
  token: string, 
  chatId: string, 
  keyword: string, 
  analysis: string, 
  templateType: 'full' | 'summary' | 'compact' = 'full'
) => {
  try {
    const response = await fetch('/api/notify/telegram/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        chat_id: chatId,
        keyword,
        analysis,
        template_type: templateType,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
```

### 2.4 기본 알림 전송

```
POST /api/notify
```

**목적**: 환경 변수에 설정된 텔레그램 정보를 사용하여 기본 알림을 전송합니다.

**요청 본문**:
```json
{
  "message": "전송할 알림 메시지",
  "type": "info" // 'info', 'warning', 'error' 중 선택
}
```

**응답**:
- 성공 시:
  ```json
  {
    "success": true,
    "message": "알림이 성공적으로 전송되었습니다."
  }
  ```
- 실패 시:
  ```json
  {
    "success": false,
    "error": "오류 메시지"
  }
  ```

**코드 예제**:
```typescript
// 기본 알림 전송
const sendNotification = async (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        type,
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
```

## 3. 메시지 형식 가이드라인

### 3.1 지원되는 형식

텔레그램 API는 다음과 같은 메시지 형식을 지원합니다:

- **HTML**: `<b>`, `<i>`, `<code>`, `<pre>` 등의 태그 사용 가능
- **Markdown**: `*bold*`, `_italic_`, ``` `code` ``` 등의 마크다운 문법 사용 가능

### 3.2 형식화 예제

**HTML 예제**:
```html
<b>중요 알림</b>

키워드: <code>인공지능</code>
점수: <b>85.7</b>
트렌드: <i>급상승</i>

<pre>상세 분석 내용은 여기에...</pre>
```

**Markdown 예제**:
```markdown
*중요 알림*

키워드: `인공지능`
점수: *85.7*
트렌드: _급상승_

```상세 분석 내용은 여기에...```
```

### 3.3 유틸리티 함수

KeywordPulse는 다음과 같은 메시지 형식화 유틸리티 함수를 제공합니다:

```typescript
// 마크다운을 HTML로 변환
import { markdownToHtml } from '@/lib/telegram';

// 마크다운 텍스트를 HTML로 변환
const htmlContent = markdownToHtml('*강조된 텍스트*');

// 키워드 분석 메시지 템플릿 생성
import { formatKeywordAnalysisMessage } from '@/lib/telegram';

const formattedMessage = formatKeywordAnalysisMessage({
  keyword: '인공지능',
  score: 85.7,
  trend: '상승',
  customMessage: '추가 정보'
});
```

## 4. 오류 처리 가이드라인

### 4.1 공통 오류 코드

| 오류 코드 | 설명 | 해결 방법 |
|----------|------|----------|
| 400 | 잘못된 요청 (필수 매개변수 누락) | 필수 매개변수가 모두 포함되었는지 확인하세요. |
| 401 | 인증 실패 (잘못된 봇 토큰) | 올바른 텔레그램 봇 토큰을 사용하고 있는지 확인하세요. |
| 404 | 채팅 ID를 찾을 수 없음 | 올바른 채팅 ID를 사용하고 있는지 확인하세요. |
| 429 | 요청 제한 초과 | 요청 빈도를 줄이고 나중에 다시 시도하세요. |
| 500 | 서버 오류 | 서버 로그를 확인하고 관리자에게 문의하세요. |

### 4.2 오류 처리 예제

```typescript
// 오류 처리 예제
const sendTelegramMessage = async (params) => {
  try {
    const response = await fetch('/api/notify/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // 오류 유형에 따른 처리
      switch (data.code) {
        case 400:
          console.error('필수 매개변수가 누락되었습니다:', data.error);
          // 사용자에게 필수 필드 안내
          break;
        case 401:
          console.error('봇 토큰이 유효하지 않습니다.');
          // 사용자에게 토큰 재설정 안내
          break;
        case 404:
          console.error('채팅 ID를 찾을 수 없습니다.');
          // 채팅 ID 확인 안내
          break;
        case 429:
          console.error('요청 제한이 초과되었습니다.');
          // 잠시 후 재시도 로직
          setTimeout(() => sendTelegramMessage(params), 5000);
          break;
        default:
          console.error('알 수 없는 오류:', data.error);
          // 기본 오류 처리
      }
      return data;
    }
    
    return data;
  } catch (error) {
    console.error('API 호출 중 예외 발생:', error);
    throw error;
  }
};
```

## 5. 확장 방법

### 5.1 새로운 메시지 템플릿 추가

telegram.ts 파일에 새로운 메시지 템플릿 함수를 추가하여 메시지 형식을 확장할 수 있습니다:

```typescript
// lib/telegram.ts에 새 템플릿 함수 추가
export function formatCustomTemplate(data: CustomTemplateData): string {
  // 템플릿 형식 정의
  return `
    <b>${data.title}</b>
    
    ${data.content}
    
    <i>추가 정보: ${data.additionalInfo}</i>
  `;
}
```

### 5.2 새로운 API 엔드포인트 추가

새로운 API 엔드포인트를 추가하려면 다음과 같은 단계를 따르세요:

1. app/api/notify/telegram/[endpoint] 디렉토리에 route.ts 파일 생성
2. 필요한 요청 처리 로직 구현
3. 텔레그램 유틸리티 함수 활용

```typescript
// app/api/notify/telegram/custom/route.ts
import { NextResponse } from 'next/server';
import { sendTelegramMessage, formatCustomTemplate } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const { token, chat_id, data } = await request.json();
    
    // 필수 매개변수 검증
    if (!token || !chat_id || !data) {
      return NextResponse.json(
        { success: false, error: '필수 매개변수가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 정의 템플릿 형식화
    const message = formatCustomTemplate(data);
    
    // 텔레그램으로 메시지 전송
    const result = await sendTelegramMessage(token, chat_id, message);
    
    return NextResponse.json({
      success: true,
      message: '사용자 정의 메시지가 성공적으로 전송되었습니다.',
      result
    });
  } catch (error) {
    console.error('텔레그램 메시지 전송 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, error: '메시지 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

## 6. 성능 최적화

### 6.1 메시지 대기열

대량의 메시지를 전송해야 하는 경우, 텔레그램 API의 속도 제한에 도달하지 않도록 메시지 대기열을 구현하는 것이 좋습니다:

```typescript
// 간단한 메시지 대기열 구현 예제
class MessageQueue {
  private queue: any[] = [];
  private processing = false;
  private interval = 1000; // 1초 간격으로 처리
  
  addMessage(message: any) {
    this.queue.push(message);
    if (!this.processing) {
      this.processQueue();
    }
  }
  
  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    const message = this.queue.shift();
    
    try {
      await sendTelegramMessage(message.token, message.chat_id, message.text);
      console.log('메시지 전송 성공');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 실패한 경우 다시 대기열에 추가할 수 있음
      // this.queue.unshift(message);
    }
    
    // 일정 간격으로 다음 메시지 처리
    setTimeout(() => this.processQueue(), this.interval);
  }
}

// 사용 예제
const messageQueue = new MessageQueue();
messageQueue.addMessage({ token, chat_id, text: '첫 번째 메시지' });
messageQueue.addMessage({ token, chat_id, text: '두 번째 메시지' });
```

### 6.2 캐싱

동일한 분석 결과나 알림을 여러 사용자에게 전송하는 경우, 메시지 형식화 결과를 캐싱하여 성능을 향상시킬 수 있습니다:

```typescript
// 간단한 캐시 구현 예제
const messageFormatCache = new Map<string, string>();

function getFormattedMessage(type: string, data: any): string {
  const cacheKey = `${type}:${JSON.stringify(data)}`;
  
  if (messageFormatCache.has(cacheKey)) {
    return messageFormatCache.get(cacheKey)!;
  }
  
  let formattedMessage: string;
  switch (type) {
    case 'keyword':
      formattedMessage = formatKeywordAnalysisMessage(data);
      break;
    case 'rag':
      formattedMessage = formatRagAnalysisMessage(data);
      break;
    default:
      formattedMessage = JSON.stringify(data);
  }
  
  // 캐시에 저장
  messageFormatCache.set(cacheKey, formattedMessage);
  
  return formattedMessage;
}
```

## 7. 베스트 프랙티스

1. **환경 변수 활용**: 개발 및 테스트 환경에서 텔레그램 봇 토큰과 채팅 ID를 환경 변수로 관리하세요.
2. **오류 처리**: 모든 API 호출에서 명확한 오류 처리 로직을 구현하세요.
3. **속도 제한 고려**: 텔레그램 API에는 속도 제한이 있으므로, 대량의 메시지를 전송할 때 대기열 메커니즘을 구현하세요.
4. **메시지 길이 제한**: 텔레그램 메시지 길이 제한(4096자)을 고려하여 긴 메시지는 여러 개로 나누어 전송하세요.
5. **테스트 우선**: 실제 사용자에게 알림을 전송하기 전에 테스트 API를 통해 검증하세요.

## 8. 고급 기능

### 8.1 인라인 키보드 버튼

텔레그램 인라인 키보드 버튼을 사용하여 대화형 알림을 구현할 수 있습니다:

```typescript
// 인라인 키보드 버튼 예제
const sendMessageWithButtons = async (token: string, chatId: string, text: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '자세히 보기', url: 'https://keywordpulse.app/dashboard' },
              { text: '구독 중지', callback_data: 'unsubscribe' }
            ]
          ]
        }
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('버튼이 있는 메시지 전송 실패:', error);
    throw error;
  }
};
```

### 8.2 메시지 예약 전송

특정 시간에 알림을 전송하기 위한 예약 기능 구현:

```typescript
// 메시지 예약 전송 예제
const scheduleMessage = (
  token: string,
  chatId: string,
  message: string,
  scheduledTime: Date
) => {
  const now = new Date();
  const delayMs = scheduledTime.getTime() - now.getTime();
  
  if (delayMs <= 0) {
    // 이미 지난 시간이면 즉시 전송
    return sendTelegramMessage(token, chatId, message);
  }
  
  // 예약 설정
  const timeoutId = setTimeout(() => {
    sendTelegramMessage(token, chatId, message)
      .then(() => console.log('예약 메시지 전송 성공'))
      .catch((error) => console.error('예약 메시지 전송 실패:', error));
  }, delayMs);
  
  // 필요한 경우 예약 취소 기능 제공
  return {
    cancel: () => clearTimeout(timeoutId),
    scheduledTime,
    message
  };
};
```

## 9. 문제 해결

### 9.1 일반적인 문제

| 문제 | 가능한 원인 | 해결 방법 |
|-----|------------|----------|
| 메시지가 전송되지 않음 | 잘못된 봇 토큰 또는 채팅 ID | 테스트 API를 사용하여 설정 검증 |
| HTML 형식이 적용되지 않음 | parse_mode 매개변수 누락 | parse_mode: 'HTML' 추가 |
| 429 오류 (Too Many Requests) | 텔레그램 API 속도 제한 초과 | 요청 간 지연 추가 또는 대기열 구현 |
| 메시지 길이 제한 초과 | 4096자 제한 초과 | 메시지를 여러 개로 분할 |

### 9.2 문제 해결 체크리스트

1. 봇 토큰이 올바른지 확인
2. 채팅 ID가 올바른지 확인 
3. 봇이 해당 채팅방에 추가되었는지 확인
4. 네트워크 연결 상태 확인
5. 봇 권한 확인 (그룹에서 관리자 권한 필요할 수 있음)
6. 요청 형식이 올바른지 확인 (JSON 구조, 필수 필드)
7. 이전 API 요청의 응답 확인 (오류 메시지 분석)

## 10. 참고 자료

- [텔레그램 봇 API 공식 문서](https://core.telegram.org/bots/api)
- [KeywordPulse 텔레그램 설정 가이드](/help/telegram/setup)
- [텔레그램 마크다운 스타일 가이드](https://core.telegram.org/bots/api#markdownv2-style) 