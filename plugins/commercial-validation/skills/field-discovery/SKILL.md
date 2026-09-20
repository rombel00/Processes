---
name: field-discovery
description: >-
  Готовит и синтезирует реальное problem discovery без подмены наблюдений AI-
  материалом и без хранения PII в Git. Используй для коммерческой hypothesis.
phase: discovery
inputs: [hypothesis, evidence]
optional_inputs: [market]
outputs: [evidence]
gate: null
metadata:
  shelf: Коммерческая проверка
  role: Discovery researcher
  source: собственная методика Processes
---

# Field discovery

Подготовь guide для problem interview, recruiting options и схему обезличенных
заметок. Отделяй observation от interpretation; каждая строка evidence содержит
дату, anonymous source ID, hypothesis и уровень. Реальная речь человека —
`stated_evidence`, наблюдаемое действие — `behavioral_evidence`; synthetic lines
и выводы агента — только `assumption`. Не удаляй противоречия и не обобщай
наводящие ответы как market proof.

Агент может подготовить текст outreach, но не отправляет его и не получает
контакты без точного отдельного разрешения. PII остаётся во внешней системе;
в Git запрещены имена, email, телефоны и сырые идентификаторы. После компактных
результатов рекомендуй `continue` или fresh decision context по правилам общего
договора; build не начинай.
