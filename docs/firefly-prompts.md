# Firefly 마스코트 생성 프롬프트

> 사업계획 §1 마스코트 8종 일러스트 — Adobe Firefly Web (firefly.adobe.com) 기준

## 작업 흐름

1. **firefly.adobe.com** 접속 → "텍스트로 이미지 생성"
2. **좌측 옵션**:
   - 콘텐츠 유형: **일러스트레이션**
   - 종횡비: **1:1**
   - 모델: 최신 (Image 4)
   - 시각적 강도: 5–7
3. **`normal.png` 를 「스타일 참조」에 업로드** (강도 70~80%)
4. 아래 7개 프롬프트 각각 generate (4 variation씩 받고 가장 좋은 거 선택)
5. 다운로드 → `remove.bg` 로 배경 제거 → `public/bbirong/` 에 정확한 파일명으로 저장

---

## 1. `happy.png` — 체크 완료, 환호

```
The same cute otter character but with both tiny arms raised up in
joyful celebration, eyes still happy closed curves, wider open smile,
small sparkle stars floating around the face, body slightly hopping
up in mid-air, confetti dots in the background, sticker style
```

## 2. `pouting.png` — 1일 결석, 시무룩

```
The same cute otter character but with a slightly sulky pouting
expression, eyes droopy looking down sadly, small downward curve
mouth, shoulders slumped, tiny paws resting on lap, disappointed
but still cute, sticker style
```

## 3. `sad.png` — 3일 결석, 눈물

```
The same cute otter character but with a single big tear drop
rolling down one cheek, eyes closed sadly, downturned trembling
mouth, body slightly hunched, tiny paws lifted near face, gentle
melancholy, sticker style
```

## 4. `away.png` — 5일 결석, 등 돌림

```
The same cute otter character viewed completely from behind, only
the back of head, rounded ears from behind, and curled tail visible,
slightly hunched shoulders showing rejection, sitting turned away,
sticker style
```

> ⚠️ `away` 는 Style Reference가 헷갈려 할 수 있음. 강도 50~60%로 낮추거나 따로 시도.

## 5. `angry.png` — 7일 결석, 화남 (귀엽게)

```
The same cute otter character but with an adorably angry expression,
puffed up bright pink cheeks, eyes squeezed tightly shut in >_< shape,
tiny clenched fists raised on hips, small angry steam puffs above head,
cute not scary, sticker style
```

## 6. `sleep.png` — 잠 (Settings 화면)

```
The same cute otter character peacefully sleeping lying curled on its
side, eyes closed in soft happy curves, dreamy "Zzz" letters floating
above head, tail wrapped cozily around body, small smile, sticker style
```

## 7. `celebrate.png` — 7일 streak, 폭죽

```
The same cute otter character jumping high in mid-air with both arms
stretched up in victory V-pose, beaming wide open smile, confetti and
sparkle stars exploding around, tiny party hat on head, joyful
celebration, sticker style
```

---

## 다운로드 후 처리

1. 7장 모두 다운로드 (1024×1024 PNG)
2. https://www.remove.bg → 배치 업로드 → 투명 PNG 받기
3. 파일명 정확히 매칭 (대소문자 주의):
   - `happy.png` `pouting.png` `sad.png` `away.png`
   - `angry.png` `sleep.png` `celebrate.png`
4. `C:\Users\wjsrk\Desktop\루틴\public\bbirong\` 에 덮어쓰기
5. 브라우저 강제 새로고침 (Ctrl+F5)

또는 Claude한테 "마스코트 7장 다 받았어" 라고 신호 주면, `asset_add_file` 파일 피커 띄워서 한 번에 후처리(`image_remove_background` + `image_crop_and_resize`) 자동화 가능.

---

## 일관성 체크리스트

8장 모두 모은 후 확인:

- [ ] 색감 통일 — 베이지 본체 + 분홍 볼 + 갈색 윤곽
- [ ] 비율 통일 — 2.5등신 (큰 머리, 작은 몸)
- [ ] 라인 두께 비슷 — 윤곽선이 어느 한 장만 두껍거나 얇지 않은지
- [ ] 표정 디테일 — 수염 3가닥씩, 작은 코, 둥근 귀
- [ ] 스티커 스타일 — 흰 die-cut 테두리가 모두에 있는지

한 장이 튀면 그 장만 재생성. 한꺼번에 8장 깔끔하면 인스타 콘텐츠 자산으로도 바로 활용 가능.

---

*v1.1 이후 새 감정 추가 시 이 문서의 프롬프트 구조를 따라 작성.*
