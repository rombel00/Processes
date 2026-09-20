---
name: commercial-decision
description: >-
  Принимает коммерческое решение по заранее записанному порогу evidence и
  ограничивает следующую инвестицию. Используй после завершённого experiment.
phase: discovery
inputs: [hypothesis, evidence, experiments, offer]
optional_inputs: []
outputs: [commercial_decision]
gate: evidence-review
metadata:
  shelf: Коммерческая проверка
  role: Commercial decision maker
  source: собственная методика Processes
---

# Commercial decision

Прочитай `experiments` и буквально сопоставь actual observations с неизменённым
threshold. Верни `continue_discovery`, `test_offer`, `sell_manually`, `build`,
`pivot`, `pause`, `kill` или `owner_override`; не переписывай threshold после
результата и не скрывай отрицательные evidence.

Для `build` документ обязан содержать сегмент, проблему, offer, цену/price test,
evidence IDs, достигнутый threshold, неизвестное, причину выбрать код вместо
ручной проверки и maximum build cap. `owner_override` указывает причину и risk
budget. До build позови `evidence-reviewer`: см. Правила движения PROCESS.
После approved gate build всё равно требует отдельный delivery package; внешние
действия и prod не разрешаются этим verdict.
