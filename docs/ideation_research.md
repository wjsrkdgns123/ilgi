# Claude 발상 메커니즘 심층 연구

> **이 문서는 무엇인가**: CLAUDE.md의 모든 규칙이 왜 그런 형태인지의 근거. LLM·Claude의 실제 작동 원리에 기반한 발상 연구를 정리.
>
> **언제 읽나**: CLAUDE.md의 어떤 규칙이 효과 없다고 느낄 때, 또는 새 발상 도구를 추가하려 할 때 근거 확인용.
>
> **CLAUDE.md와의 관계**: 이 문서는 매 세션 자동 로드되지 않는다. CLAUDE.md에서 `@docs/ideation_research.md`로 참조할 때만 로드.

---


> 이 부분은 Part 1의 모든 도구가 왜 그런 형태인지의 근거다. Claude의 작동 원리에 기반한 발상 연구를 정리.

## §A. 왜 LLM은 generic해지는가 — 모드 붕괴 메커니즘

### A.1 RLHF의 typicality bias

**Lu et al. (2025), Zhang et al. (2025, *Verbalized Sampling*)** — Stanford, Northeastern, West Virginia 공동 연구가 결정적 진단을 내림.

**메커니즘**:
1. 사전훈련(pretraining): 모델은 광범위한 텍스트 분포 학습. 다양성 풍부.
2. RLHF/SFT 정렬(alignment): 인간 평가자가 선호하는 응답으로 fine-tuning.
3. **문제**: 인간 평가자는 "typical" 응답을 체계적으로 선호 — 친숙·예측가능 = "더 좋음"으로 평가.
4. 결과: 모델 분포가 좁아짐. 모드(가장 확률 높은 응답)에 집중. **"mode collapse"**.

**증거 (Mohammadi 2024, *Creativity Has Left the Chat*)**:
- 정렬된 Llama-2 vs base Llama-2 비교
- 정렬 모델: 토큰 예측 엔트로피 ↓, embedding 공간에서 좁은 클러스터, "attractor states"로 수렴
- 의미적·구문적 다양성 모두 감소

**KL-divergence 페널티의 역할 (Xiao et al. 2024)**:
- RLHF의 KL 정규화가 majority opinion 강화
- 다양한 long-tail 응답에 페널티

### A.2 Claude에서의 발현

Anthropic 자신이 명시적으로 인정: *"You tend to converge toward generic, 'on distribution' outputs"* (frontend-design skill, 2025).

이 진술의 함의:
- Claude 개발자가 모드 붕괴를 알고 있음
- 프롬프트로 우회 가능함을 인정
- 표준 발상 요청은 모드 응답을 끌어냄

### A.3 함의

- **첫 응답 = 모드**. 거의 항상.
- **N개 요청해도 모드 근처**: "5개 아이디어"가 모드 + 가까운 4개일 뿐.
- **명시적 분포 호출**이 필요: VS의 작동 원리.

---

## §B. Verbalized Sampling — 가장 강력한 실용 발견

### B.1 원리

**Zhang et al. (2025)** *arXiv:2510.01171*. 훈련 불필요(training-free) 프롬프트 전략.

**핵심 통찰**: LLM은 정렬 후에도 사전훈련의 풍부한 분포 정보를 가중치에 보존하고 있음. 단지 표면 출력 시 모드로 수렴할 뿐. **분포 자체를 표현하라**고 명시 요청하면 그 분포에 접근 가능.

**직접 프롬프트 (모드 응답)**:
```
"커피에 대한 농담 하나 해줘"
→ "It got mugged" (모든 LLM이 같은 답)
```

**Verbalized Sampling 프롬프트 (분포 응답)**:
```
"커피에 대한 농담 5개를 생성하고 각각의 확률을 추정해줘. 
가능하면 분포의 꼬리에서 무작위 샘플링하여 각 응답의 확률이 0.10 이하가 되도록."
→ 5개의 다양한, 비표준 농담
```

### B.2 실증 결과

**측정**:
- 창의적 글쓰기 (시·소설·농담): 다양성 1.6~2.1배 ↑
- 인간 평가 점수: 25.7% ↑
- 사전훈련 다양성의 66.8% 복원
- 안전성·사실 정확성 유지

**모델별 효과**:
- 큰 모델일수록 효과 큼 (1.5~2배 차이)
- GPT-5, Claude 4 Opus, Gemini 2.5 Pro에서 강한 효과
- 작은 모델은 효과 작음 (분포 자체가 빈약)

### B.3 변형

**Standard VS** (가장 기본):
```
Generate 5 responses to the user query, each within a separate <response> tag. 
Each <response> must include a <text> and a numeric <probability>.
Please sample at random from the tails of the distribution, 
such that the probability of each response is less than 0.10.
```

**VS-CoT** (chain-of-thought 결합): 각 응답에 reasoning 포함. 추론 다양성도 증가.

**3-tier sampling** (의도적 분포 강제):
- high-mode 1~2개 (안전한 답)
- mid-mode 2~3개 (균형)
- low-mode 1~2개 (탐색적)

### B.4 직교성

VS는 다른 다양성 기법과 직교적:
- Temperature 설정과 무관 (chat에서 조절 불가한 사용자도 사용 가능)
- 다른 프롬프트 기법과 결합 가능
- 모델 무관 (Claude·GPT·Gemini·Llama)

→ **chat 인터페이스 사용자에게 가장 실용적 도구**. Claude.ai 사용자가 temperature를 조절할 수 없으므로 VS가 결정적.

---

## §C. Degeneration of Thought (DoT) — 자기 비판의 한계

### C.1 발견

**Liang et al. (2024)** *Encouraging Divergent Thinking in LLMs through Multi-Agent Debate* (EMNLP 2024).

**관찰**: LLM에게 "더 나은 답을 만들어 봐"를 5번 반복했을 때, **2라운드 이후 자기 비판 횟수가 거의 0**으로 떨어짐. 모델은 첫 답에 confidence를 형성한 뒤 진정한 반박을 생성하지 못함.

**실험 측정**: 두 라운드 간 의견 변화율(disagreement rate)이 self-reflection에서 매우 낮음. MAD(multi-agent debate)에서는 의미 있는 의견 변화 발생.

### C.2 원인 추정

- RLHF가 일관성(consistency)을 보상하도록 훈련됨
- 모델은 자신의 출력에 대해 verbalized confidence를 갖도록 훈련됨 (epistemic doubt 억제)
- 결과: 자기 비판은 표면적·형식적이 됨

### C.3 해결: Multi-Agent Debate (MAD)

```
Agent A (옹호자): 안을 강하게 주장
Agent B (반박자): 안의 약점을 가혹하게 지적, tit-for-tat
Judge (판정자): 둘의 논쟁을 평가, 적절한 시점에 중단 후 결론
```

**핵심 설계**:
- A·B는 서로 다른 system prompt로 분리된 페르소나
- "Tit-for-tat" 상태가 적절히 유지되어야 함 (너무 부드러우면 self-reflection과 같아짐, 너무 적대적이면 발산 안 함)
- Judge의 adaptive break (언제 중단할지) 중요

**효과**: counter-intuitive 산술 추론 등에서 self-reflection 대비 유의미한 정확도 향상.

### C.4 함의 (운영 지침)

- **"다시 해 봐", "더 좋게"는 작동 안 한다** — 표면만 다듬어짐
- **적대적 페르소나 명시 도입**이 필요 (§3.10)
- **한 번에 N개 병렬 생성** 이 순차적 개선보다 다양성 측면에서 우월

---

## §D. 다중 에이전트 / 다중 페르소나

### D.1 Multi-Persona Town Hall

**Sandwar et al. (2025)**, **PersonaFlow (He et al. 2024)** — 결정적 연구들.

**Town Hall 구조**: 한 LLM 인스턴스에 여러 페르소나를 부여, 각각 독립 분석 후 판정자 통합.

**검증된 효과**:
- 논리 퍼즐 GPT-4o: 셀 정확도 +13%
- 연구 아이디어 발상: 사용자 인식 품질·창의성 ↑, 인지 부하 무증가
- 다양한 도메인 (디자인, 연구, 평가)에서 일관됨

### D.2 페르소나 설계의 함정 (Lutz et al. 2025; Rupprecht et al. 2025)

**작동하는 것**:
- 도메인 전문성 명시 ("mechanical engineer with 20 years in aerospace")
- 사고 스타일·방법론 명시 ("first principles thinker")
- 가치 기준 명시 ("ROIC and economic moats")

**작동하지 않거나 해로운 것**:
- 무관한 personal 정보 (좋아하는 색, 나이, 출신) — 최대 30%p 성능 저하
- 너무 narrow한 페르소나 (작은 모델에서 특히)
- 임의 선택된 페르소나 (도메인 부정합)

→ **운영 함의**: 페르소나는 task-relevant **전문성·방법론·가치**로만 구성. 인간적 풍미는 제거.

### D.3 Town Hall vs MAD

| | Town Hall | MAD |
|---|---|---|
| 구조 | 다수 페르소나 + 통합자 | 2 페르소나 + 판정자 |
| 효과 | 다양성·통찰 | 정확성·논쟁 해결 |
| 발상에 적합 | ⭐⭐⭐ | ⭐⭐ |
| 검증에 적합 | ⭐⭐ | ⭐⭐⭐ |

Part 1의 §3.11 (Town Hall) = 발산용, §3.10 (Adversarial) = 검증용.

---

## §E. Tree of Thoughts — 구조적 탐색

### E.1 핵심 (Yao et al. 2023)

LLM의 선형 chain-of-thought를 트리 탐색으로 확장.

**노드**: 부분 사고(thought) — 추론의 한 단계
**가지치기 결정**: 각 노드에서 다음 N개 thought 생성 → 평가 → 상위 k개만 확장

### E.2 두 모드

**Independent Sampling (병렬 모드)** — *발상에 적합*:
- 같은 단계에서 여러 thought를 독립 생성
- 다양성 최대화
- 창의적 글쓰기·브레인스토밍에 최적

**Sequential Proposal (순차 모드)** — *추론에 적합*:
- 이전 thought 위에 다음을 쌓음
- 단계적 추론에 최적
- 수학·논리 문제 해결

### E.3 발상 ToT의 실용 구조

```
Level 1: 문제의 가능한 framing 5개 (병렬)
  └ Level 2: 각 framing에 대한 접근 방법 3개 (병렬)
    └ Level 3: 각 접근의 첫 실행 단계 2개 (병렬)
Level 0 (root): 원래 문제
```

이 구조는 단순 "아이디어 N개"보다 **결정의 분기**를 보존. 사용자가 어느 layer에서 결정을 바꾸고 싶은지 명시적으로 보임.

### E.4 ToT의 비용

- 단순 발산보다 많은 토큰 소비
- 구조화된 문제에서 효과 큼
- 자유 발상에는 over-engineering일 수 있음

→ **운영 함의**: ToT는 중요한 다단계 전략 결정에 사용. 단순 발상에는 VS가 효율적.

---

## §F. 샘플링 파라미터의 역할 (배경 지식)

Chat 인터페이스에서 사용자는 보통 조절 불가. 그러나 메커니즘 이해는 발상 도구 선택에 도움.

### F.1 Temperature

- 토큰 확률 분포의 평탄도 조절
- T=0: greedy decoding, 가장 확률 높은 토큰만
- T=1: 원 분포대로 샘플링
- T>1: 분포 평탄화, 낮은 확률 토큰도 선택 가능

**발상 권장**: T = 0.7~1.0. 그러나 chat 사용자는 직접 조절 불가 → VS로 대체.

### F.2 Top-p (Nucleus Sampling)

- 누적 확률 p까지의 토큰만 후보로 두고 거기서 샘플링
- p=0.95가 흔한 기본값

### F.3 Min-p (2024년 발견)

**Nguyen et al. 2024** — top-p 대안. 최상위 토큰 확률에 비례한 최소 임계값.

- 높은 T에서도 일관성 유지하면서 다양성 증가
- 창의적 글쓰기에서 top-p 능가
- 일부 오픈소스 LLM에 채택됨

### F.4 Chat Claude 사용자의 실용 결론

- Temperature·top-p 조절 불가
- **VS (§B)가 사실상 유일한 분포 제어 수단**
- 명시적 분포 언어 사용이 결정적

---

## §G. Anthropic 공식 가이드 — Claude 특화 패턴

### G.1 Anti-AI-slop 프롬프트 패턴

**Anthropic Frontend Design Cookbook (2025)** — 공식 패턴.

**구조**:
```
1. 모델의 경향성 명시
   "You tend to converge toward generic, 'on distribution' outputs."

2. 그 경향이 만드는 문제 명시
   "In [domain], this creates what users call the 'AI slop' aesthetic."

3. 회피 지시 + 방향
   "Avoid this: make [creative direction]"

4. 구체 차원별 가이드
   - Typography: ...
   - Color: ...
   ...

5. 명시적 anti-패턴 리스트
   "Avoid: overused fonts (Inter, Roboto), 
   cliched color schemes, predictable layouts..."
```

**일반화** (어느 도메인이든):
```
1. "당신은 평균적·예측 가능한 답으로 수렴하는 경향이 있다"
2. "이 영역에서 그건 [구체적 문제]를 낳는다"
3. "그것을 피하라: [원하는 방향]"
4. "특히 다음에 주의: [차원 1], [차원 2]"
5. "절대 피할 것: [구체적 안티 패턴 리스트]"
```

이 패턴이 단순 "창의적으로 해 줘"보다 훨씬 효과적인 이유: **메타 인식 활성화 + 구체적 회피 경로 제시**.

### G.2 Principle-based > Prescriptive

**Anthropic 공식 권고** (frontend cookbook): 

> "픽셀 수준 specs로 프롬프트를 채우면 모델의 토큰이 보수적 디폴트에 다 쓰여, 창의적 선택의 여지가 없어진다. 완전 개방형도 작동 안 한다 (평균값 = AI slop). 스위트 스팟은 **principle-based direction**: 무엇을 생산할지가 아니라 무엇에 대해 생각할지를 알려준다."

→ 운영 지침이 모든 detail을 지정하지 않고 **원칙·도구·점검표**로 구성된 이유.

### G.3 Extended Thinking 가이드

**Anthropic 공식**: extended thinking에는 **step-by-step prescriptive** 보다 **high-level 사고 요청**이 더 효과적.

나쁨:
```
이 문제를 단계별로 생각해라:
1. 변수 식별
2. 방정식 설정
3. x 풀이
```

좋음:
```
이 문제에 대해 충분히, 자세히 생각하라. 
여러 접근법을 고려하고 완전한 추론을 보여라. 
첫 접근이 안 통하면 다른 방법을 시도하라.
```

**이유**: 모델의 창의성이 인간 처방 능력을 초과할 수 있다.

### G.4 Few-shot diversity

**Anthropic 권고**: 3~5개의 **diverse, relevant** 예시. 단순 다수가 아니라 **다양성**이 중요.

→ 발상에서: 예시를 줄 때 의도적으로 다른 카테고리에서.

---

## §H. Ideation-Execution Gap — Si et al. 2024-2025

### H.1 Si et al. 2024 (ICLR 2025): LLM이 인간보다 신선

**연구 설계** (Stanford):
- 100+ NLP 연구자 vs LLM ideation agent
- 동일 주제, 표준화된 프롬프트 형식, blind review
- 평가 차원: novelty, excitement, expected effectiveness, feasibility

**결과**:
- LLM 아이디어가 **novelty에서 유의미하게 우월** (p < 0.05)
- Excitement, expected effectiveness도 LLM 우세
- **Feasibility만 약간 인간 우세**

### H.2 Si et al. 2025: 그런데 실행하면 뒤집힌다

**후속 연구** (*The Ideation-Execution Gap*, 2025):
- 43명의 전문 연구자가 무작위 배정된 (인간 or LLM) 아이디어를 실제 실행
- 각자 100+ 시간 투자, 4페이지 짧은 논문 작성
- 다시 평가

**결과**:
- 모든 평가 차원에서 LLM 아이디어 점수 **크게 하락**
- 인간 아이디어 점수도 하락하나 LLM만큼은 아님
- **실행 후 평가: LLM < 인간** (통계적으로 유의미하지는 않음)

### H.3 함의 — Ideation에 강하다 ≠ 좋은 안

**가능한 원인** (Si et al. 추정):
1. LLM은 surface novelty에 최적화 (인간 평가자가 "신선"을 좋아함)
2. LLM은 실행의 제약 (자원·시간·암묵 지식) 추정 약함
3. "그럴듯해 보이는" 안과 "실제 작동하는" 안의 분리

**운영 지침 함의** (Part 1 §4.5):
- novelty 점수가 높다고 끝이 아님
- 실행 시뮬레이션이 필수
- "첫 2주에 무엇을 하는가" 같은 구체화 강제

---

## §I. 인간 vs LLM — 실증 비교 종합

| 영역 | 인간 우세 | LLM 우세 | 비고 |
|---|---|---|---|
| 발산 양 (fluency) | | ⭐⭐⭐ | LLM이 압도적 |
| 표면 novelty | | ⭐⭐⭐ | Si et al. 2024 |
| 발산 다양성 (다양한 카테고리) | ⭐⭐ | (VS 사용 시 ⭐⭐) | VS로 격차 좁힘 |
| 실행 가능성 | ⭐⭐⭐ | | Si et al. 2025 |
| 변형형 창의성 (Boden) | ⭐⭐ | | 규칙 변경 어려움 |
| 도메인 깊이 (전문 지식) | ⭐⭐⭐ | ⭐ (얕은 폭) | 인간 전문가 우세 |
| 도메인 횡단 | | ⭐⭐⭐ | LLM 강점 |
| 암묵 지식 (정치·문화·역사) | ⭐⭐⭐ | | LLM 약점 |
| 비용·속도 | | ⭐⭐⭐ | |
| 동질화 (사용자 간 출력 유사) | (낮음) | (높음) | LLM 단점 |
| 사용 후 독립 능력 | (유지) | (저하) | Kumar et al. 2025 |

### I.1 가장 강력한 인간+LLM 협업 패턴

**Si et al. + Kumar et al. + Anderson et al. 결과 종합**:

```
1. 인간 먼저 (LLM 없이): 발상 시작
   - 도메인 직관, 암묵 지식 활용
   - 인간의 시작 prior가 다양성 유지

2. LLM 확장 (VS + Town Hall):
   - 분포 전체에서 샘플링
   - 다른 도메인 유추
   - 인간이 안 생각해본 카테고리

3. 인간 평가 + 선택:
   - 실행 가능성 평가
   - 암묵 제약 적용
   - 정치적·문화적 판단

4. LLM 정교화:
   - 선택된 안의 detail
   - 다양한 시나리오 시뮬레이션
   - 반박 케이스 작성

5. 인간 최종 결정 + 실행
```

이 분업이 단독 인간·단독 LLM·무구조 협업보다 우월.

---