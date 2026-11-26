# Промпты для картинок (необязательно)

Игра полностью работает без картинок: всё рисуется кодом. Эти промпты нужны,
если вы захотите добавить фоны или обложку. Картинки в этой версии
**не генерировались**. Генерируйте их сами (например, в ChatGPT) и кладите
по указанным путям.

**Общий стиль для всех промптов** (добавляйте в конец каждого):

> Cinematic matte painting, mature and serious mood, no people or only distant
> tiny silhouettes, no text, no logos, no brand names, no recognizable
> landmarks or characters from existing games or films. Palette: deep violet,
> hot pink, coral, cyan neon, warm sunset gold. Soft film grain, high detail.
> Wide 16:9 composition with calm empty space in the center for interface panels.

Формат: 1920×1080, сохранить в `.webp` (качество 80) — так файл будет 150–300 КБ.

## Фоны районов → `assets/backgrounds/`

1. **coral-beach.webp** — *Coral Beach.*
   A quiet tropical beach promenade at dusk, tall palm trees along an empty
   boulevard, art-deco hotels with soft pink and turquoise neon outlines,
   calm ocean reflecting a large low sun, wet sand, a single parked classic
   convertible in the distance.

2. **downtown.webp** — *Downtown.*
   A modern business district at golden hour seen from street level, glass
   towers reflecting an orange-violet sky, empty crosswalk, palm trees in
   planters, warm office windows, light haze, serious corporate atmosphere.

3. **neon-district.webp** — *Neon District.*
   A rainy night street of a tropical city, layered neon signs without readable
   text, magenta and cyan reflections on wet asphalt, steam from vents, a
   lone sports car under a streetlight, moody noir atmosphere.

4. **airport.webp** — *International Airport.*
   A large modern airport terminal at sunrise seen through floor-to-ceiling
   windows, a long-haul airliner on the apron, an empty departures hall with
   a blank flight board, palm silhouettes outside, clean calm composition.

5. **luxury-hills.webp** — *Luxury Hills.*
   A minimalist modernist villa on a hillside above a coastal city at blue
   hour, infinity pool glowing turquoise, city lights far below, a winding
   road with light trails, restrained elegant mood.

6. **tower.webp** — *English City Tower.*
   A single futuristic skyscraper rising above a neon coastal skyline at night,
   its crown glowing hot pink, dramatic low angle, clouds lit from below,
   sense of a final challenge, epic but calm.

## Дополнительно (для постов и обложки)

Эти картинки игра сама не подхватывает. Они пригодятся для анонса в ВК или карточки игры.

7. **assets/cover.webp** — обложка для поста ВКонтакте или карточки на сайте, 1600×900.
   Top-down illustrated map of a fictional tropical coastal city at sunset:
   beach, business center, neon quarter, airport, hills and one tall tower,
   glowing roads connecting districts, ocean on the right. Leave the upper
   third clean for a title. Caption to add yourself later in an editor:
   «English City: Road to 100 Points · Английский с Ириной Александровной».

8. **Карта города для поста**, 1600×1000. Stylized flat vector map of a fictional coastal city,
   six district shapes, dark violet land, glowing cyan water lines, no labels.

9. **Машина для постов про прогресс учеников** (800×400, прозрачный фон, вид сбоку):
   An original fictional 1980s-inspired sports coupe, side view, glossy paint
   in [hot pink / cyan / gold / white / violet / mint], chrome details, no
   badges or logos, studio lighting, isolated on transparent background.

После того как положите фоны, откройте `data/missions.js` и поставьте
`useImageAssets: true`. Тогда фоны районов появятся в миссиях. Если файла
нет, игра просто покажет нарисованный фон.

## Портреты персонажей → `assets/characters/`

Каждый портрет — отдельная картинка с **одним** человеком. Пока фото нет,
в игре показываются нарисованные портреты, так что можно добавлять их
постепенно.

**Как подключить:**
1. Сгенерируйте картинку, сохраните квадрат 1024×1024 и уменьшите до 512×512
   в формате `.webp` (качество 80). Имя файла указано у каждого промпта.
2. Положите файлы в папку `assets/characters/`.
3. Впишите id персонажа в список `photoPortraits` в конце `data/characters.js`.

Уже подключены: sol, dex, ada, victor, echo, priya. Персонажи не из списка
показываются нарисованными.

**Базовый стиль** (вставляйте в начало каждого промпта):

> Photorealistic cinematic head-and-shoulders portrait of one fictional
> person, square 1:1 format, face centered in the upper half of the frame,
> looking at the camera. Shot at dusk in a neon-lit tropical coastal city:
> warm sunset key light from one side, magenta and cyan neon rim light from
> the other, softly blurred background with palm trees and city lights.
> Serious, confident, adult mood, natural skin texture, 85mm lens, shallow
> depth of field, subtle film grain. No text, no logos, no brand names.
> Not a real person or celebrity and not a character from any existing
> game or film.

Удобно сначала отправить в GPT базовый стиль, а потом по одному промпту
на персонажа.

### Сюжетные персонажи

1. **sol.webp** — Marisol “Sol” Vega, наставница, ведущая радио Sunset FM.
   A Latina woman in her mid-30s, dark hair in a high ponytail, gold hoop
   earrings, a hot-pink silk shirt, a vintage studio microphone slightly
   out of focus in the foreground. Warm, ironic half-smile, a trustworthy
   mentor.

2. **dex.webp** — Dex Navarro, уличный гонщик.
   A man in his late 20s with an undercut, black hair and a short beard,
   amber-tinted sunglasses pushed up on his head, a cyan racing jacket with
   a plain unbranded collar, a sports car's glowing headlight blurred behind
   him. Cocky but honest expression.

3. **ada.webp** — инспектор Ada Quill, детектив.
   A woman around 50 with a sharp silver-blonde bob, thin rectangular
   glasses, a dark navy trench coat over a high-collared blouse, a rainy
   neon street reflected behind her. Focused, analytical, slightly raised
   eyebrow.

4. **victor.webp** — Victor Lane, предприниматель.
   A Black man in his mid-40s, very short hair, an ivory three-piece suit
   with a gold tie, glass office towers at golden hour behind him. Calm,
   demanding, businesslike expression.

5. **echo.webp** — Echo, таинственный информатор (лицо не видно).
   A figure in a dark hooded jacket, face completely hidden in shadow behind
   a thin glowing green visor line, only the jaw outline barely visible,
   a dark alley with green neon haze. Mysterious and quiet, gender unclear.

6. **priya.webp** — офицер Priya Shah, служба аэропорта.
   A South Asian woman in her early 30s, dark hair in a neat low bun, a
   teal airport-service uniform with a plain white cap and no insignia,
   an airport terminal window with a plane at sunrise behind her. Polite but
   strict.

7. **crane.webp** — профессор Maxwell Crane, финальный соперник.
   A man around 60, swept-back silver hair, a monocle on a thin chain, a deep
   plum velvet jacket with a magenta pocket square, the top of a glowing
   skyscraper behind him at night. Theatrical, arrogant, sly smile.

### Боссы районов

8. **riptide.webp** — Rico “Riptide” Moreno, чемпион пляжа.
   A sun-tanned man in his late 20s with messy sun-bleached hair, an orange
   open short-sleeve shirt, the ocean at sunset behind him. Loud, playful
   grin.

9. **ledger.webp** — Ms. Ledger, аудитор.
   A pale woman in her 40s with an auburn bob, black-framed glasses, a charcoal
   suit with a red brooch, rows of office windows behind her. Cold, precise
   stare.

10. **glitch.webp** — Glitch, хакер-иллюзионист.
    A person in their mid-20s with spiky magenta hair and a translucent cyan
    visor, a dark techwear jacket, scrambled neon signs without readable
    letters behind them, a slight digital glitch effect on the edges.
    Enigmatic smirk.

11. **vance.webp** — капитан Vance, пилот.
    A man in his 50s with short dark-brown hair and a neat moustache, a navy
    pilot uniform with plain gold stripes and a pilot cap with no logo, a
    runway at dusk behind him. Disciplined and calm.

12. **duchess.webp** — Duchess Ambrose, хозяйка виллы.
    An elegant woman in her 60s with white hair in a sculpted updo, a pearl
    necklace, a deep violet evening dress, an infinity pool and city lights
    below a hillside villa behind her. Refined and sharp-witted.

### Персонажи игрока (выбор в меню)

Ученики видят их чаще всего, поэтому держите один стиль и одинаковое кадрирование.

13. **player-nova.webp** — Nova.
    A young woman around 20 with long dark-brown hair, a hot-pink bomber
    jacket, small gold earrings, an evening beach promenade behind her.
    Friendly, determined.

14. **player-kai.webp** — Kai.
    A young man around 20 with short black hair, a cyan windbreaker,
    sunglasses with pink lenses, a neon street behind him. Relaxed and
    confident.

15. **player-lena.webp** — Lena.
    A young woman around 20 with a golden-blonde bob, a violet hoodie,
    a mint-green scarf, palm trees at sunset behind her. Curious, bright.

16. **player-mars.webp** — Mars.
    A young Black man around 20 with short curly hair, an orange track jacket,
    a downtown crosswalk at dusk behind him. Energetic, focused.

**Проверьте каждую картинку:** на ней нет надписей и логотипов, лицо не похоже
на известного человека, в кадре один человек.
