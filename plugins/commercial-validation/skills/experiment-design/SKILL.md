---
name: experiment-design
description: >-
  Регистрирует ограниченный коммерческий experiment с наблюдаемым действием,
  порогом и kill rule до его запуска. Используй перед любым offer test.
phase: discovery
inputs: [hypothesis, evidence]
optional_inputs: [market]
outputs: [experiments]
gate: null
metadata:
  shelf: Коммерческая проверка
  role: Experiment designer
  source: собственная методика Processes
---

# Experiment design

Выбери самый дешёвый test рискового допущения: interview, fake door, landing,
concierge, Wizard of Oz, prototype, ручная услуга, депозит или paid pilot.
До запуска неизменно заполни `experiments`: hypothesis, audience/channel,
наблюдаемое action, attempts/sample, deadline, money/time cap, success threshold,
inconclusive rule, kill/pivot rule и запрещённые интерпретации.

После начала не меняй threshold задним числом: нужна явная отметка
`threshold_changed` с причиной. Текст, landing и prototype не дают полномочия
на публикацию, outreach, оплату или обработку PII. Покажи нужный точный допуск
для каждого такого действия и остановись до него.
