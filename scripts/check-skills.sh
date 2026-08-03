#!/usr/bin/env bash
# Проверяет, что каждый SKILL.md несёт обязательные ключи контракта
# (ARCHITECTURE.md §3), что скиллы не задают модель — она есть только
# у субагентов (§9), что plugins/ и marketplace.json не разошлись, и что
# правка replaces: (доменный пак, §1) внесена симметрично.
#
# Не линтер: набор дешёвых проверок, которые ловят самый частый класс
# дефекта — правку контракта в одном месте без парной правки в соседнем
# (см. GAPS.md — этот паттерн повторялся во всех пяти кругах доп-ревью
# после Шага 6). Запускать после правки любого SKILL.md, plugin.json или
# marketplace.json, и в конце каждой волны.
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
    # Скилл с непустым gate: обязан нести инструкцию, как его вести
    # (PROCESS.md, «Правила движения» п.3) — иначе продюсер называет гейт и
    # замолкает, а записать вердикт и посчитать цикл в моменте некому.
    gate_value="$(grep -E '^gate:' <<<"$head" | sed -E 's/^gate: *//')"
    if [[ -n "$gate_value" && "$gate_value" != "null" ]] && ! grep -q 'Правила движения' "$skill"; then
        echo "✗ $skill — gate: $gate_value, но нет ссылки на «Правила движения» (кто ведёт гейт)"
        fail=1
    fi
done < <(find plugins -name SKILL.md | sort)

while IFS= read -r agent; do
    head="$(sed -n '2,/^---$/p' "$agent")"
    grep -qE '^model:' <<<"$head" \
        || { echo "✗ $agent — субагент без model:"; fail=1; }
    # Ревьюер, который по контракту пишет review_file (ARCHITECTURE.md §6),
    # не может это сделать без Write в allow-list tools: — весь механизм
    # гейта тогда без следа на диске.
    if grep -q 'review_file' "$agent" && ! grep -qE '^tools:.*\bWrite\b' <<<"$head"; then
        echo "✗ $agent — пишет review_file, но tools: не содержит Write"
        fail=1
    fi
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

# Ориентир по размеру (ARCHITECTURE.md §10) — предупреждение, не блокер:
# «~150» намеренно приблизительно, разбивка на references/*.md — по смыслу,
# не по счётчику строк.
while IFS= read -r skill; do
    lines=$(wc -l < "$skill")
    if ((lines > 150)); then
        echo "⚠ $skill — $lines строк, ориентир ARCHITECTURE.md §10 ~150"
    fi
done < <(find plugins -name SKILL.md | sort)

# plugins/ и marketplace.json — один и тот же список в обе стороны.
# Ровно тот дефект, что вручную нашёлся и чинился при удалении game-design:
# каталог убрали, а запись (или наоборот) забыли.
mp_dirs="$(grep -oE '"source": *"\./plugins/[A-Za-z0-9_-]+"' .claude-plugin/marketplace.json \
           | sed -E 's#.*/plugins/##; s/"$//' | sort -u)"
disk_dirs="$(find plugins -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -u)"

while IFS= read -r d; do
    [[ -z "$d" ]] && continue
    grep -qx "$d" <<<"$mp_dirs" \
        || { echo "✗ plugins/$d — есть каталог, но нет записи в marketplace.json"; fail=1; }
done < <(echo "$disk_dirs")

while IFS= read -r name; do
    [[ -z "$name" ]] && continue
    [[ -d "plugins/$name" ]] \
        || { echo "✗ marketplace.json — плагин \"$name\" указан, но plugins/$name не существует"; fail=1; }
done < <(echo "$mp_dirs")

# Имя в plugin.json совпадает и с каталогом, и с marketplace.json —
# три копии одного факта, которые молча разойдутся, если сверять нечему.
while IFS= read -r pj; do
    dir="$(basename "$(dirname "$(dirname "$pj")")")"
    name="$(grep -m1 -oE '"name": *"[A-Za-z0-9_-]+"' "$pj" | sed -E 's/.*"([A-Za-z0-9_-]+)"$/\1/')"
    if [[ "$name" != "$dir" ]]; then
        echo "✗ $pj — name \"$name\" не совпадает с каталогом plugins/$dir"
        fail=1
    fi
done < <(find plugins -path '*/.claude-plugin/plugin.json' | sort)

# replaces: (доменный пак, ARCHITECTURE.md §1 / SKILL_TEMPLATE.md) должно
# быть внесено в оба description сразу. Одностороннюю правку уже находили и
# чинили один раз (GAPS.md) — второй раз находить дороже.
while IFS= read -r skill; do
    head="$(sed -n '2,/^---$/p' "$skill")"
    replaces="$(grep -E '^replaces:' <<<"$head" | sed -E 's/^replaces: *//')"
    [[ -z "$replaces" ]] && continue
    this_name="$(grep -E '^name:' <<<"$head" | sed -E 's/^name: *//')"
    target="$(find plugins -path "*/skills/$replaces/SKILL.md" | head -1)"
    if [[ -z "$target" ]]; then
        echo "✗ $skill — replaces: $replaces, но такого скилла нет"
        fail=1
        continue
    fi
    target_head="$(sed -n '2,/^---$/p' "$target")"
    grep -q "$this_name" <<<"$target_head" \
        || { echo "✗ $skill — replaces: $replaces, но description $target не упоминает \"$this_name\" (односторонняя правка)"; fail=1; }
done < <(find plugins -name SKILL.md | sort)

((fail)) && exit 1
echo "✓ контракт соблюдён: ключи, размер, marketplace.json и replaces: на месте"
