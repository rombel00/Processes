# processes

Claude Code plugin marketplace с общими процессуальными скиллами для всех
моих проектов: продакт-ресерч, продуктовая проработка и delivery-процессы.

Один плагин — `product-process` (см. `plugins/product-process/`), в нём
скиллы:

- `brief-writing` — структурированное интервью для продуктового брифа.
- `lean-canvas` — бизнес-модель продукта на одной странице.
- `user-story-mapping` — карта пользовательских историй с нарезкой на релизы.
- `market-research` — исследование рынка: конкуренты, похожие/провалившиеся
  кейсы, тренды, возможности для дифференциации.
- `cto-review` — независимое ревью документа/кода перед тем, как
  зафиксировать шаг как готовый.

Источник первых четырёх скиллов — см. `plugins/product-process/SOURCE.md`.
`cto-review` — собственная разработка.

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
    "product-process@processes": true
  }
}
```

При открытии проекта Claude Code предложит установить marketplace и плагин
автоматически.
