# 인간 창의성 연구 (배경 지식)

> **이 문서는 무엇인가**: CLAUDE.md의 도구들이 인간 창의성 연구와 어떻게 연결되는지의 참조. Wallas·Mednick·Boden·Csikszentmihalyi 등 고전 연구.
>
> **언제 읽나**: 인간 발상 메커니즘의 학술적 맥락이 필요할 때만. Claude의 발상 행동에는 직접 영향 거의 없음.
>
> **CLAUDE.md와의 관계**: 매 세션 로드 안 됨. 명시적 참조 시에만.

---


> Part 2가 LLM 메커니즘이라면, 이 부록은 인간 인지 연구. v1·v2의 원래 학술 내용 압축 보존. Part 1·2의 도구가 인간 창의성 연구와 어떻게 연결되는지의 참조.

## App.1 발산-수렴 이중 구조 (Guilford 1950)

발산적·수렴적 사고의 구분. 이후 거의 모든 창의성 모델의 뼈대. Double Diamond (영국 Design Council): 발산-수렴이 두 번 반복 — 문제 정의 + 해결.

## App.2 Mednick 연상 이론 (1962)

창의성 = 멀리 떨어진 의미 요소들의 결합. "Flat associative hierarchy" 가설. Benedek & Neubauer (2013) 현대 재검증: 창의적 사람은 "richer semantic network".

**LLM과 연결**: LLM의 embedding 공간이 의미 거리의 자동 측정 제공. VS의 "분포 꼬리"는 Mednick의 "먼 연상"과 직접 대응.

## App.3 Geneplore (Finke, Ward, Smith 1992)

Generate-Explore 2단계. 전(前)발명 구조 생성 → 해석. 의미를 먼저 정하면 창의성 ↓.

**LLM과 연결**: ToT 구조가 Geneplore의 알고리즘적 구현. Generate = 노드 생성, Explore = 평가·확장.

## App.4 Boden 3유형 (1990, 2004)

Combinational / Exploratory / Transformational. LLM은 조합형·탐색형 강함, 변형형 약함 (Boden 2016; Si et al. 2025).

## App.5 부화·이중처리

**Sio & Ormerod (2009)** 메타분석: 부화 효과 d ≈ 0.4 견고. **Dijksterhuis UTT**: 다수 재현 실패. Claude는 부화 시간이 없으므로 직접 적용 불가.

## App.6 그룹 vs 개인

**Diehl & Stroebe (1987, 1991)** + **Mullen et al. (1991)**: 대면 브레인스토밍 < nominal group. Production blocking이 주 원인.

**LLM과 연결**: Claude의 multi-persona Town Hall은 nominal group의 효율적 LLM 대용. 한 인스턴스 내 다수 페르소나 = production blocking 제거.

## App.7 사회 네트워크

**Granovetter (1973)** 약한 유대, **Burt (2004)** 구조적 공백. 다양한 도메인을 잇는 위치가 좋은 아이디어 생산.

**LLM과 연결**: Claude는 본질적으로 다수 도메인의 가교. 의도적으로 도메인 횡단 유추를 요구하면 이 위치를 활용.

## App.8 핵심 서지

**LLM·창의성 (Part 2 근거)**:
- Zhang, J., et al. (2025). Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity. *arXiv:2510.01171*.
- Mohammadi, B. (2024). Creativity Has Left the Chat: The Price of Debiasing Language Models. *arXiv:2406.05587*.
- Liang, T., et al. (2024). Encouraging Divergent Thinking in LLMs through Multi-Agent Debate. *EMNLP 2024*.
- Si, C., Yang, D., & Hashimoto, T. (2024). Can LLMs Generate Novel Research Ideas? A Large-Scale Human Study with 100+ NLP Researchers. *ICLR 2025 (arXiv:2409.04109)*.
- Si, C., Hashimoto, T., & Yang, D. (2025). The Ideation-Execution Gap. *arXiv:2506.20803*.
- Kirk, R., et al. (2023). Understanding the Effects of RLHF on LLM Generalisation and Diversity. *arXiv:2310.06452*.
- Yao, S., et al. (2023). Tree of Thoughts: Deliberate Problem Solving with Large Language Models. *NeurIPS 2023*.
- Kumar, H., et al. (2025). Human Creativity in the Age of LLMs. *CHI 2025*.
- Hubert, K. F., Awa, K. N., & Zabelina, D. L. (2024). The current state of AI is more creative than humans on divergent thinking tasks. *Scientific Reports, 14, 3440*.
- Anderson, B. R., Shah, J. H., & Kreminski, M. (2024). Homogenization effects of large language models on human creative ideation. *ACM Creativity & Cognition*.
- He, J., et al. (2024). PersonaFlow: Designing LLM-Simulated Expert Perspectives for Enhanced Research Ideation. *DIS 2025*.
- Anthropic. (2025). Improving frontend design through Skills. *anthropic.com/engineering*.
- Anthropic. (2025). Prompting best practices. *docs.claude.com*.

**인간 창의성 (Appendix 근거)**:
- Guilford, J. P. (1950). *American Psychologist*, 5, 444-454.
- Mednick, S. A. (1962). *Psychological Review*, 69, 220-232.
- Finke, R. A., Ward, T. B., & Smith, S. M. (1992). *Creative Cognition*. MIT Press.
- Boden, M. A. (2004). *The Creative Mind* (2nd ed.). Routledge.
- Sio, U. N., & Ormerod, T. C. (2009). *Psychological Bulletin*, 135, 94-120.
- Diehl, M., & Stroebe, W. (1987). *JPSP*, 53, 497-509.
- Mullen, B., Johnson, C., & Salas, E. (1991). *Basic and Applied Social Psychology*, 12, 3-23.
- Granovetter, M. (1973). *American Journal of Sociology*, 78, 1360-1380.
- Burt, R. S. (2004). *American Journal of Sociology*, 110, 349-399.
- Csikszentmihalyi, M. (1996). *Creativity*. HarperCollins.
- Amabile, T. M. (1996). *Creativity in Context*. Westview Press.

---

*이 문서 v3는 Claude의 작동 메커니즘(RLHF 모드 붕괴, DoT, embedding 공간 구조)에 기반하여 발상 운영 지침을 재구성한 것이다. 인간 발상 연구는 배경으로 유지되었으나 도구의 근거는 LLM 연구로 옮겨졌다. 이 분야는 빠르게 발전 중이므로 6개월 단위 업데이트 권장. 사용자의 명시적 요청이 본 지침과 충돌하면 사용자 요청이 우선한다.*