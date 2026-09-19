# План развития репозитория Processes: от идеи и запроса до доказательств, продаж и delivery

Статус: активный change plan, готовый для передачи Codex
Целевой репозиторий: `rombel00/Processes`
Исходная точка анализа: `main`, commit `c253e35`
Редакция change plan: 1.1 — уточнены architecture impact, model routing и
регламент завершения этапа/переключения чата
Язык владельца и пользовательских ответов: русский
Жизненный цикл: до приёмки это источник scope; после приёмки поставить статус
`completed`, добавить ссылку на отчёт в `docs/validation/` и убрать его из
активных указателей. Файл не удалять и не переносить: он остаётся историей
решения, но больше не участвует в обычном старте процесса.

---

## 1. Зачем нужна правка

Текущий Processes хорошо управляет постановкой, архитектурой, реализацией,
ревью, передачей контекста и техническим выпуском. При этом он недостаточно
управляет самым ранним и самым важным риском: существует ли реальная проблема,
можно ли найти покупателя, понятен ли оффер и готов ли кто-то совершить
наблюдаемое действие или заплатить.

В результате текущий маршрут способен слишком быстро превратить сырую идею в:

`brief → lean canvas → scope → architecture → implementation → release`.

Целевой маршрут должен быть:

`intake → выбор типа работы → минимальное доказательство → решение → только затем подходящий способ исполнения`.

Для коммерческого продукта это обычно:

`идея → проблема → реальное поведение → оффер → обязательство/оплата → build → технический и коммерческий launch`.

Для внутренней бизнес-задачи, существующего продукта и личного инструмента
маршрут отличается. Процесс не должен притворяться, что всем четырём случаям
нужен один и тот же customer discovery или один и тот же набор документов.

---

## 2. Целевой результат

После изменений владелец может описать желаемый результат обычными словами.
Агент самостоятельно:

1. Определяет тип работы и уровень неопределённости.
2. Объясняет, какой маршрут предлагает и почему.
3. Выбирает минимальный следующий шаг, который снижает самый дорогой риск.
4. Не начинает разработку только потому, что владелец описал идею продукта.
5. Отделяет факты, внешние данные, слова людей, поведение, обязательства и
   AI-гипотезы друг от друга.
6. Не выдаёт синтетическую персону или симуляцию интервью за рынок.
7. Умеет довести коммерческую гипотезу до попытки продажи.
8. Умеет провести внутренний запрос без фиктивного sales-процесса.
9. Умеет доработать существующий продукт через baseline, impact и измерение
   результата.
10. Умеет построить личный инструмент по упрощённому utility-маршруту.
11. Включает полный delivery-контур только когда он оправдан.
12. Сохраняет контекст в небольшом числе канонических файлов и выдаёт готовый
    промпт для следующего чата только на реальной фазовой границе.

---

## 3. Definition of Done всей программы изменений

Изменение считается завершённым, когда выполнены все условия:

- В канонической карте процесса существуют четыре явно различимых маршрута:
  коммерческая гипотеза, конкретный бизнес-запрос, изменение существующего
  продукта, личный инструмент.
- До выбора маршрута агент не создаёт полный roadmap разработки.
- Коммерческий маршрут содержит реальные field discovery, offer test и
  попытку получить обязательство или оплату.
- Для каждого коммерческого эксперимента до запуска записаны метрика, порог,
  срок, бюджет и правило остановки.
- Architecture impact использует явную матрицу факторов и возвращает один из
  зафиксированных вердиктов; владелец не обязан сам догадываться, когда нужен
  архитектор.
- В evidence запрещено смешивать AI-generated material с реальными
  наблюдениями.
- `persona-interview` больше не выглядит как настоящее интервью и не выдаёт
  `купил бы` за рыночное доказательство.
- Для internal и personal маршрутов существуют отдельные критерии ценности,
  не требующие продажи.
- Есть лёгкий режим без architecture/delivery-гейтов.
- Есть явные условия перехода в build и high-risk production.
- Есть human escalation для auth, денег, PII, multi-tenant, пользовательских
  файлов, массовых и необратимых операций.
- Для implementation и code review закреплена risk-based матрица capability и
  её отображение на модели Codex.
- Infrastructure lifecycle явно разделяет решение, dev/test setup,
  implementation и production connection; принятие одного шага не разрешает
  следующий.
- Critical security rework получает повторную независимую проверку.
- Пользователь имеет короткий owner playbook с готовыми стартовыми промптами.
- Текущие Codex installation, approval и handoff тесты остаются зелёными.
- Добавлены автоматические тесты маршрутизации и новых evidence-контрактов.
- Добавлен CI, запускающий repository checks.
- Исторические ограничения отделены от актуальных.
- В конце каждого этапа агент обязан дать следующую рекомендацию с
  обоснованием, решить `continue / new_recommended / new_required` и выдать
  готовый prompt, если нужен новый чат.
- Сам факт смены названия этапа не требует нового чата: решение принимается по
  связности цели, состоянию контекста, независимости, модели и полномочиям.
- Все четыре контрольных сценария ниже пройдены в свежих сессиях и сохранены в
  `docs/validation/`.
- Проведён хотя бы один ограниченный пилот на реальной гипотезе; если это не
  входит в текущий пакет, отсутствие пилота явно остаётся ограничением, а не
  скрывается за зелёными contract tests.

---

## 4. Что не входит в эту программу

- Автоматическая рассылка потенциальным клиентам без отдельного разрешения.
- Хранение персональных данных респондентов и лидов в Git.
- Автоматические платежи, публикация или prod deploy.
- Разработка CRM общего назначения.
- Юридическая консультация или обещание compliance.
- Автоматическая миграция всех ранее подключённых продуктов.
- Полная перепись delivery-модуля, если его поведение не связано с новым
  lifecycle.
- Принудительное использование субагентов или максимальных моделей на каждом
  шаге.

---

## 5. Основные продуктовые решения

### 5.1. Сначала классификация работы, затем методика

Добавить четыре `work_type`:

| work_type | Когда используется | Главный риск | Основное доказательство |
|---|---|---|---|
| `commercial_hypothesis` | Новый продукт или существенная идея ради продаж | Никому не нужно / не купят | Реальное поведение и обязательство |
| `business_request` | Конкретный запрос компании или заказчика | Неверно понята задача / эффект не окупит изменение | Sponsor acceptance и измеримый business outcome |
| `existing_product_change` | Доработка работающего продукта | Регресс или отсутствие продуктового эффекта | Baseline, impact, target metric, post-change evidence |
| `personal_utility` | Инструмент для самого владельца | Потратить больше времени, чем сэкономит инструмент | Повторное личное использование и измеримая экономия |

Тип работы фиксируется в `PROJECT_PROFILE.md`. Если вход неоднозначен, агент
задаёт не более 3 вопросов и рекомендует один маршрут. Пользователь не обязан
знать внутренние названия.

### 5.2. Режим исполнения зависит от риска и зрелости

Добавить `execution_mode`:

| mode | Назначение | Типичный объём |
|---|---|---|
| `explore` | Понять проблему и неизвестные | Один hypothesis и evidence log |
| `experiment` | Получить поведенческое или коммерческое доказательство | Один эксперимент с заранее заданным порогом |
| `build` | Реализовать ограниченный подтверждённый результат | Существующий delivery по подблокам |
| `high_risk` | Деньги, auth, PII, multi-tenant, миграции, irreversible | Усиленная архитектура, security и human gate |

`execution_mode` не является глубиной церемоний. Это контракт, определяющий,
какой класс результата сейчас создаётся. Один крупный roadmap block может
последовательно пройти несколько режимов.

### 5.3. Evidence ladder

Любое существенное утверждение получает `evidence_level`:

| Уровень | Код | Что считается | Чего не доказывает |
|---:|---|---|---|
| 0 | `assumption` | Мнение владельца или агента | Ничего о рынке |
| 1 | `desk_evidence` | Публичные источники, конкурентные данные | Что конкретный клиент купит |
| 2 | `stated_evidence` | Реальный человек описал проблему или интерес | Что он изменит поведение |
| 3 | `behavioral_evidence` | Демо, регистрация, передача данных, использование | Что он заплатит |
| 4 | `commitment_evidence` | LOI, согласованный пилот, депозит, бюджет, интро ЛПР | Повторяемость продаж |
| 5 | `revenue_evidence` | Получена реальная оплата | Retention и масштабируемость |

Правила:

- AI-симуляция всегда `assumption`, даже если выглядит правдоподобно.
- Слова респондента записываются как `stated_evidence`, а не как факт о всём
  рынке.
- Каждое evidence имеет дату, источник/анонимный ID и связь с hypothesis.
- PII в Git не хранится. Контакты остаются во внешней CRM/таблице; в репозитории
  только `lead-001`, `interview-003` и обезличенные выводы.
- Агент не повышает уровень evidence на основании собственной оценки.

### 5.4. Build gate

До начала полноценной разработки коммерческого продукта должен существовать
`COMMERCIAL_DECISION.md` со статусом `build`, содержащий:

- выбранный сегмент;
- подтверждаемую проблему;
- конкретный оффер;
- цену или способ проверки цены;
- фактические evidence;
- достигнутый порог;
- что остаётся неизвестным;
- почему следующий риск дешевле проверить кодом, а не разговором/ручным
  сервисом/макетом;
- лимит следующего build-пакета.

Владелец может сознательно override этот gate. Тогда документ должен говорить:
`owner_override`, содержать причину и бюджет риска. Нельзя маскировать override
под подтверждение рынка.

Для `business_request`, `existing_product_change` и `personal_utility` действуют
собственные decision gates, описанные ниже.

### 5.5. Kill/pivot criteria обязательны до эксперимента

Каждый эксперимент до запуска фиксирует:

- hypothesis;
- аудиторию;
- действие, которое наблюдаем;
- канал;
- sample/объём попыток;
- срок;
- бюджет денег;
- бюджет времени;
- success threshold;
- inconclusive condition;
- kill/pivot condition;
- запрещённые интерпретации.

После начала эксперимента порог нельзя менять задним числом без отдельной
пометки `threshold_changed` и причины.

### 5.6. Architecture impact: агент сам определяет нужную глубину

Владелец не должен сам выбирать момент вызова архитектора. После принятого
тонкого scope, а затем после детализации каждого build-подблока агент обязан
провести impact check и показать факторы, на которых основан вывод.

Проверяются четыре группы.

**A. Состояние технического основания:**

- существует ли принятый архитектурный фундамент;
- соответствует ли он фактическому коду и окружениям;
- достаточно ли он конкретен для текущего scope;
- не помечен ли он устаревшим после прошлых изменений.

**B. Изменение технических контрактов:**

- новая сущность, схема хранения, база, object/file storage или миграция;
- новый server/runtime, background job, очередь или scheduler;
- auth, роли, permissions или tenant boundary;
- деньги, PII, чувствительные данные или пользовательские файлы;
- новая внешняя интеграция, особенно write/delete;
- публичный API, webhook или новый shared contract;
- конкурентность, повторная доставка, идемпотентность;
- массовая или необратимая операция;
- новые требования к latency, availability, объёму или стоимости;
- новый hosting/environment, domain/DNS, analytics/observability provider;
- изменение source of truth, rollback или migration strategy.

**C. Противоречия:**

- подробный сценарий требует возможности, которой нет в фундаменте;
- код и архитектурный документ расходятся;
- новое решение ломает обратную совместимость или соседний подблок;
- продуктовая развилка замаскирована под техническую реализацию.

**D. Цена ошибки и проверяемость:**

- насколько действие обратимо;
- можно ли надёжно проверить его локально/test environment;
- затрагивает ли ошибка реальных пользователей, данные, деньги или внешний
  контракт;
- сможет ли владелец заметить ошибку до ущерба.

Impact check возвращает один вердикт:

| Вердикт | Когда | Следующий шаг |
|---|---|---|
| `foundation_not_required` | Локальный/ручной результат без отдельной технической системы | Сразу к plan с записанной причиной |
| `foundation_required` | Новый build требует общей технической базы, а её ещё нет | Отдельно спроектировать минимальный фундамент |
| `covered_by_foundation` | Все факторы уже явно покрыты принятым актуальным фундаментом | Не запускать архитектора, сохранить краткое обоснование |
| `delta_required` | Меняется хотя бы один архитектурный контракт | Спроектировать только адресную дельту и провести review |
| `blocked` | Есть продуктовая/архитектурная развилка без решения или ненадёжный baseline | STOP и вопрос владельцу/восстановление baseline |

Отсутствие formal trigger не разрешает молчаливый вывод: агент сохраняет
`local-no-trigger-check` с перечислением проверенных групп. Наличие одного
trigger не всегда означает большой архитектурный документ: дельта должна быть
минимальной и касаться только реально изменяемого контракта.

Агент самостоятельно рекомендует `covered`, `delta`, `foundation` или
`blocked`. Владелец принимает бизнес-компромиссы и user-visible buy-vs-build,
но не обязан выбирать ORM, способ индексации или внутренний протокол без
рекомендации. Для каждой развилки агент показывает рекомендуемый вариант,
альтернативу, влияние на деньги/срок/риск и обратимость.

### 5.7. Обязательный регламент завершения каждого этапа

Каждый этап, даже если следующий очевиден, заканчивается компактной карточкой:

1. **Результат:** что фактически создано/изменено.
2. **DoD:** что доказано и чем.
3. **Не закрыто:** ограничения, риски и неизвестное.
4. **Рекомендация:** один следующий шаг, а не меню из всех возможных работ.
5. **Обоснование:** почему этот шаг сейчас дешевле или надёжнее альтернатив.
6. **Chat decision:** `continue`, `new_recommended` или `new_required`.
7. **Причина chat decision:** связность цели, объём/шум контекста,
   независимость, требуемая модель, изменение worktree/окружения или
   полномочий.
8. **Модель:** фактическая и рекомендуемая для следующего шага.
9. **Review/subagents:** нужны ли, зачем и лимит запусков.
10. **Разрешение:** что уже разрешено и какое новое согласие нужно.
11. **Источники:** точные пути/версии, из которых продолжать.
12. **Следующий prompt:** готовый текст для нового чата; при `continue` —
    короткая формулировка следующего действия в текущем чате.

Смена этапа сама по себе не является причиной нового чата. Hypothesis framing,
выбор первого эксперимента и подготовка его карточки обычно могут идти в одном
чате. Возврат с field results, commercial decision и thin scope также могут
остаться в одном чате, если результаты компактны, источники сохранены, контекст
не загрязнён длинной историей и независимое суждение не требуется.

`new_required` используется только когда продолжение в текущем контексте
ненадёжно или технически невозможно: нужен независимый контекст, отдельный
worktree/исполнитель, текущий контекст переполнен/скомпрометирован, изменилось
окружение без повторного bootstrap либо правила требуют отдельного
production/external-action package. Новый чат не заменяет approval и сам по
себе не является механизмом безопасности.

### 5.8. Infrastructure lifecycle: решение, test setup, код и prod разделены

Сервер, хранение, домен, аналитическая разметка и UI не должны появляться в
одном непрозрачном шаге «подключить инфраструктуру». Процесс разделяет четыре
момента.

**1. Thin scope — описать потребность, не выбрать сервис:**

- нужно ли сохранять данные и какие;
- нужен ли постоянно работающий server/background processing;
- нужны ли файлы, auth, публичный URL, платежи, email/notifications;
- какие действия и product outcomes нужно измерять;
- какие экраны/состояния обязательны.

**2. Architecture foundation/delta — принять решение:**

- runtime/hosting и границы server/client;
- database и object/file storage;
- auth provider и permission model;
- environments, secrets, CI/CD;
- domain/DNS strategy без преждевременной покупки;
- analytics provider, product event namespace и обязательные события;
- monitoring, backup/restore и rollback;
- buy-vs-build, стоимость и owner setup checklist.

**3. Dev/test setup и implementation — подключить безопасный контур:**

- создать test/dev projects и credentials;
- настроить preview environment и CI;
- применить test schema/migrations;
- реализовать API, storage, UI-разметку и analytics events текущего подблока;
- проверить соединения, permissions, события и ошибки на test data.

Setup может быть частью foundation package, если он мал и полностью разрешён,
либо отдельным пакетом. Решение об объединении агент обосновывает в
stage-completion card.

**4. Production launch — подключить боевой контур:**

- production hosting/database/storage;
- production secrets и access policy;
- domain, DNS и SSL;
- production analytics/monitoring/alerts;
- реальные email/SMS/payment providers;
- migrations, backup proof, rollback и live smoke test.

Prod никогда не разрешается фактом принятия архитектуры или test setup. Нужен
точный launch package и отдельное согласие на version/environment/config.

Действия, требующие личности владельца, оплаты, телефона, 2FA или принятия
условий сервиса, остаются за владельцем. Агент обязан дать пошаговый checklist,
проверить результат доступными read-only средствами и не просить вставлять
секреты в chat/Git.

Если под «разметкой» понимается UI, структура/состояния создаются в detailed
product/design, а HTML/CSS/components — в implementation. Если имеется в виду
analytics tagging, базовая taxonomy задаётся в architecture, события сценария
— в detailed subblock, код — в implementation, фактическое поступление — в
launch/acceptance.

---

## 6. Целевая карта процесса

### 6.1. Общий вход

1. Restore existing context, если он есть.
2. Определить `work_type`.
3. Определить текущий `execution_mode`.
4. Восстановить активные block/part/subblock, package/approval, Git/worktree и
   окружение; при новом проекте честно отметить отсутствующее.
5. Показать паспорт старта: route, mode, evidence, главный риск, фактическая и
   рекомендуемая модель, применимые модули и исключённые модули с причиной.
6. Назвать самый дорогой неизвестный риск.
7. Предложить самый дешёвый следующий результат.
8. Показать DoD, evidence, chat decision и STOP.
9. Только после согласования выполнить пакет.

### 6.2. Коммерческая гипотеза

`Intake → Problem evidence → Offer evidence → Commitment attempt → Commercial decision → Build → Technical launch + Commercial launch → Learn`.

Обязательные стопы:

- после формулировки hypothesis;
- после выбора experiment и до внешних действий;
- после получения результатов;
- перед build;
- перед любой внешней коммуникацией от имени владельца;
- перед оплатой/публикацией/prod.

### 6.3. Конкретный бизнес-запрос

`Intake → Sponsor/user clarification → Baseline → Buy/configure/build decision → Acceptance plan → Delivery → Adoption/impact check`.

Здесь нет обязательного market discovery. Нужны:

- кто sponsor;
- кто пользователь;
- какое текущее поведение или стоимость;
- какой результат считается успехом;
- ограничения данных/доступов;
- кто принимает результат;
- buy/configure/build сравнение.

### 6.4. Доработка существующего продукта

`Restore baseline → Classify request → Target metric/behavior → Product experiment or direct delivery → Architecture impact → Delivery → Post-change evidence`.

Классификация:

- bug против принятой спецификации;
- обязательное compliance/security исправление;
- usability improvement;
- продуктовая гипотеза;
- customer commitment;
- технический долг;
- инфраструктурная необходимость.

Не каждая доработка требует нового коммерческого discovery. Но продуктовая
гипотеза не должна автоматически становиться implementation request.

### 6.5. Личный инструмент

`Pain/task → Current cost → Smallest utility → Local/manual prototype → Repeated use → Keep/extend/stop`.

Критерии ценности:

- владелец использовал инструмент N раз;
- сэкономлено измеримое время;
- уменьшена частота ошибки;
- исчез повторяющийся ручной шаг;
- стоимость поддержки не превышает пользу.

Default:

- local-first;
- без auth;
- без cloud/database, если файлы достаточны;
- без multi-user;
- без analytics SaaS;
- максимум один ограниченный build package до проверки повторного использования.

---

## 7. Новые и изменённые артефакты

### 7.1. `PROJECT_PROFILE.md`

Добавить поля:

- `work_type`;
- `execution_mode`;
- кто получает ценность;
- кто принимает решение;
- кто платит, если применимо;
- текущий уровень evidence;
- лимит времени/денег до следующего решения;
- high-risk triggers;
- допустимый способ внешней коммуникации;
- где хранятся PII/лиды;
- human escalation contact/status.

### 7.2. `docs/product/HYPOTHESIS.md`

Минимальная схема:

```markdown
# Hypothesis

- ID:
- Work type:
- Segment / user:
- Situation / trigger:
- Problem / job:
- Current alternative:
- Proposed outcome:
- Offer:
- Price hypothesis:
- Riskiest assumption:
- Current evidence level:
- Cheapest next test:
- Time/money cap:
- Owner decision:
```

Один активный hypothesis по умолчанию. Остальные — в backlog.

### 7.3. `docs/product/EVIDENCE.md`

Append-only лог наблюдений:

```markdown
| ID | Date | Hypothesis | Level | Source type | Observation | Interpretation | Contradictions | PII location |
```

Правила:

- observation и interpretation — разные поля;
- AI-generated записи имеют `level=assumption`;
- реальные цитаты хранятся только обезличенно и при необходимости;
- synthesis может обновляться, исходная запись не переписывается;
- противоречащие данные не удаляются.

### 7.4. `docs/product/EXPERIMENTS.md`

Каждый эксперимент имеет immutable pre-registration и отдельный result:

```markdown
## EXP-001

### Before
- Hypothesis:
- Audience/channel:
- Action:
- Attempts/sample:
- Deadline:
- Money/time cap:
- Success threshold:
- Inconclusive:
- Kill/pivot:
- External actions requiring approval:

### After
- Actual attempts:
- Actual observations:
- Evidence IDs:
- Result: passed / failed / inconclusive
- Anomalies:
- Recommended decision:
```

### 7.5. `docs/product/OFFER.md`

- сегмент;
- проблема и ситуация;
- обещаемый измеримый результат;
- формат поставки;
- цена;
- ограничения и что не входит;
- proof/credibility;
- CTA;
- типовые возражения;
- версии оффера и результаты тестов.

### 7.6. `docs/product/COMMERCIAL_DECISION.md`

- текущий verdict: `continue_discovery`, `test_offer`, `sell_manually`,
  `build`, `pivot`, `pause`, `kill`, `owner_override`;
- какие evidence использованы;
- какие пороги достигнуты;
- что не доказано;
- максимальный следующий инвестиционный пакет;
- дата следующего решения.

### 7.7. Business request artifacts

Не создавать коммерческие файлы ради формы. Использовать:

- профиль;
- краткий `BUSINESS_OUTCOME.md` либо раздел в brief;
- baseline;
- acceptance criteria;
- adoption/impact result.

### 7.8. Personal utility artifacts

По умолчанию только:

- профиль;
- короткий hypothesis/utility contract;
- один plan;
- usage result в learnings.

Не создавать market, personas, offer и sales документы.

---

## 8. Новый модуль `commercial-validation`

Создать плагин:

```text
plugins/commercial-validation/
  .claude-plugin/plugin.json
  skills/
    hypothesis-framing/SKILL.md
    field-discovery/SKILL.md
    experiment-design/SKILL.md
    offer-and-sales/SKILL.md
    commercial-decision/SKILL.md
  agents/
    evidence-reviewer.md
  templates/
    HYPOTHESIS.md
    EVIDENCE.md
    EXPERIMENTS.md
    OFFER.md
    COMMERCIAL_DECISION.md
```

### 8.1. `hypothesis-framing`

Назначение:

- превратить сырую идею в одну проверяемую гипотезу;
- назвать неизвестные;
- выбрать riskiest assumption;
- не предлагать MVP автоматически.

Выход: `hypothesis`.

Не делает:

- рынок;
- архитектуру;
- roadmap разработки;
- persona simulation как evidence.

### 8.2. `field-discovery`

Назначение:

- составить план поиска реальных респондентов;
- подготовить problem-interview guide;
- помочь обезличить заметки;
- выделить observation отдельно от interpretation;
- обновить evidence.

Внешние сообщения и контакты — только по отдельному разрешению. Агент может
подготовить текст, но не отправляет его по умолчанию.

### 8.3. `experiment-design`

Назначение:

- выбрать самый дешёвый тест;
- оформить pre-registration;
- заранее определить success/kill thresholds;
- ограничить срок, бюджет и количество попыток;
- выбрать между интервью, fake door, landing, concierge, Wizard of Oz,
  прототипом, ручной услугой, депозитом или платным пилотом.

### 8.4. `offer-and-sales`

Назначение:

- собрать конкретный оффер;
- подготовить outreach и demo flow;
- провести владельца через попытку получить commitment;
- фиксировать причины отказа;
- не считать лайки/похвалу продажей.

Агент не принимает деньги, не обещает условия и не отправляет сообщения без
точного разрешения владельца.

### 8.5. `commercial-decision`

Назначение:

- сопоставить результаты с заранее записанными порогами;
- вынести `pass/fail/inconclusive`;
- предложить `build/pivot/pause/kill`;
- ограничить инвестицию следующего шага.

Не имеет права переписать threshold после результата.

### 8.6. `evidence-reviewer`

Свежий read-only reviewer проверяет:

- не смешаны ли AI assumptions и реальные observations;
- достигнут ли порог буквально;
- не выбран ли vanity metric;
- не сделан ли вывод по удобной части данных;
- не потеряны ли отрицательные наблюдения;
- не содержит ли Git PII;
- оправдан ли переход к следующему режиму.

Один reviewer запускается только на коммерческом decision gate, а не после
каждого интервью. Для дешёвых personal/internal маршрутов не применяется.

---

## 9. Изменения существующих модулей

### 9.1. `product-discovery`

- Оставить `market-research` как desk research с `evidence_level=desk_evidence`.
- Оставить `persona-generation` как hypothesis generation.
- Переименовать `persona-interview` в `synthetic-customer-critique` либо
  сохранить alias с deprecation notice.
- Удалить формулировки `купил бы / не купил бы`.
- Удалить `ключевые цитаты персоны` либо маркировать их как synthetic lines.
- Результат писать не в `INTERVIEWS.md`, а в
  `.process/synthetic_customer_critique.md` или отдельный committed artifact,
  который невозможно спутать с field evidence.
- В описании trigger явно написать: не использовать для подтверждения рынка,
  willingness to pay или build decision.

### 9.2. `product-definition`

- `brief-writing` не должен автоматически следовать сразу за сырой идеей.
- Для commercial hypothesis brief создаётся после минимального problem
  evidence либо как черновик с явным `unvalidated`.
- `lean-canvas` остаётся картой допущений. Его выход не разрешает build.
- Hypothesis IDs из Lean Canvas должны ссылаться на `HYPOTHESIS.md` и
  `EXPERIMENTS.md`, а не оставаться внутри таблицы без владельца.
- `retro` должен обновлять evidence/decision, если learn касается коммерческой
  гипотезы.

### 9.3. `process-core`

- В начало lifecycle добавить intake и route decision.
- Развести `technical launch` и `commercial launch`.
- В артефактный реестр добавить новые ID.
- В WORKING_AGREEMENT добавить evidence ladder, external communication и PII
  правила.
- В start passport показывать work type, mode, current evidence и главный риск.
- В start passport также показывать восстановленные block/part/subblock,
  фактическую/рекомендуемую модель, применимые и отброшенные модули с причиной,
  repo/branch/HEAD/worktree и окружение.
- В package card добавить evidence expected и investment cap.
- Закрепить architecture impact policy и пять вердиктов из §5.6.
- Ввести обязательную stage-completion card и поле `next_chat` из §5.7.
- Разрешить лёгкие пакеты без полного roadmap/immutable approval JSON, если они
  не включают внешние записи, product code, деньги, PII или prod.
- Сохранить строгий approval для writes, external actions и delivery.

### 9.4. `delivery`

- Требовать ссылку на применимый decision gate для коммерческого build.
- Для internal/personal использовать соответствующий decision source.
- Не заставлять коммерческий launch жить внутри технического `launch-check`.
- Добавить security escalation triggers.
- После thin scope и каждого подробного build-подблока выполнять architecture
  impact по §5.6; выбор архитектора делает процесс, не владелец.
- Добавить повторный независимый review после critical security/data rework.
- Закрепить отдельную матрицу моделей implementation/code review по §11.3.
- Добавить product CI baseline в implementation/launch check.

### 9.5. `product-design`

- Fake door, clickable prototype и landing page должны быть допустимыми
  experiment outputs без запуска полного application delivery.
- Дизайн эксперимента должен оптимизироваться под измерение гипотезы, а не под
  полноту будущего UI.

---

## 10. Security и human escalation

### 10.1. High-risk triggers

Любой из факторов переводит работу в `high_risk` или блокирует prod до human
review:

- реальные платежи или финансовые операции;
- auth/roles/permissions;
- PII или чувствительные данные;
- multi-tenant;
- загрузка пользовательских файлов;
- публичные write endpoints;
- сторонняя интеграция с write/delete;
- миграция реальных данных;
- массовые или необратимые операции;
- health/legal/regulatory domain;
- секреты высокой ценности;
- админские функции;
- background jobs с денежными или необратимыми последствиями.

### 10.2. Минимальный security baseline продукта

Добавить в delivery требования:

- threat sketch для high-risk;
- dependency vulnerability scan;
- secret scan;
- license scan или явная фиксация отсутствия;
- tests/lint/typecheck/build в CI;
- backup и restore proof, если есть реальные данные;
- monitoring/error reporting;
- auditability критических действий;
- data retention/deletion;
- rollback;
- повторное независимое review исправлений critical security findings.

### 10.3. Human gate

До prod агент обязан показать:

- почему human review требуется или не требуется;
- какие файлы/дифф/архитектуру должен посмотреть разработчик;
- какие вопросы остаются;
- что проверил AI и чего он не может гарантировать.

Отсутствие доступного специалиста не превращается в automatic approval.

---

## 11. Контекст, чаты, модели и субагенты

### 11.1. Когда продолжать текущий чат

Продолжать, если одновременно:

- цель и DoD пакета не изменились;
- активен тот же hypothesis, experiment, decision или build-подблок либо
  следующий этап является прямым компактным продолжением того же результата;
- контекст не заполнен большими логами/диффами;
- следующая операция уже разрешена тем же package.
- не требуется независимая оценка;
- фактическая модель подходит следующей задаче;
- внешнее состояние не изменилось так, что нужен новый bootstrap.

В одном чате по умолчанию разрешено:

- сформулировать hypothesis и подготовить карточку первого experiment;
- обработать небольшую порцию field results и принять предварительное
  решение, если observation/evidence уже сохранены в файлах;
- после compact commercial decision сформировать thin scope, если build cap и
  продуктовая граница однозначны;
- выполнить plan и несколько тесно связанных implementation tasks одного
  подблока;
- исправить обычные review findings и повторить адресные тесты.

То, что документы принадлежат разным этапам, не запрещает один чат. Важны
связность работы и качество оставшегося контекста.

### 11.2. Когда открывать новый чат

Новый чат не назначается автоматически по названию этапа. В конце каждого
этапа агент применяет §5.7 и выбирает один статус.

**`continue`:** цель связна, контекст чист, модель подходит, нового класса
полномочий и независимости нет.

**`new_recommended`:** продолжение возможно, но новый чат даст существенную
пользу. Типичные сигналы:

- накоплен большой объём field evidence, веб-источников, логов или diff;
- меняется основной тип работы: discovery → architecture, architecture →
  implementation, implementation → production launch;
- следующая задача заметно выиграет от другой модели;
- была длительная пауза или существенно изменился репозиторий/окружение;
- принят новый package с самостоятельным DoD, не являющийся прямым
  продолжением текущего.

**`new_required`:** текущий контекст нельзя считать надёжным или требуется
реально отдельная execution boundary:

- независимый reviewer должен работать в свежем контексте (обычно это
  reviewer-субагент, а не новый пользовательский чат);
- нужен отдельный пишущий исполнитель/worktree;
- контекст переполнен или содержит конфликтующие устаревшие предположения;
- bootstrap выявил смену branch/HEAD/environment, которую нельзя безопасно
  сверить в текущей задаче;
- production/external-action выполняется отдельным package и среда требует
  отдельной сессии.

Переходы `explore → experiment`, `field results → decision` и `decision → thin
scope` сами по себе **не** являются обязательной причиной нового чата. Агент
должен оценить фактический контекст и объяснить решение.

Новый чат часто рекомендуется при:

- начале нетривиального архитектурного фундамента;
- начале крупной implementation-фазы после длинного planning;
- переходе к production launch;
- длительной паузе или заметном изменении состояния репозитория;
- настолько большом диффе/логе, что он мешает удерживать цель.

Не открывать новый чат:

- после каждого вопроса;
- после одного веб-поиска;
- после каждого теста;
- между связанными задачами одного небольшого implementation package;
- только ради ритуального `fresh context`, если независимость не нужна.

### 11.3. Модели

В core хранить классы способности, а в Codex adapter — конкретное отображение:

| Capability | Codex default | Использование |
|---|---|---|
| `balanced_reasoning` | Sol | Intake, hypothesis, decomposition, synthesis, contradictions |
| `bounded_execution` | Terra | Механические правки, тесты, реализация принятого plan |
| `deep_review` | Astra | High-risk architecture/security, финальный независимый аудит |
| `fast_mechanical` | Luna при доступности | Форматирование, инвентарь, простые преобразования |

Агент всегда сообщает фактическую и рекомендуемую модель. Название модели не
должно быть частью универсального business rule.

Для Codex adapter закрепить более конкретную risk-based матрицу:

| Работа | Модель по умолчанию | Когда повысить |
|---|---|---|
| Intake, hypothesis, experiment, synthesis, thin scope | Sol / medium или high | Astra только при сложной high-stakes неоднозначности |
| Механические изменения документов/шаблонов | Terra или Luna | Sol при противоречиях между контрактами |
| Ограниченная реализация по принятому plan | Terra / medium или high | Sol для нелокальной интеграции и диагностики |
| Интеграция нескольких подблоков | Sol / high | Astra при существенной архитектурной развилке |
| Обычный whole-diff code review | Sol / high в свежем read-only контексте | Astra для большого/нелокального diff |
| Auth, деньги, PII, multi-tenant, миграции, irreversible code review | Astra / high | Human specialist перед prod по §10.3 |
| Architecture foundation/delta routine | Sol / high + независимый review по риску | Astra для high-risk architecture/security |
| Исправление review findings | Исходный исполнитель, обычно Terra/Sol | Смена модели, если finding вскрыл архитектурную развилку |
| Повторная проверка critical security/data rework | Astra / high, независимо | Human review, если prod остаётся high-risk |

Правила модели review:

- обычный bounded code review не обязан всегда использовать самую дорогую
  модель: Sol/high является нормальным default;
- reviewer работает в свежем read-only контексте и читает требования,
  архитектуру, test evidence и whole diff;
- Terra не используется как единственный независимый reviewer собственного
  Terra-кандидата по умолчанию;
- low-risk personal utility может ограничиться observed tests и
  самопроверкой, если diff мал, полностью обратим и package это явно разрешил;
- высокий риск определяется факторами, а не размером diff;
- фактическая доступность модели проверяется в начале задачи; недоступность не
  имитируется и приводит к рекомендации альтернативы/STOP, если качество
  критично.

### 11.4. Субагенты

Оправданы:

- evidence reviewer на decision gate;
- architecture/security reviewer;
- whole-diff code reviewer;
- действительно независимые исследования нескольких рынков/источников, если
  результаты можно объединить без общей области записи.

Не оправданы:

- генерация брифа;
- заполнение шаблона;
- один короткий поиск;
- написание одного письма;
- механическое обновление status;
- параллельное редактирование одних документов;
- цепочка producer → critic → critic critic без нового вида доказательства.

Default: один основной пишущий агент. Reviewer read-only. Максимальное число
reviewer-запусков фиксируется в package.

---

## 12. Owner Playbook

Создать `OWNER_PLAYBOOK.md` не длиннее примерно 250–350 строк. Он должен
объяснять только пользовательский путь, не внутреннюю архитектуру плагинов.

Обязательные разделы:

1. Что написать при первом обращении.
2. Четыре типа работы с примерами.
3. Что агент покажет до работы.
4. Какие вопросы решает владелец.
5. Что никогда не считать evidence.
6. Как выглядит experiment card.
7. Когда начинается build.
8. Когда нужен новый чат.
9. Когда нужен разработчик.
10. Как остановить работу.
11. Где лежат источники истины.
12. Четыре готовых стартовых промпта.

---

## 13. Конкретная карта изменений файлов

### Добавить

- `OWNER_PLAYBOOK.md`
- `plugins/commercial-validation/.claude-plugin/plugin.json`
- пять skills и одного reviewer из раздела 8
- пять templates из раздела 7
- `docs/examples/raw-idea-to-sale.md`
- `docs/examples/business-request.md`
- `docs/examples/existing-product-change.md`
- `docs/examples/personal-utility.md`
- `tests/commercial-validation.test.mjs`
- `tests/work-routing.test.mjs`
- `tests/context-budget.test.mjs`
- `.github/workflows/validate.yml`
- `docs/history/GAPS-legacy.md` либо другой архивный путь

### Изменить

- `README.md`
- `ARCHITECTURE.md`
- `GAPS.md`
- `INVENTORY.md`
- `SOURCES.md`
- `.claude-plugin/marketplace.json`
- `plugins/process-core/PROCESS.md`
- `plugins/process-core/WORKING_AGREEMENT.md`
- `plugins/process-core/skills/orchestrate/SKILL.md`
- `plugins/process-core/skills/orchestrate/references/delivery.md`
- `plugins/process-core/templates/PROJECT_PROFILE.md`
- `plugins/process-core/templates/ROADMAP.md`
- `plugins/process-core/templates/WORK_PACKAGE.md`
- `plugins/product-discovery/skills/persona-interview/SKILL.md` или его
  replacement/alias
- `plugins/product-discovery/skills/market-research/SKILL.md`
- `plugins/product-discovery/skills/persona-generation/SKILL.md`
- `plugins/product-definition/skills/brief-writing/SKILL.md`
- `plugins/product-definition/skills/lean-canvas/SKILL.md`
- `plugins/product-definition/skills/retro/SKILL.md`
- применимые product-design skills
- `plugins/delivery/skills/architecture-design/SKILL.md`
- security checklist
- `plugins/delivery/skills/epic-prep/SKILL.md`
- `plugins/delivery/skills/implementation/SKILL.md`
- `plugins/delivery/agents/code-reviewer.md`
- `plugins/delivery/skills/launch-check/SKILL.md`
- `adapters/codex/README.md`
- `adapters/codex/process-entry/SKILL.md`
- `adapters/codex/process-workflow/SKILL.md`
- `scripts/check-skills.sh`
- применимые существующие tests

### Не менять без отдельной причины

- Runtime hashing/installation semantics.
- Existing approval integrity guarantees.
- Existing rollback behavior.
- Claude marketplace mechanics, кроме регистрации нового плагина и
  совместимости контрактов.

---

## 14. План реализации пакетами

Не выполнять всю программу одним гигантским diff. Один активный пишущий пакет.
Каждый пакет — отдельный commit или логически чистая серия commits.

### WP0. Baseline и решения

Модель: Sol, high.
Субагенты: нет.
Изменения продукта: нет, только read-only audit и план.

Действия:

1. Прочитать AGENTS, CLAUDE, README, ARCHITECTURE, WORKING_AGREEMENT, PROCESS,
   active plans/validation.
2. Запустить существующие 23 теста, check-skills и `git diff --check`.
3. Проверить актуальный HEAD и рабочее дерево.
4. Сопоставить этот plan с текущей редакцией; перечислить расхождения.
5. Зафиксировать ADR уровня процесса:
   - четыре work types;
   - четыре execution modes;
   - evidence ladder;
   - новый модуль вместо раздувания core;
   - backwards compatibility persona skill;
   - стратегия миграции установленных проектов.
6. Представить точный scope WP1 и STOP.

DoD: владелец видит фактическое состояние, решения и первый ограниченный пакет.

### WP1. Канонический lifecycle и контракты

Модель: Sol или Astra при доступности; независимый Astra reviewer после
готового кандидата.
Область: core docs/templates, без предметных skills нового модуля.

Изменить:

- README;
- ARCHITECTURE;
- WORKING_AGREEMENT;
- PROCESS;
- PROJECT_PROFILE/ROADMAP/WORK_PACKAGE;
- artifact registry.

DoD:

- четыре routes определены без противоречий;
- gates и evidence ladder каноничны;
- architecture impact factors и пять вердиктов имеют одного канонического
  владельца и не требуют от пользователя выбирать архитектора;
- infrastructure lifecycle разделяет requirements, architecture decision,
  dev/test setup, implementation и prod connection;
- stage-completion card всегда содержит следующую рекомендацию, обоснование,
  chat decision, модель и prompt;
- текущий delivery остаётся достижимым;
- lightweight path не наследует неприменимые gates;
- external action и prod permissions не ослаблены;
- reviewer не оставляет critical findings.

### WP2. Commercial Validation plugin

Модель: Sol для смысловой реализации, Terra для механических частей.
Reviewer: один evidence/process reviewer на финальный кандидат.

Создать plugin, skills, reviewer, templates и registry wiring.

DoD:

- новый plugin устанавливается отдельно;
- outputs/inputs существуют в registry;
- synthetic evidence нельзя записать как real evidence;
- experiment требует preregistration;
- commercial decision буквально проверяет threshold;
- внешний outreach требует отдельного разрешения;
- PII в Git запрещён.

### WP3. Перестройка discovery/definition/design routing

Модель: Sol.
Reviewer: только если меняются gates или evidence semantics.

Действия:

- заменить/депрекейт persona-interview;
- связать market research с desk evidence;
- не разрешать brief/lean canvas автоматически запускать build;
- добавить experiment outputs для landing/fake door/prototype;
- адаптировать orchestrate routing.

DoD: сырая идея не попадает в architecture без decision/override.

### WP4. Codex UX и Owner Playbook

Модель: Sol, затем Terra для правок.
Субагенты: не нужны.

Действия:

- создать OWNER_PLAYBOOK;
- обновить Codex entry/workflow;
- добавить start passport полей route/mode/evidence/risk;
- добавить `next_chat: continue/new_recommended/new_required`, причины и
  готовые next-chat prompts;
- явно разрешить hypothesis → experiment, небольшие field results → decision и
  compact decision → scope в одном чате при выполнении критериев §11.1;
- конкретные модели оставить в adapter, capability classes — в core;
- добавить в adapter точную матрицу implementation/code review из §11.3;
- добавить четыре examples.

DoD: нетехнический владелец способен начать каждый сценарий одним сообщением и
понимает, почему агент остановился.

### WP5. Security и developer handoff

Модель: Astra, high.
Reviewer: независимый Astra; при critical rework — обязательная повторная
узкая проверка.

Действия:

- high-risk triggers;
- threat sketch;
- CI/security baseline;
- dependency/license/secret scanning requirements;
- backup/restore и monitoring;
- human gate;
- developer handoff checklist;
- исправить single-review rule для critical security rework.

DoD: процесс явно отличает «AI проверил» от «можно безопасно выпускать без
специалиста».

### WP6. Сокращение контекста и документации

Модель: Terra/Sol.
Reviewer: один целостный docs review, без серии critics.

Действия:

- архивировать исторический GAPS;
- устранить дублирующую нормативную прозу;
- длинные skills вынести в references;
- сделать CURRENT_LIMITATIONS;
- запретить полное чтение истории на обычном старте;
- установить проверяемые soft/hard budgets.

Предлагаемые budgets:

- owner playbook ≤ 350 строк;
- primary SKILL.md целевой размер ≤ 150 строк;
- entry skill ≤ 120 строк;
- cold start не требует чтения GAPS/INVENTORY/SOURCES;
- один canonical owner на каждое правило;
- повторение нормы в другом файле — ссылка, не копия.

### WP7. CI и автоматические проверки

Модель: Terra.
Reviewer: обычный code review.

Добавить GitHub Actions:

- Node 22;
- `node --check scripts/process.mjs`;
- `node --test tests/*.mjs`;
- `bash scripts/check-skills.sh`;
- `git diff --check` аналог или whitespace validation;
- проверка marketplace/plugin registry;
- проверка отсутствия PII-like fixture/real secrets только как ограниченный
  guard, не как обещание полного security scan.

### WP8. Сценарии и pilot

Модель: Sol для сценариев; Astra только для финального независимого аудита.

В четырёх свежих сессиях пройти сценарии из разделов 16–19. Для каждого
сохранить:

- фактический первый ответ;
- вопросы;
- route/mode;
- предложенный package;
- какие файлы читались;
- где был STOP;
- какой следующий prompt выдан;
- примерный token usage, если доступен;
- отклонения от ожидаемого поведения.

После contract scenarios выполнить один реальный ограниченный pilot без prod и
платных внешних действий, если владелец отдельно разрешит.

---

## 15. Тестовая матрица

### Routing tests

1. «Есть идея приложения для рестораторов» → commercial/explore, не build.
2. «Директор просит отчёт по просроченным счетам» → business request.
3. «В работающем SaaS добавить экспорт CSV» → existing product change.
4. «Хочу локальный трекер тренировок для себя» → personal utility.
5. Неоднозначный запрос → максимум 3 вопроса и одна рекомендация.
6. В первом ответе видны применимые и отброшенные модули с причинами.

### Architecture impact tests

1. Локальный personal script без server/storage → `foundation_not_required`.
2. Новый внешний продукт с хранением → `foundation_required`.
3. Новый UI над принятым API → `covered_by_foundation` с
   `local-no-trigger-check`.
4. Новая таблица/миграция или storage provider → `delta_required`.
5. Неопределённая permission/product policy → `blocked`, не техническая
   догадка.
6. Один trigger создаёт минимальную дельту, а не переписывает весь фундамент.

### Infrastructure lifecycle tests

1. Thin scope описывает потребность в storage/server/domain/analytics, но не
   выбирает provider молча.
2. Architecture фиксирует provider/контракты/cost/owner actions, но не получает
   prod-допуск.
3. Dev/test setup не использует production credentials.
4. UI и analytics разметка доходят до implementation и проверяются в
   acceptance.
5. Production domain/secrets/migrations требуют отдельного launch package.

### Evidence tests

1. Synthetic interview нельзя записать уровнем выше assumption.
2. Market research максимум desk evidence.
3. Реальное интервью может создать stated evidence, но не revenue.
4. Депозит создаёт commitment/revenue в зависимости от факта движения денег.
5. Negative evidence сохраняется.
6. Threshold после запуска не меняется молча.
7. PII поля не попадают в committed template.

### Gate tests

1. Commercial build без decision → blocked.
2. Owner override → разрешено только с лимитом риска и причиной.
3. Business request не требует sales evidence.
4. Personal utility не требует market/persona/offer.
5. High-risk product без human gate → prod blocked.
6. Critical security rework → second independent review required.

### Context tests

1. Cold resume читает profile, active hypothesis/package, evidence summary,
   status — не весь history.
2. Новый чат получает готовый prompt со ссылками, а не копию документов.
3. Внутренний шаг не создаёт handoff.
4. Новый route/mode создаёт checkpoint.
5. Hypothesis и карточка первого experiment могут завершиться в одном чате.
6. Небольшие field results и decision могут остаться в одном чате после записи
   evidence.
7. Смена этапа без иных факторов не создаёт `new_required`.
8. Каждый фазовый итог содержит рекомендацию, обоснование, chat decision,
   модель, разрешение и следующий prompt/действие.

### Model routing tests

1. Bounded implementation рекомендует Terra.
2. Routine whole-diff review рекомендует Sol/high в свежем контексте.
3. High-risk code/architecture review рекомендует Astra/high.
4. Critical security rework требует повторного независимого Astra review.
5. Low-risk personal utility может обоснованно отказаться от reviewer.
6. Недоступная модель не объявляется фактически выбранной.

### Backwards compatibility

1. Existing connected project на старой версии проходит doctor своей версией.
2. Новый plugin не устанавливается без выбора.
3. Старый persona skill либо мигрируется, либо даёт deprecation без silent
   semantic change.
4. Installation hashes и approvals работают как раньше.

---

## 16. Кейс 1 — владелец пришёл с сырой идеей

### Сообщение владельца

> У меня идея: сервис, который с помощью AI помогает небольшим ресторанам
> планировать закупки и меньше списывать продукты. Пока больше ничего нет.

### Ожидаемый первый ответ агента

Агент не предлагает стек, MVP и архитектуру. Он отвечает примерно так:

> Маршрут: новая коммерческая гипотеза, режим explore. Сейчас главный риск —
> не техническая реализуемость, а наличие достаточно дорогой и регулярной
> проблемы у конкретного типа ресторанов. До разработки предлагаю сформировать
> одну гипотезу и выбрать самый дешёвый способ получить внешнее доказательство.
>
> Мне не хватает трёх решений:
> 1. С кем у вас есть наиболее реальный доступ к разговору: владельцы,
>    управляющие или закупщики?
> 2. Как, по вашему предположению, они решают закупки сейчас?
> 3. Сколько времени и денег вы готовы потратить до решения «строить или нет»?
>
> Результат этого чата: HYPOTHESIS.md и план первого evidence-шага. Никакого
> кода, outreach или публикации без отдельного согласия. Рекомендованная модель:
> Sol, потому что задача — сегментация и снятие неопределённости.

### Чат 1: hypothesis framing

Что происходит:

1. Агент задаёт 2–3 вопроса за раз.
2. Формулирует один сегмент и одну проблему.
3. Отделяет знания владельца от предположений.
4. Создаёт HYPOTHESIS только после согласования package.
5. Предлагает не «создать приложение», а, например:
   - 8 problem interviews;
   - разбор фактических списаний;
   - concierge расчёт закупки вручную для 2 ресторанов.
6. В том же чате может подготовить карточку первого experiment, если
   hypothesis согласована, контекст компактный и никаких внешних действий ещё
   не выполняется.
7. Записывает time cap: например, 10 дней / 15 часов / без платных сервисов.
8. Перед outreach/интервью даёт stage-completion card по §5.7 и STOP.

Документы:

- PROJECT_PROFILE;
- HYPOTHESIS;
- пустой EVIDENCE с assumptions;
- roadmap только до ближайшего коммерческого решения, не roadmap продукта.

Следующий prompt:

> Продолжи commercial hypothesis H-001. Прочитай PROJECT_PROFILE,
> HYPOTHESIS и EVIDENCE. Подготовь один field-discovery experiment: кого искать,
> 8 вопросов без питча, правила фиксации наблюдений, success/kill thresholds,
> time cap и действия, требующие моего согласия. Ничего не отправляй. После
> карточки эксперимента остановись.

### Этап field discovery: текущий или новый чат по рекомендации агента

Модель: Sol.
Субагенты: нет.

Новый чат не обязателен только потому, что закончился hypothesis framing. Если
guide и experiment уже подготовлены, работа может продолжиться в том же чате
до внешнего STOP. Когда владелец возвращается с результатами через несколько
дней, агент выбирает:

- `continue`, если evidence компактно, сохранено и текущий контекст доступен;
- `new_recommended`, если интервью/заметок много или была длительная пауза;
- `new_required`, только если текущий контекст ненадёжен либо нужен отдельный
  независимый reviewer.

Агент готовит guide и recruiting options. Владелец проводит разговоры либо
отдельно разрешает подготовку/отправку сообщений. Заметки передаются агенту без
PII. Агент:

- выписывает наблюдения;
- не додумывает пропуски;
- отмечает противоречия;
- не суммирует «6 из 8 заинтересованы», если вопросы были наводящими;
- обновляет EVIDENCE.

Если проблема не подтверждается — commercial decision `pivot/kill`, никакого
build.

### Этап offer experiment

Смена problem evidence на offer не требует нового чата автоматически. В конце
field synthesis агент даёт рекомендацию и обоснование. Если evidence и
commercial decision компактны, OFFER и preregistration следующего experiment
можно подготовить в том же чате. Новый чат рекомендуется при большом объёме
интервью, смене модели или необходимости свежего decision context.

Агент предлагает минимальный оффер, например:

> За 7 дней вручную анализируем ваши закупки и списания, каждое утро даём
> рекомендацию. Пилот — 15 000 рублей; программное обеспечение пока не
> обещаем.

Создаёт OFFER и EXPERIMENT с порогом, например:

- 20 адресных контактов;
- 5 демо;
- 2 согласия на пилот;
- 1 оплаченный пилот;
- срок 14 дней;
- если нет ни одного demo после 20 релевантных контактов — пересобрать сегмент
  или оффер, не строить MVP.

### Этап commercial decision

Модель: Sol; один independent evidence reviewer оправдан.

Результат:

- `build`, если ручной пилот показал повторяемую часть, которую дешевле
  автоматизировать;
- `sell_manually`, если ценность есть, но автоматизация пока не главный риск;
- `pivot/kill`, если commitment отсутствует;
- `owner_override`, если владелец всё равно хочет pet project, с ограниченным
  бюджетом и честной сменой work type.

Только после `build` появляется technical scope и начинается существующий
delivery. Если решение и build cap однозначны, thin scope можно начать в том же
чате; перед архитектурой агент снова применяет §5.7 и обычно рекомендует свежий
технический чат. В любом случае переход к изменениям кода требует отдельного
delivery package, а не выводится из сохранения текущего чата.

---

## 17. Кейс 2 — конкретный запрос бизнеса

### Сообщение владельца

> Отдел продаж хочет каждое утро получать список сделок, по которым менеджер
> не связался с клиентом больше трёх дней. Данные лежат в CRM. Нужно быстро.

### Ожидаемый первый ответ агента

> Маршрут: конкретный бизнес-запрос. Рыночная проверка и попытка продажи здесь
> не нужны: есть sponsor и существующий workflow. Главные риски — правильно ли
> определено «не связался», кому можно видеть данные и действительно ли отчёт
> изменит действия менеджеров.
>
> Нужно уточнить:
> 1. Кто принимает результат и кто будет пользоваться списком?
> 2. Что считается контактом: звонок, email, задача, заметка?
> 3. Разрешён ли read-only API CRM и содержатся ли там персональные данные?
>
> Результат текущего чата: baseline, бизнес-правило, acceptance criteria и
> рекомендация buy/configure/build. До доступа к CRM и любых записей — STOP.

### Чат 1: clarification и baseline

Модель: Sol.

Агент фиксирует:

- sponsor: Head of Sales;
- users: sales managers/team lead;
- baseline: сколько просроченных follow-ups сейчас;
- outcome: доля сделок без контакта >3 дней уменьшается с X до Y;
- источник события контакта;
- права доступа;
- частота и канал отчёта;
- срок пилота;
- кто принимает.

Сначала агент сравнивает:

1. native CRM automation;
2. no-code workflow;
3. небольшой script/service.

Если штатная функция закрывает задачу, development route не запускается.

### Чат 2: implementation package

Новый чат нужен, если выбран код и принят plan. Terra подходит для ограниченной
реализации. Architecture advisor нужен только при реальных trigger: auth,
write-back, PII, shared infrastructure.

Минимальный вариант:

- read-only CRM token;
- выборка нужных полей;
- отчёт в существующий защищённый канал;
- no raw PII в логах;
- тестовые fixtures;
- feature flag или dry run;
- manual acceptance sponsor.

### После запуска

Через согласованный срок агент не спрашивает «нравится ли отчёт», а сравнивает:

- открывают ли его;
- уменьшается ли backlog;
- создаёт ли он лишний шум;
- сколько времени экономит;
- нужно ли продолжать поддержку.

Commercial artifacts не создаются. Evidence относится к business outcome.

---

## 18. Кейс 3 — доработка текущего продукта

### Сообщение владельца

> В работающем сервисе пользователи просят экспорт результатов в Excel.
> Хочу добавить.

### Ожидаемый первый ответ агента

> Маршрут: изменение существующего продукта. Сначала восстановлю baseline и
> классифицирую запрос. Фраза «пользователи просят» может означать обязательство
> перед конкретными клиентами, повторяющийся usability gap или несколько
> случайных пожеланий. От этого зависит, нужно ли сразу delivery или сначала
> небольшой product experiment.
>
> Уточните:
> 1. Сколько уникальных клиентов просили экспорт и что они делают без него?
> 2. Есть ли клиентское обязательство/сделка, зависящая от этой функции?
> 3. Какие данные могут попасть в файл и насколько они чувствительны?

### Чат 1: baseline и классификация

Агент сначала читает существующие profile/roadmap/status/product docs/code и
не проводит onboarding заново.

Варианты:

- Один крупный клиент подписал пилот при условии экспорта → commitment evidence,
  можно готовить ограниченный delivery.
- 12 пользователей регулярно вручную копируют таблицу → behavioral evidence.
- Два ответа в support без понятного use case → сначала уточнение сценария.
- Экспорт уже был в принятой спецификации и сломан → bug route.

Фиксируются:

- target behavior;
- данные/permissions;
- формат и ограничения;
- success metric;
- влияние на retention/revenue/workflow;
- baseline текущего обходного пути.

### Чат 2: детальный product subblock

После продуктового решения:

- story/edge cases;
- кто может экспортировать;
- какие поля;
- локаль/таймзона;
- большие объёмы;
- формулы/CSV injection;
- PII;
- audit event;
- empty/error states;
- acceptance.

Затем impact check. Не строить новый фундамент, если существующий покрывает
изменение.

### Чат 3: implementation

Terra при локальном принятом plan. Один whole-diff reviewer. Если reviewer
находит critical security issue, исправление получает повторную узкую
независимую проверку.

### Чат 4 или возврат в текущий product chat: impact

После релиза:

- adoption экспорта;
- completion/error rate;
- изменение support load;
- влияние на оговорённую сделку/retention;
- новые ограничения.

Если технический результат готов, но продуктовая метрика не изменилась,
эпик не объявляется коммерчески успешным.

---

## 19. Кейс 4 — продукт для себя

### Сообщение владельца

> Хочу сделать для себя приложение, которое собирает мои заметки о книгах и
> раз в неделю напоминает, какие идеи я хотел попробовать.

### Ожидаемый первый ответ агента

> Маршрут: личный инструмент, режим explore с быстрым переходом к ограниченному
> build. Продажи, рынок и персоны не нужны. Главный риск — построить систему,
> которую вы не будете регулярно использовать, или создать больше поддержки,
> чем пользы.
>
> Предлагаю сначала определить текущий способ, минимальный weekly loop и лимит
> первой версии. По умолчанию рекомендую local-first без аккаунтов, сервера и
> отдельной базы, если это возможно.
>
> Три вопроса:
> 1. Где заметки находятся сейчас?
> 2. На каком устройстве вы реально будете разбирать напоминание?
> 3. Что должно произойти три недели подряд, чтобы вы сказали «полезно»?

### Один planning chat

Модель: Sol или Terra, в зависимости от ясности.

Фиксируется utility contract:

- импортировать заметки из одного источника;
- выбрать идеи со статусом `try`;
- раз в неделю сформировать один digest;
- дать отметить `done/snooze/drop`;
- успех: владелец просмотрел digest 3 недели подряд и выполнил хотя бы одну
  идею;
- build cap: один выходной / один package;
- не входит: социальные функции, рекомендации AI, cloud sync, mobile apps.

### Implementation

Если решение локальное и небольшое, plan и implementation могут остаться в
одном чате, если пакет уже согласован и контекст чистый. Новый чат нужен, когда
planning был длинным или начались большие логи/диффы.

Default stack выбирается по минимальной поддержке. Например:

- существующая automation platform;
- локальный script;
- scheduled task;
- один Markdown/SQLite файл;
- email/notification через уже используемый сервис.

Не добавлять auth, сервер, analytics и многопользовательскую архитектуру.

### Проверка

Через 3 недели:

- использовался ли digest;
- сколько времени заняла поддержка;
- какие шаги раздражают;
- стоит ли сохранить, расширить или удалить.

Если инструмент не используется, decision `stop`, а не новый feature roadmap.

---

## 20. Готовый стартовый промпт для Codex, реализующего этот change plan

Передать Codex этот файл и следующий текст:

```text
Работаем в репозитории rombel00/Processes.

Прочитай полностью AGENTS.md и указанные им канонические источники. Затем
прочитай приложенный файл processes-commercial-validation-change-plan.md.

Это целевая change specification, но не безусловное разрешение переписать весь
репозиторий одним проходом. Начни с WP0 в read-only режиме:

1. Покажи фактические cwd, repo, branch, HEAD и состояние рабочего дерева.
2. Запусти текущие штатные проверки без изменений.
3. Сопоставь change plan с актуальным main и перечисли конфликты, устаревшие
   предположения и решения, которые нужно подтвердить.
4. Предложи точный WP1: файлы, изменения, DoD, тесты, модель, reviewer,
   разрешённые Git-действия и STOP.
5. Не редактируй файлы, не создавай ветку, не запускай субагентов, не делай
   commit/push/PR, пока я явно не согласую WP1.

Общие ограничения программы:

- один пишущий исполнитель по умолчанию;
- не выполнять WP1–WP8 одним diff;
- сохранять существующие installation/approval/handoff guarantees;
- не мигрировать подключённые продукты автоматически;
- synthetic evidence никогда не считать market evidence;
- не хранить PII респондентов/лидов в Git;
- внешний outreach, платные действия, публикация и prod — только по отдельному
  точному разрешению;
- после каждого work package предъявлять diff, проверки, ограничения и
  следующий рекомендуемый пакет, затем STOP.

Рекомендованная модель для WP0: Sol/high. Для независимого финального review
WP1, WP2 и WP5 предлагай Astra, но не запускай без разрешения.
```

---

## 21. Порядок приёмки владельцем

Перед одобрением каждого WP владелец должен увидеть одну карточку:

- зачем пакет нужен;
- какие файлы меняются;
- что пользователь сможет делать после него;
- что ещё не заработает;
- что считается DoD;
- какие проверки будут выполнены;
- нужен ли reviewer и почему;
- сколько отдельных модельных запусков максимум;
- где STOP;
- какие Git/external действия разрешаются.

После выполнения:

- summary результата;
- фактический diff scope;
- результаты tests/checks;
- reviewer verdict, если применимо;
- найденные ограничения;
- обновлённый current status;
- следующий пакет;
- готовый prompt следующего чата.

Приёмка одного WP не разрешает следующий.

---

## 22. Критерий успеха новой версии Processes

Новая версия успешна не потому, что в ней стало больше skills и документов.
Она успешна, если:

- сырая коммерческая идея реже превращается в преждевременный MVP;
- владелец быстрее получает отрицательное или положительное рыночное
  доказательство;
- внутренние и личные задачи проходят более короткий путь;
- AI-generated материал невозможно перепутать с голосом клиента;
- число обязательных чатов, файлов и reviewer-вызовов пропорционально риску;
- после подтверждения спроса delivery остаётся таким же восстановимым и
  контролируемым;
- разработчик может принять проект без чтения истории чатов;
- high-risk продукт не попадает в prod только на основании согласия нескольких
  AI-агентов.
