#!/usr/bin/env bash
# Проверяет, что каждый SKILL.md несёт обязательные ключи контракта
# (ARCHITECTURE.md §3) и что скиллы не задают модель — она есть только
# у субагентов (§9).
#
# Не линтер: одна дешёвая проверка, которая ловит самый частый дефект —
# скилл, добавленный мимо контракта. Запускать в конце каждой волны.
#
#   ./scripts/check-skills.sh

set -uo pipefail
cd "$(dirname "$0")/.."

required=(name description phase inputs outputs gate)
fail=0

while IFS= read -r skill; do
    head="$(sed -n '2,/^---$/p' "$skill")"
    missing=()
    for key in "${required[@]}"; do
        grep -qE "^${key}:" <<<"$head" || missing+=("$key")
    done
    if ((${#missing[@]})); then
        echo "✗ $skill — нет ключей: ${missing[*]}"
        fail=1
    fi
    if grep -qE '^model:' <<<"$head"; then
        echo "✗ $skill — задаёт model:, но у скилла модели нет (§9)"
        fail=1
    fi
done < <(find plugins -name SKILL.md | sort)

while IFS= read -r agent; do
    grep -qE '^model:' <<<"$(sed -n '2,/^---$/p' "$agent")" \
        || { echo "✗ $agent — субагент без model:"; fail=1; }
done < <(find plugins -path '*/agents/*.md' | sort)

# Каждый идентификатор артефакта в inputs/optional_inputs/outputs должен
# существовать в реестре. Ловит опечатки и артефакты-призраки, на которые
# скилл ссылается, а произвести их некому.
registry="$(grep -oE '^\| `[a-z_]+` \|' plugins/process-core/PROCESS.md \
            | tr -d '|` ' | sort -u)"

while IFS= read -r skill; do
    head="$(sed -n '2,/^---$/p' "$skill")"
    ids="$(grep -E '^(inputs|optional_inputs|outputs):' <<<"$head" \
           | sed -E 's/^[a-z_]+: *\[?//; s/\]$//' | tr ',' '\n' | tr -d ' ')"
    for id in $ids; do
        [[ -z "$id" ]] && continue
        grep -qx "$id" <<<"$registry" \
            || { echo "✗ $skill — артефакт '$id' не значится в реестре"; fail=1; }
    done
done < <(find plugins -name SKILL.md | sort)

((fail)) && exit 1
echo "✓ контракт соблюдён: ключи на месте, артефакты есть в реестре"
