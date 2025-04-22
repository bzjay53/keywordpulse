# 🧠 RAG (Retrieval-Augmented Generation) 시스템 문서

이 문서는 KeywordPulse 서비스의 핵심 기능 중 하나인 RAG (Retrieval-Augmented Generation) 기반 텍스트 분석 시스템의 구조, 동작 방식, 적용 방식에 대해 설명합니다.

---

## 📌 목적
- 키워드 분석 결과를 **사실 기반 자연어 요약**으로 생성
- 사용자가 검색한 키워드 목록을 바탕으로 **자동 인사이트 문장** 제공
- 점수 기반 키워드 추천을 **텍스트 형태로 설명**하는 인터페이스 구현

---

## 🧠 RAG 시스템 개요

| 구성 요소 | 설명 |
|------------|------|
| Retriever | 분석된 키워드와 점수 정보를 구조화된 텍스트 형태로 정리 |
| Generator | 사전 템플릿 또는 LLM(OpenAI) 기반 텍스트 생성기 |
| Output Formatter | 마크다운 형식 또는 HTML UI로 렌더링되는 텍스트 결과 |

### 텍스트 생성 흐름

```plaintext
사용자 키워드 입력 → 검색 결과 → 상위 N개 추출 → 점수 기반 구조화 → 템플릿 → 최종 텍스트 출력
```

---

## ⚙️ 동작 프로세스

1. `/api/search` 응답에서 추천 점수 60점 이상 키워드를 선별
2. 해당 키워드를 리스트화하여 요약 입력값으로 구성
3. 템플릿 또는 LLM에게 전달 → 요약문 생성
4. `/api/analyze` 응답으로 마크다운 형태 텍스트 반환
5. 프론트에서 Card UI로 표시

---

## ✨ 템플릿 기반 RAG 예시 (Python 함수형)

```python
def generate_analysis_text(keywords: List[Dict[str, Any]]) -> str:
    top_keywords = sorted(keywords, key=lambda x: x['score'], reverse=True)[:5]
    summary = ""
    summary += f"이번 주 분석된 키워드 중 '{top_keywords[0]['keyword']}'는 가장 높은 추천 점수를 기록했습니다.\n"
    for kw in top_keywords:
        summary += f"- **{kw['keyword']}**: 검색량 {kw['monthlySearches']:,}회, 경쟁률 {kw['competitionRate']:.2f}, 점수 {kw['score']}점\n"
    summary += "\n이 중에서도 80점 이상 키워드는 콘텐츠 제작 우선순위로 추천됩니다."
    return summary
```

---

## 🤖 LLM 기반 확장 가능성
- 향후 OpenAI GPT, Claude, Gemini 등 API 연동 가능
- `prompt_template + structured_keywords` 형태로 Prompt Engineering 가능
- 예시:
```text
[시작]
아래 키워드 분석 데이터를 바탕으로 마케팅 인사이트 요약을 생성해줘:

키워드: AI 마케팅 / 검색량: 28,000 / 경쟁률: 0.25 / 점수: 91
...
```

---

## 📦 API 통합 위치

| API 경로 | 설명 |
|----------|------|
| `/api/analyze` | 키워드 목록 전달 → 분석 텍스트 생성 후 응답 |
| `/api/search` | 추천 점수 포함된 키워드 데이터 추출 역할 |
| 프론트 UI | `RagCard` 컴포넌트에서 마크다운 렌더링 |

---

## 🧪 테스트 전략
- 템플릿 기반 → 단위 테스트 (문장 포함 여부, 숫자 포맷 확인)
- GPT 기반 → 프롬프트 리턴 구조 비교 테스트 (텍스트 길이, 구성 체크)

---

## 🔄 유지보수 전략
- 템플릿 방식은 점수/문장 규칙만 수정하면 리팩토링 용이
- GPT 기반은 토큰 최적화 및 결과 캐싱 고려

---

## 📌 관련 문서
- [Refactoring 문서] → 템플릿 코드 분리 기준 정의
- [API 명세서] → `/api/analyze` 구조 참고
- [UI/UX 문서] → 분석 텍스트 렌더링 위치
- [Cursor Rules 문서] → 분석 생성 규칙 유지 필요

---

> 이 문서는 KeywordPulse에서 사용되는 RAG 시스템의 전체 흐름과 템플릿 및 확장 가능성, 구현 방식에 대해 기술한 핵심 아키텍처 문서입니다.

