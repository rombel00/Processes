# processes

Claude Code plugin marketplace с общими процессуальными скиллами для всех моих
проектов: от продуктового ресерча до разработки и запуска.

> **Идёт пересборка в единую систему.** Контракты — в
> [`ARCHITECTURE.md`](ARCHITECTURE.md), карта фаз и артефактов — в
> [`PROCESS.md`](plugins/process-core/PROCESS.md), решения по каждому скиллу — в
> [`INVENTORY.md`](INVENTORY.md), источники — в [`SOURCES.md`](SOURCES.md),
> известные пробелы — в [`GAPS.md`](GAPS.md), шаблоны — в [`templates/`](templates/).
>
> Каркас готов, плагины наполняются. Ниже — то, что уже работает.

## Плагины

### `process-core` — ставится всегда

Ядро процесса. Здесь же лежит
[карта фаз и артефактов](plugins/process-core/PROCESS.md) — она внутри плагина,
потому что читается в репозитории продукта.

- `orchestrate` — где продукт в процессе, что дальше, чего не хватает на входе;
  ведение пар producer → reviewer, лимит циклов, блокеры, `status.md`.
- `independent-review` — независимое ревью документа или кода отдельным
  субагентом перед тем, как зафиксировать шаг как готовый. Для того, у чего
  нет своего гейта.

### `product-definition` — хребет продуктовой работы

- `brief-writing` — структурированное интервью для продуктового брифа.
- `lean-canvas` — бизнес-модель продукта на одной странице.
- `user-story-mapping` — карта пользовательских историй с нарезкой на релизы.
- `release-planning` — план релизов после первого среза: темы и гипотезы,
  не задачи.
- `handoff-spec` — перевод среза `story_map` в `task_spec` на стыке с delivery.
- `retro` — что узнали после релиза, замыкает цикл обратно в `frame`/`discovery`.
- Независимые ревьюеры на каждом гейте: `brief-reviewer`, `story-map-reviewer`,
  `handoff-reviewer`.

### `product-discovery` — опционально

- `market-research` — рынок, конкуренты, провалившиеся кейсы, тренды,
  возможности для дифференциации.
- `persona-generation` — детальные профили пользователей: primary, secondary,
  anti-persona, early adopter.
- `persona-interview` — симуляция custdev-интервью с персоной, вердикт
  «купил бы / нет» и незакрытые возражения.

### `delivery` — опционально

- `architecture-design` — техническая архитектура по `task_spec`, с ревью
  на старшей модели.
- `architecture-repair` — точечная починка архитектуры по замечаниям.
- `task-planning` — раскладка на задачи, подход «сверху вниз» (заглушки → реализация).
- `implementation` — код и тесты по одной задаче, с правилом «доказательство,
  а не просто зелёный тест». Запускается субагентом (не в основной сессии
  владельца) — сам доводит задачу до вердикта `code-review`.
- `implementation-repair` — точечная починка кода по замечаниям код-ревью.
  Тоже субагент, вызывается `implementation`, не владельцем напрямую.
- `launch-check` — последняя проверка перед выпуском: доказано ли то, что
  обещано в `task_spec`, и готовность отката.

### `product-design` — опционально

- `wireframe-spec` — текстовые Unicode-вайрфреймы экранов, карта переходов.
- `information-architecture` — sitemap, навигация, user flows; по запросу
  добавляет разбор точек трения в конкретном flow (journey map) разделом
  этого же документа.

### Появится позже

`legal` — контента по-прежнему нет ни в одном источнике. Каталог заводится
вместе с содержимым, не заранее.

## Как подключить в проекте

В `.claude/settings.json` проекта:

```json
{
  "extraKnownMarketplaces": {
    "processes": {
      "source": {
        "source": "github",
        "repo": "rombel00/processes"
      }
    }
  },
  "enabledPlugins": {
    "process-core@processes": true,
    "product-definition@processes": true,
    "product-discovery@processes": true,
    "product-design@processes": true,
    "delivery@processes": true
  }
}
```

Обязателен только `process-core` + `product-definition`. Остальное — по
продукту: `product-discovery` можно не включать (без него процесс идёт, а
выводы, которые опирались бы на рыночные данные, помечаются допущениями),
`product-design` — если нужен визуал, `delivery` — если дальше `frame` дело
дойдёт до кода.

При открытии проекта Claude Code предложит установить marketplace и плагины
автоматически.
