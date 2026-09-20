---
name: persona-interview
description: >-
  Legacy alias для synthetic-customer critique: выявляет возражения и слабые
  места гипотезы. Это не интервью, не market evidence и не evidence выше assumption.
phase: discovery
inputs: [brief]
optional_inputs: [personas]
outputs: [synthetic_customer_critique]
gate: null
metadata:
  shelf: Продукт
  role: Симулятор критики персоны
  source: Academy of Yandex AI Studio (product_skills, yngchefcook), адаптировано
---

# Synthetic Customer Critique (legacy alias `persona-interview`)

Это synthetic critique, а не разговор с человеком. Любые реплики, оценки и
возражения — `assumption`; они формируют вопросы для field discovery, но не
доказывают спрос, willingness-to-pay или готовность к build.

## Порядок

1. Возьми персону из входа либо создай явно помеченный synthetic composite.
2. Проверь гипотезу по проблеме, текущей альтернативе, ценности и доверию.
3. Сформулируй сильные стороны, возражения, неизвестные и вопросы для реальных
   наблюдений. Не предсказывай поведение, оплату или рынок.
4. Сохрани артефакт `synthetic_customer_critique`; черновик при необходимости —
   `.process/synthetic_customer_critique_draft.md`.

```markdown
# Synthetic Customer Critique: [персона]

> Все строки synthetic; evidence level: assumption.

## Разбор
| Ось | Оценка | Почему |
| --- | --- | --- |
| Проблема | … | … |
| Альтернатива | … | … |
| Польза | … | … |
| Доверие | … | … |

## Возражения и неизвестные
- …

## Synthetic lines
> Synthetic line: «…»

## Вопросы для field discovery
- …
```

В интерактиве предложи изменить угол критики или перейти к согласованному
полевому исследованию. При оркестрации верни:

```json
{"status":"done","artifacts":["<путь synthetic_customer_critique>"],"assumptions":[],"blocking_questions":[]}
```
