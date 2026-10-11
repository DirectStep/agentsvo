import { useEffect, useRef, useState, type FormEvent } from 'react';

// ===== DATA =====

type CommercialObject = {
  id: number;
  title: string;
  location: string;
  type: 'Аренда' | 'Продажа' | 'Управление';
  price: string;
  rent: string;
  area: string;
  tenant: string;
  rentalYield: string;
  appreciation: string;
  totalPotential: string;
  payback: string;
  risk: string;
  status: string;
  tags: string[];
  categories: string[];
  visual: 'street' | 'office' | 'warehouse' | 'retail' | 'plan' | 'corner';
};

const PHONE = { display: '8 (900) 000-00-00', href: 'tel:+79000000000' };

const NAV_LINKS = [
  { label: 'Собственникам', href: '#owners' },
  { label: 'Управление', href: '#management' },
  { label: 'Инвесторам', href: '#investors' },
  { label: 'Объекты', href: '#objects' },
  { label: 'Контакты', href: '#contacts' },
];

const TICKER_ITEMS = [
  'только коммерческие объекты',
  'расчет доходности',
  'аренда',
  'продажа',
  'управление',
  'проверка договора',
  'КУ и риски',
  'подбор помещений',
];

const SCENARIOS = [
  {
    label: 'Инвестору',
    title: 'Купить доходный объект',
    price: 'фикс + 2-3% от покупки',
    items: [
      'подберем варианты под бюджет и целевую доходность',
      'посчитаем NOI, окупаемость и ставку капитализации',
      'проверим арендатора, договор и КУ',
      'подготовим аргументы для торга',
      'после покупки можем взять объект в управление',
    ],
    cta: 'Подобрать объект',
  },
  {
    label: 'Собственнику',
    title: 'Сдать или продать помещение',
    price: '2-4% от сделки · 5-10% с аренды',
    items: [
      'определим рыночную ставку и справедливую цену',
      'упакуем объект: фото, планировка, объявление, презентация',
      'найдем арендатора или покупателя',
      'проведем переговоры по ставке и условиям',
      'закрепим условия через эксклюзив и договор',
    ],
    cta: 'Оценить объект',
  },
  {
    label: 'Бизнесу',
    title: 'Найти помещение под точку',
    price: 'подбор 5-10 вариантов',
    items: [
      'сравним локации, трафик и ставки',
      'посчитаем полную нагрузку: аренда, КУ, ремонт, депозит',
      'проверим договор аренды и ограничения',
      'подберем варианты под формат бизнеса',
      'поможем договориться по ставке и срокам',
    ],
    cta: 'Найти помещение',
  },
];

const FILTERS = ['Все', 'Аренда', 'Продажа', 'С арендатором', 'Под управлением', 'Инвестиционные'];

const OBJECTS: CommercialObject[] = [
  {
    id: 1,
    title: 'Стрит-ритейл 84 м²',
    location: 'Московский проспект',
    type: 'Продажа',
    price: '9,8 млн ₽',
    rent: '95 000 ₽/мес',
    area: '84 м²',
    tenant: 'ПВЗ / услуги',
    rentalYield: '11,6%',
    appreciation: 'до 12%',
    totalPotential: 'до 23,6%',
    payback: '8,6 года',
    risk: 'Средний',
    status: 'с арендатором',
    tags: ['первая линия', 'витрина', 'трафик'],
    categories: ['Продажа', 'С арендатором', 'Инвестиционные'],
    visual: 'street',
  },
  {
    id: 2,
    title: 'Офисный блок 156 м² с арендатором',
    location: 'ул. Свободы, деловой район',
    type: 'Продажа',
    price: '18,4 млн ₽',
    rent: '142 000 ₽/мес',
    area: '156 м²',
    tenant: 'Юридическая компания',
    rentalYield: '9,3%',
    appreciation: 'до 9%',
    totalPotential: 'до 18,3%',
    payback: '9,8 года',
    risk: 'Средний',
    status: 'с арендатором',
    tags: ['деловой район', 'отдельный вход', 'парковка'],
    categories: ['Продажа', 'С арендатором', 'Инвестиционные'],
    visual: 'office',
  },
  {
    id: 3,
    title: 'Складской комплекс 640 м²',
    location: 'Тутаевское шоссе, промзона',
    type: 'Аренда',
    price: '31,2 млн ₽',
    rent: '260 000 ₽/мес',
    area: '640 м²',
    tenant: '—',
    rentalYield: '12,4%',
    appreciation: 'до 6%',
    totalPotential: 'до 18,4%',
    payback: '7,9 года',
    risk: 'Средний',
    status: 'своб.',
    tags: ['логистика', 'подъездные пути', 'охрана'],
    categories: ['Аренда'],
    visual: 'warehouse',
  },
  {
    id: 4,
    title: 'Помещение 62 м² под управлением',
    location: 'ул. Чехова',
    type: 'Управление',
    price: '7,9 млн ₽',
    rent: '88 000 ₽/мес',
    area: '62 м²',
    tenant: 'Аптека',
    rentalYield: '13,4%',
    appreciation: 'до 8%',
    totalPotential: 'до 21,4%',
    payback: '7,4 года',
    risk: 'Низкий',
    status: 'под управлением',
    tags: ['аптечная сеть', 'угловой вход', 'высокий трафик'],
    categories: ['Аренда', 'Под управлением', 'С арендатором', 'Инвестиционные'],
    visual: 'plan',
  },
  {
    id: 5,
    title: 'Угловое здание 310 м²',
    location: 'пр-т Ленина, угол',
    type: 'Продажа',
    price: '34,6 млн ₽',
    rent: '310 000 ₽/мес',
    area: '310 м²',
    tenant: '—',
    rentalYield: '10,7%',
    appreciation: 'до 14%',
    totalPotential: 'до 24,7%',
    payback: '9,1 года',
    risk: 'Средний',
    status: 'своб.',
    tags: ['угловой фасад', 'две витрины', 'высокий трафик'],
    categories: ['Продажа', 'Инвестиционные'],
    visual: 'corner',
  },
  {
    id: 6,
    title: 'Стрит-ритейл 98 м² с арендатором',
    location: 'Волжская набережная',
    type: 'Продажа',
    price: '12,6 млн ₽',
    rent: '118 000 ₽/мес',
    area: '98 м²',
    tenant: 'Кафе',
    rentalYield: '11,2%',
    appreciation: 'до 15%',
    totalPotential: 'до 26,2%',
    payback: '8,9 года',
    risk: 'Средний',
    status: 'с арендатором',
    tags: ['набережная', 'туристический трафик', 'летняя веранда'],
    categories: ['Продажа', 'С арендатором', 'Инвестиционные'],
    visual: 'retail',
  },
];

const OWNER_STAT = {
  value: '+7%',
  label: 'средний рост ставки при активном управлении и индексации',
};

const OWNER_BENEFITS = [
  'Аудит ставки и КУ за 2-3 дня',
  'Поиск арендатора без вашего участия',
  'Контроль платежей, индексация, документы',
];

const INVESTOR_STAT = {
  value: '8-14%',
  label: 'диапазон расчетной доходности по объектам в работе*',
};

const INVESTOR_BENEFITS = [
  'Проверяем локацию, трафик и арендатора',
  'Считаем NOI, окупаемость и риски',
  'Расчет до сделки, а не после',
];

const MGMT_FEATURES = [
  'Контроль платежей и просрочек',
  'Расчет и проверка КУ',
  'Переговоры с арендаторами',
  'Индексация ставки',
  'Акты, допсоглашения, документы',
  'Поиск замены при съезде',
];

const MGMT_REPORT_ROWS = [
  { label: 'Начислено', value: '180 000 ₽' },
  { label: 'Получено', value: '180 000 ₽' },
  { label: 'КУ', value: '24 000 ₽' },
  { label: 'Чистый поток', value: '156 000 ₽' },
  { label: 'Просрочка', value: '0 ₽' },
  { label: 'Следующая индексация', value: 'через 3 месяца' },
];

const ARTICLES = [
  'Как понять, что ставка аренды занижена',
  'Почему КУ съедают доходность',
  'Какая доходность нормальна для коммерции в Ярославле',
  'Что проверить перед покупкой помещения с арендатором',
];

const TRUST_STATS = [
  { value: '18 объектов', label: 'в работе и анализе' },
  { value: '2 400 м²', label: 'коммерческих площадей' },
  { value: '1,2 млн ₽/мес', label: 'расчетный арендный поток' },
  { value: '0 ₽', label: 'просрочек по объектам под управлением' },
  { value: '8-14%', label: 'диапазон расчетной доходности по объектам' },
];

const FAQ = [
  {
    q: 'Вы занимаетесь жилой недвижимостью?',
    a: 'Нет. Фокус - нежилые помещения: стрит-ритейл, офисы, склады, помещения под ПВЗ, услуги, медицину и общепит.',
  },
  {
    q: 'Вы гарантируете доходность?',
    a: 'Нет. Мы показываем расчетный сценарий: аренда, расходы, окупаемость, риски и потенциал изменения стоимости. Решение принимает инвестор.',
  },
  {
    q: 'Можно передать объект только в управление?',
    a: 'Да. Управление включает контроль платежей, КУ, индексацию, документы и коммуникацию с арендаторами.',
  },
  {
    q: 'Берете ли объект без эксклюзива?',
    a: 'Для продажи - нет, нужен эксклюзив минимум на 60 дней. Для аренды условия обсуждаются по объекту.',
  },
  {
    q: 'Сколько стоит оценка объекта?',
    a: 'Быстрый скрининг - от 15 000 ₽. Полный отчет с выездом и расчетом - дороже, зависит от объекта.',
  },
];

const FOOTER_SECTIONS = [
  { label: 'Объекты', href: '#objects' },
  { label: 'Собственникам', href: '#owners' },
  { label: 'Инвесторам', href: '#investors' },
  { label: 'Управление', href: '#management' },
];

const FOOTER_SERVICES = [
  { label: 'Сдать помещение', href: '#services' },
  { label: 'Продать объект', href: '#services' },
  { label: 'Оценить объект', href: '#services' },
  { label: 'Управление арендой', href: '#services' },
  { label: 'Инвест-подбор', href: '#services' },
];

// ===== HEADER =====

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="logo">
          <img className="logo__mark" src="/yaroslavl-bear-2.png" alt="" aria-hidden="true" />
          <span className="logo__word">
            <span>Первый</span>
            <span>Нежилой</span>
            <span className="logo__city">Ярославль</span>
          </span>
        </a>

        <nav className="nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a className="nav__link" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a className="phone-link" href={PHONE.href}>
            {PHONE.display}
          </a>
          <a className="btn btn--primary header__cta" href="#contacts">
            Оставить заявку
          </a>
        </div>

        <button
          type="button"
          className={`burger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="burger__line" />
          <span className="burger__line" />
          <span className="burger__line" />
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {NAV_LINKS.map((link) => (
            <a
              className="mobile-nav__link"
              href={link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a className="phone-link mobile-nav__phone" href={PHONE.href}>
            {PHONE.display}
          </a>
          <a
            className="btn btn--primary mobile-nav__cta"
            href="#contacts"
            onClick={() => setMenuOpen(false)}
          >
            Оставить заявку
          </a>
        </nav>
      )}
    </header>
  );
}

// ===== PROMO TICKER =====

function PromoTicker() {
  const track = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {track.map((item, i) => (
          <span className="ticker__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== HERO =====

const HERO_FACTS = [
  {
    label: 'Фокус',
    value: 'только нежилые помещения',
    text: 'стрит-ритейл, офисы, склады, помещения под арендатора',
  },
  {
    label: 'Модель',
    value: 'аренда · продажа · управление',
    text: 'не просто показы, а работа с доходом объекта',
  },
  {
    label: 'Расчет',
    value: 'ставка · КУ · NOI · риски',
    text: 'цифры до переговоров, а не после сделки',
  },
];

const HERO_ROTATING_CASES = [
  {
    title: 'Помещение 128 м²',
    location: 'центр Ярославля',
    lon: 39.8845,
    lat: 57.6261,
    rent: '165 000 ₽/мес',
    utilities: '24 000 ₽/мес',
    netRent: '141 000 ₽/мес',
    price: '16,8 млн ₽',
    yield: '11,8%*',
    appreciation: '+7%',
    total: '18,8%*',
    tags: ['витрина', 'первая линия', 'трафик', 'отдельный вход'],
  },
  {
    title: 'Складской комплекс 640 м²',
    location: 'Тутаевское шоссе',
    lon: 39.79,
    lat: 57.68,
    rent: '260 000 ₽/мес',
    utilities: '38 000 ₽/мес',
    netRent: '222 000 ₽/мес',
    price: '31,2 млн ₽',
    yield: '12,4%*',
    appreciation: '+6%',
    total: '18,4%*',
    tags: ['логистика', 'подъездные пути', 'охрана'],
  },
  {
    title: 'Помещение 62 м² под управлением',
    location: 'ул. Чехова',
    lon: 39.869,
    lat: 57.618,
    rent: '88 000 ₽/мес',
    utilities: '13 000 ₽/мес',
    netRent: '75 000 ₽/мес',
    price: '7,9 млн ₽',
    yield: '13,4%*',
    appreciation: '+8%',
    total: '21,4%*',
    tags: ['аптечная сеть', 'угловой вход', 'высокий трафик'],
  },
];

const HERO_TITLE_WORDS = ['Управление', 'коммерческой', 'недвижимостью', 'Ярославле'];

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div>
          <h1 className="h1 hero__title">
            {HERO_TITLE_WORDS.map((word, i) => (
              <span key={word}>
                <span className="hero__title-word" style={{ animationDelay: `${i * 2}s` }}>
                  {word}
                </span>
                {i === 2 ? ' в ' : i < HERO_TITLE_WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="body-text hero__subtitle">
            А также: продажа, покупка и подбор нежилых помещений под бизнес. Считаем арендный
            поток, КУ, окупаемость, риски договора и потенциал повышения ставки.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--primary" href="#contacts">
              Получить расчет объекта
            </a>
            <a className="btn btn--ghost" href="#objects">
              Смотреть объекты
            </a>
          </div>
          <div className="hero__stats">
            {HERO_FACTS.map((fact) => (
              <div className="hero__stat" key={fact.label}>
                <span className="hero__stat-label">{fact.label}</span>
                <span className="hero__stat-value">{fact.value}</span>
                <span className="hero__stat-text">{fact.text}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroCalcCard />
      </div>
    </section>
  );
}

function HeroCalcCard() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function switchTo(next: number) {
    indexRef.current = next;
    setFading(true);
    window.setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, 350);
  }

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timerRef.current = setInterval(() => {
      switchTo((indexRef.current + 1) % HERO_ROTATING_CASES.length);
    }, 10000);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDotClick(i: number) {
    if (i === index) return;
    switchTo(i);
    startTimer();
  }

  const item = HERO_ROTATING_CASES[index];

  return (
    <div className="hero-card">
      <img
        className="hero-card__watermark"
        src="/yaroslavl-bear.webp"
        alt=""
        aria-hidden="true"
      />
      <div className="eyebrow hero-card__eyebrow">Пример расчета объекта</div>

      <div className={`hero-card__content${fading ? ' is-fading' : ''}`}>
        <h2 className="hero-card__title">
          {item.title} · {item.location}
        </h2>

        <iframe
          className="hero-card__map"
          src={`https://yandex.ru/map-widget/v1/?ll=${item.lon}%2C${item.lat}&z=15&l=map&pt=${item.lon},${item.lat},pm2rdm`}
          loading="lazy"
          title={`Расположение: ${item.title}`}
          referrerPolicy="strict-origin-when-cross-origin"
          frameBorder="0"
        />

        <div className="hero-card__params">
          <div className="hero-card__param">
            <span>Рыночная аренда</span>
            <strong>{item.rent}</strong>
          </div>
          <div className="hero-card__param">
            <span>КУ и расходы</span>
            <strong>{item.utilities}</strong>
          </div>
          <div className="hero-card__param">
            <span>Чистая аренда</span>
            <strong>{item.netRent}</strong>
          </div>
          <div className="hero-card__param">
            <span>Цена объекта</span>
            <strong>{item.price}</strong>
          </div>
        </div>

        <div className="hero-card__yield">
          <span>Общая доходность под управлением</span>
          <strong>{item.yield}</strong>
          <p className="hero-card__yield-extra">
            {item.appreciation} удорожание · итого до {item.total}
          </p>
        </div>

        <div className="hero-card__chips">
          {item.tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="hero-card__risk">
          Что проверить: КУ, срок договора, индексацию, назначение помещения.
        </p>
      </div>

      <div className="hero-card__footer">
        <a className="hero-card__link" href="#objects">
          Открыть пример расчета
        </a>
        <div className="hero-card__dots">
          {HERO_ROTATING_CASES.map((c, i) => (
            <button
              type="button"
              className={`hero-card__dot${i === index ? ' is-active' : ''}`}
              key={c.title}
              aria-label={`Показать пример: ${c.title}`}
              aria-current={i === index}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== SCENARIOS =====

function ScenariosSection() {
  return (
    <section className="section scenarios" id="services">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">Что делаем как оператор</h2>
          <p className="body-text">
            Берем объект не как объявление, а как финансовый актив: считаем доход, ищем
            арендатора или покупателя, ведем переговоры и можем управлять арендой каждый месяц.
          </p>
        </div>
        <div className="grid-3">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard scenario={scenario} key={scenario.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioCard({ scenario }: { scenario: (typeof SCENARIOS)[number] }) {
  return (
    <div className="scenario-card">
      <div>
        <span className="eyebrow scenario-card__label">{scenario.label}</span>
        <h3 className="h3">{scenario.title}</h3>
        {scenario.price && <p className="scenario-card__price">{scenario.price}</p>}
      </div>
      <ul className="scenario-card__list">
        {scenario.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a
        className="btn btn--ghost"
        href="#contacts"
        onClick={() => {
          if (scenario.cta === 'Подобрать объект') {
            window.dispatchEvent(new CustomEvent('presetTask', { detail: 'Купить доходное помещение' }));
          }
        }}
      >
        {scenario.cta}
      </a>
    </div>
  );
}

// ===== OBJECTS =====

function ObjectsSection() {
  const [activeFilter, setActiveFilter] = useState('Все');

  const visibleObjects = OBJECTS.filter(
    (obj) => activeFilter === 'Все' || obj.categories.includes(activeFilter),
  );

  return (
    <section className="section" id="objects">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">Объекты в работе</h2>
          <p className="body-text">
            Карточка показывает не только площадь и цену, но и расчет: аренда, КУ, окупаемость,
            статус арендатора и риски. По клику открывается подробный расчет.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Фильтр объектов">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-pill${activeFilter === filter ? ' is-active' : ''}`}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="objects-grid">
          {visibleObjects.map((obj) => (
            <ObjectCard obj={obj} key={obj.id} />
          ))}
        </div>

        <p className="objects-disclaimer">
          *Расчетный сценарий основан на арендном потоке, ставке капитализации, расходах и
          возможном изменении рыночной стоимости. Не является гарантией доходности или
          инвестиционной рекомендацией.
        </p>
      </div>
    </section>
  );
}

function ObjectCard({ obj }: { obj: CommercialObject }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="obj-card">
      <div className={`obj-card__inner${flipped ? ' is-flipped' : ''}`}>
        <div className="obj-card__face obj-card__face--front" aria-hidden={flipped}>
          <div className={`obj-card__visual visual-${obj.visual}`}>
            <span className="obj-card__type">{obj.type}</span>
          </div>
          <h3 className="obj-card__title">{obj.title}</h3>
          <p className="obj-card__location">{obj.location}</p>
          <div className="obj-card__params">
            <div>
              <span>Цена</span>
              <strong>{obj.price}</strong>
            </div>
            <div>
              <span>Аренда</span>
              <strong>{obj.rent}</strong>
            </div>
            <div>
              <span>Площадь</span>
              <strong>{obj.area}</strong>
            </div>
            <div>
              <span>Статус</span>
              <strong>{obj.status}</strong>
            </div>
          </div>
          <div className="obj-card__tags">
            {obj.tags.map((tag) => (
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <span className="obj-card__hint obj-card__hint--desktop">
            Наведите, чтобы увидеть расчет
          </span>
          <span className="obj-card__hint obj-card__hint--mobile">расчет ниже</span>
          <button
            type="button"
            className="obj-card__btn"
            tabIndex={flipped ? -1 : 0}
            aria-expanded={flipped}
            aria-label={`Открыть расчет доходности: ${obj.title}`}
            onClick={() => setFlipped(true)}
          >
            Открыть расчет
          </button>
        </div>

        <div className="obj-card__face obj-card__face--back" aria-hidden={!flipped}>
          <p className="eyebrow obj-card__calc-title">Расчет доходности</p>
          <div className="obj-card__calc-hero">
            <span>Совокупный потенциал</span>
            <strong>{obj.totalPotential}*</strong>
          </div>
          <div className="obj-card__calc-list">
            <div className="obj-card__calc-row obj-card__calc-row--primary">
              <span>Рентная доходность</span>
              <strong>{obj.rentalYield}*</strong>
            </div>
            <div className="obj-card__calc-row obj-card__calc-row--primary">
              <span>Рост стоимости</span>
              <strong>{obj.appreciation}*</strong>
            </div>
            <div className="obj-card__calc-row">
              <span>Окупаемость</span>
              <strong>{obj.payback}</strong>
            </div>
            <div className="obj-card__calc-row">
              <span>Риск</span>
              <strong>{obj.risk}</strong>
            </div>
            <div className="obj-card__calc-row">
              <span>Индексация</span>
              <strong>7%/год</strong>
            </div>
          </div>
          <button
            type="button"
            className="obj-card__btn"
            tabIndex={flipped ? 0 : -1}
            aria-label={`Свернуть расчет доходности: ${obj.title}`}
            onClick={() => setFlipped(false)}
          >
            Открыть расчет
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== OWNERS + INVESTORS (duality) =====

function OwnersInvestorsSection() {
  return (
    <section className="section section--alt duality" id="owners">
      <div className="container duality__grid">
        <div className="duality-card duality-card--light">
          <span className="eyebrow">Собственникам</span>
          <p className="yield-number duality-card__stat">{OWNER_STAT.value}</p>
          <p className="duality-card__stat-label">{OWNER_STAT.label}</p>
          <ul className="duality-card__benefits">
            {OWNER_BENEFITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="btn btn--primary duality-card__cta" href="#contacts">
            Получить аудит объекта
          </a>
        </div>

        <div className="duality-card duality-card--dark" id="investors">
          <span className="eyebrow">Инвесторам</span>
          <p className="yield-number duality-card__stat">{INVESTOR_STAT.value}</p>
          <p className="duality-card__stat-label">{INVESTOR_STAT.label}</p>
          <ul className="duality-card__benefits">
            {INVESTOR_BENEFITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a
            className="btn btn--light duality-card__cta"
            href="#contacts"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('presetTask', { detail: 'Купить доходное помещение' }))
            }
          >
            Подобрать доходный объект
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== MANAGEMENT =====

function ManagementSection() {
  return (
    <section className="section management" id="management">
      <div className="container">
        <div>
          <div className="section-head">
            <span className="eyebrow">Управление</span>
            <h2 className="h2">Управление арендой без ручного контроля</h2>
          </div>
          <p className="body-text">
            Берем ежемесячную операционку: платежи, КУ, арендаторы, индексация, документы и отчет
            собственнику.
          </p>
          <ul className="mgmt-features">
            {MGMT_FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="mgmt-report">
          <p className="eyebrow mgmt-report__title">Отчет за месяц</p>
          <div className="mgmt-report__hero">
            <span>Чистый поток</span>
            <strong>{MGMT_REPORT_ROWS.find((r) => r.label === 'Чистый поток')?.value}</strong>
          </div>
          <div className="mgmt-report__rows">
            {MGMT_REPORT_ROWS.filter((row) => row.label !== 'Чистый поток').map((row) => (
              <div className="mgmt-report__row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <p className="mgmt-report__reco">Рекомендация: подготовить повышение ставки на 7%</p>
          <a
            className="mgmt-report__cta"
            href="#contacts"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('presetTask', { detail: 'Взять объект в управление' }))
            }
          >
            Пришлём расчёт доходности, арендной платы и перспектив по вашему объекту
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== ANALYTICS =====

function AnalyticsSection() {
  return (
    <section className="section analytics" id="analytics">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">Разборы объектов и рынка</h2>
          <p className="body-text">
            Пишем не новости, а практические разборы: ставка аренды, КУ, окупаемость, цена
            продажи и ошибки в договорах.
          </p>
        </div>
        <div className="analytics-grid">
          {ARTICLES.map((title, i) => (
            <div className="article-card" key={title}>
              <span className="article-card__num">{String(i + 1).padStart(2, '0')}</span>
              <p className="article-card__title">{title}</p>
            </div>
          ))}
        </div>
        <a className="btn btn--ghost analytics__cta" href="#analytics">
          Читать разборы
        </a>
      </div>
    </section>
  );
}

// ===== TRUST =====

function TrustSection() {
  return (
    <section className="section section--alt trust">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">Первый Нежилой в цифрах</h2>
        </div>
        <div className="trust__grid">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="yield-number" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
                {stat.value}
              </p>
              <p className="trust__stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FAQ =====

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">Частые вопросы</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.q}>
                <button
                  type="button"
                  className="faq-item__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="faq-item__icon" aria-hidden="true" />
                </button>
                {isOpen && <p className="faq-item__a">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ===== FINAL CTA =====

const TASK_OPTIONS = [
  'Сдать помещение в аренду',
  'Продать объект',
  'Взять объект в управление',
  'Купить доходное помещение',
  'Найти помещение под бизнес',
  'Проверить доходность или договор',
];

type ContactForm = {
  phone: string;
  email: string;
  task: string;
  comment: string;
};

const EMPTY_FORM: ContactForm = {
  phone: '',
  email: '',
  task: TASK_OPTIONS[0],
  comment: '',
};

function FinalCtaSection() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function handlePresetTask(event: Event) {
      const task = (event as CustomEvent<string>).detail;
      setForm((prev) => ({ ...prev, task }));
    }
    window.addEventListener('presetTask', handlePresetTask);
    return () => window.removeEventListener('presetTask', handlePresetTask);
  }, []);

  function updateField<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section contacts section--dark" id="contacts">
      <div className="container contacts__grid">
        <div>
          <h2 className="h2">Получите расчет по объекту</h2>
          <p className="body-text contacts__note">
            Оставьте телефон и задачу. Покажем рыночную ставку, чистый поток, окупаемость, риски
            договора и ближайшие действия.
          </p>
        </div>

        {submitted ? (
          <div className="contacts__success">
            <p className="h3">Заявка собрана</p>
            <p className="body-text">На реальном сайте здесь будет отправка в CRM или Telegram.</p>
          </div>
        ) : (
          <form className="contacts-form" onSubmit={handleSubmit}>
            <div className="contacts-form__row">
              <div className="form-field form-field--light">
                <label htmlFor="cta-phone">Телефон</label>
                <input
                  id="cta-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div className="form-field form-field--light">
                <label htmlFor="cta-email">Почта</label>
                <input
                  id="cta-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-field form-field--light">
              <label htmlFor="cta-task">Задача</label>
              <select
                id="cta-task"
                value={form.task}
                onChange={(e) => updateField('task', e.target.value)}
              >
                {TASK_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-field form-field--light">
              <label htmlFor="cta-comment">Комментарий</label>
              <textarea
                id="cta-comment"
                rows={4}
                placeholder="Адрес, площадь, текущая аренда, КУ, срок договора, что хотите решить"
                value={form.comment}
                onChange={(e) => updateField('comment', e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--light contacts-form__submit">
              Получить расчет
            </button>
            <p className="contacts-form__legal">
              Нажимая на кнопку, вы соглашаетесь на обработку персональных данных. Расчет носит
              предварительный характер и не является гарантией доходности.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ===== FOOTER =====

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <p className="footer__brand-title">Первый Нежилой</p>
            <p className="footer__brand-subtitle">Оператор коммерческой недвижимости</p>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Разделы</p>
            <ul>
              {FOOTER_SECTIONS.map((link) => (
                <li key={link.href + link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Услуги</p>
            <ul>
              {FOOTER_SERVICES.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Контакты</p>
            <ul>
              <li>
                <a href={PHONE.href}>{PHONE.display}</a>
              </li>
              <li>
                <a href="mailto:hello@perviy-nezhiloy.ru">hello@perviy-nezhiloy.ru</a>
              </li>
              <li>Ярославль</li>
              <li>Telegram / WhatsApp</li>
            </ul>
          </div>
        </div>

        <p className="footer__legal">
          Расчеты на сайте носят информационный характер и не являются гарантией доходности или
          инвестиционной рекомендацией.
        </p>
      </div>
    </footer>
  );
}

// ===== APP =====

export default function App() {
  return (
    <>
      <Header />
      <PromoTicker />
      <main>
        <Hero />
        <FinalCtaSection />
        <ScenariosSection />
        <TrustSection />
        <ObjectsSection />
        <OwnersInvestorsSection />
        <ManagementSection />
        <AnalyticsSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
