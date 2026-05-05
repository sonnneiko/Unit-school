import type { Lesson } from '../types'
import accountingCat from '../assets/unit-cat/Аккаунтинг.png'

export const mockLessons: Lesson[] = [
  // ── Команда ──────────────────────────────────────────────
  {
    id: 'unitpay-basics-team',
    title: 'Команда',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'welcome',
        hasInternalNav: true,
        content: {
          title: 'Добро пожаловать в команду Unitpay!',
          subtitle: 'Я котик Юнит 🐾 рад знакомству! В первые дни я буду рядом и помогу быстро освоиться.',
          ctaLabel: 'Начать',
          bullets: [
            'Покажу, как у нас всё устроено',
            'Расскажу, чем мы занимаемся',
            'Познакомлю с коллегами',
            'Поделюсь полезными штуками для старта работы',
          ],
        },
      },
      {
        id: 's2',
        type: 'tabs',
        hasInternalNav: true,
        content: {
          title: 'Как устроена команда Unitpay',
          subtitle: 'Начнём с твоих коллег и наших отделов. Я расскажу, кто у нас за что отвечает, чем занимается каждый отдел и к кому лучше обращаться с разными вопросами.',
          introImage: '/Знакомство (1).png',
          tabs: [
            {
              label: 'Управление',
              icon: 'Compass',
              tagline: 'Держат всё под контролем!',
              taglineBody: 'Они управляют нашим продуктом и задают общее направление: куда мы идём, что развиваем и как делаем UnitPay лучше.',
              itemType: 'team',
              items: [
                { name: 'Дмитрий Козлов', role: 'CEO', description: 'Это наш генеральный директор. Очень любит приводить новых мерчантов в UnitPay. Но вообще: «Гений, миллиардер, плейбой, филантроп».', photo: '/team/Dmitry.jpg', photoPlaceholder: '#4CAF50' },
                { name: 'Полина Есина', role: 'Deputy CEO', description: 'Отвечает за операционную деятельность — процессы, задачи и важные рабочие вопросы.', photo: '/team/Polina.jpg', photoPlaceholder: '#2196F3' },
              ],
            },
            {
              label: 'Разработка',
              icon: 'Code',
              tagline: 'Улучшают продукт изнутри!',
              taglineBody: 'Много важной работы остаётся «за кулисами», но благодаря им UnitPay становится удобнее, стабильнее и лучше каждый день.',
              itemType: 'team',
              items: [
                { name: 'Роман Комиссаренко', role: 'Старший разработчик', description: 'Наш разработчик-путешественник. Пишет код из разных уголков мира и пробует странные булочки.', photo: '/team/Roma.jpg', photoPlaceholder: '#9C27B0' },
                { name: 'Вадим Нижневский', role: 'Старший разработчик', description: 'Разработчик, который делает UnitPay стабильнее и надёжнее каждый день.', photo: '/team/Vadim.png', photoPlaceholder: '#FF5722' },
                { name: 'Василий Волгин', role: 'Тестировщик', description: 'Проводит ручное и автотестирование, проверяет новые функции перед внедрением в UnitPay.', photo: '/team/vasily.jpg', photoPlaceholder: '#607D8B' },
                { name: 'Максим Шетхман', role: 'Разработчик', description: 'Backend-разработчик на PHP. Любит залипнуть в сериальчик или фильм, который бы пощекотал нервишки. Помогает котяткам!', photo: '/team/maxim.jpg', photoPlaceholder: '#795548' },
              ],
            },
            {
              label: 'Менеджмент',
              icon: 'Eye',
              tagline: 'Двигают карточки',
              taglineBody: 'Они формируют цели, расставляют приоритеты, координируют команды и следят чтобы продукт развивался в нужном направлении.',
              itemType: 'team',
              items: [
                { name: 'Артем Драгунов', role: 'Product Manager', description: 'Отвечает за создание и развитие продукта, формирует его стратегию и приоритеты. Может разобраться во всём на свете.', photo: '/team/artem.jpg', photoPlaceholder: '#FF9800' },
                { name: 'Анастасия Деева', role: 'Project Manager', description: 'Управляет задачами и коммуникацией внутри команды. Отвечает за прозрачность процессов, приоритизацию и соблюдение сроков. Ценит ясность и четкие договоренности.', photo: '/team/NastyaPM.jpg', photoPlaceholder: '#E91E63' },
              ],
            },
            {
              label: 'Аккаунтинг',
              icon: 'Smile',
              tagline: 'Помогают и объясняют!',
              taglineBody: 'Отдел аккаунтинга сопровождает мерчантов на всех этапах работы с UnitPay. Отвечают на вопросы, помогают с подключением и настройкой проектов, контролируют приём платежей.',
              itemType: 'team',
              items: [
                { name: 'Анастасия Калашникова', role: 'Руководитель аккаунтинга', description: 'Отвечает за контроль качества работы отдела, помогает сотрудникам расти и развиваться. Направляет работу отдела.', photo: '/team/nastya-acc.jpg', photoPlaceholder: '#00BCD4' },
                { name: 'София', role: 'Технический специалист', description: 'Занимается техническими вопросами наших мерчантов и внутренним развитием продукта — например, платформой по обучению, на которой ты сейчас находишься.', photo: '/team/Sofia.jpg', photoPlaceholder: '#9C27B0' },
                { name: 'Елена', role: 'Аккаунт-менеджер', description: 'Помогает нашим мерчантам. Любит бочку в офисной сауне.', photo: '/team/elena.jpg', photoPlaceholder: '#FF9800' },
                { name: 'Оксана Долженкова', role: 'Старший специалист аккаунтинга', description: 'Помогает сотрудникам. Общается с VIP-мерчантами, обрабатывает триггеры и карточки, выполняет задачи руководителя. Делает крутые мемы.', photo: '/team/oksana.jpg', photoPlaceholder: '#8BC34A' },
              ],
            },
            {
              label: 'Служба безопасности',
              icon: 'Shield',
              tagline: 'Следят и контролируют!',
              taglineBody: 'Контролируют всё, что связано с безопасностью: модерируют проекты, проверяют контрагентов, мониторят транзакции на фрод, взаимодействуют с поставщиками и обрабатывают чарджбэки.',
              itemType: 'team',
              items: [
                { name: 'Ани Тоноян', role: 'Служба безопасности', description: 'Следит за безопасностью и внимательно выискивает любые недочёты в проектах. Возвращается с перепроверками. А ещё ходит по офису в крутых тапках.', photo: '/team/Ani.jpg', photoPlaceholder: '#F44336' },
                { name: 'Светлана Григорьева', role: 'Служба безопасности', description: 'Контролирует безопасность UnitPay и внимательно следит за всем, что может повлиять на риски в работе. Работает на удалёнке, но каждое утро начинает с крутой картинки в чате.', photo: '/team/svetlana.jpg', photoPlaceholder: '#FF5722' },
              ],
            },
          ],
        },
      },
    ],
  },

  // ── UnitPay ───────────────────────────────────────────────
  {
    id: 'unitpay-basics-about',
    title: 'UnitPay',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'feature',
        content: {
          heading: 'Знакомимся с UnitPay',
          paragraphs: [
            'UnitPay — это платёжный сервис (платёжный агрегатор), который помогает бизнесам принимать онлайн-платежи. Мы соединяем сайт клиента с банком (а иногда сразу с несколькими), чтобы их клиенты могли удобно оплачивать товары и услуги через интернет.',
            'Благодаря этому компании не нужно подключать каждый способ оплаты отдельно — агрегатор позволяет принимать платежи через разные банки и методы оплаты в одном месте.',
            'UnitPay — упрощает процесс приёма онлайн-платежей.',
          ],
          features: [
            {
              icon: 'LayoutGrid',
              title: 'Решение для разных типов бизнеса',
              subtitle: 'Телеграм-боты и мини апп, подписки и сервисы, группы ВК',
            },
            {
              icon: 'CreditCard',
              title: 'Множество платёжных методов',
              subtitle: 'Карты РФ и зарубежные, СБП, SberPay, T-Pay, USDT',
            },
            {
              icon: 'Printer',
              title: 'Бесплатная онлайн-касса',
              subtitle: 'Юнит.Чеки с бесшовной интеграцией',
            },
          ],
        },
      },
    ],
  },

  // ── Методы приёма ─────────────────────────────────────────
  {
    id: 'unitpay-basics-methods',
    title: 'Методы приёма',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'methods',
        content: {
          heading: 'Методы приёма платежей в UnitPay',
          methods: [
            { logo: '/fonts/Mir 1 from Figma.png',    name: 'Карты Российских банков' },
            { logo: '/fonts/Sbp 1 from Figma.png',    name: 'Система Быстрых Платежей (СБП)' },
            { logo: '/fonts/Sber logo.png',            name: 'SberPay — платёжная система Сбера' },
            { logo: '/fonts/Tbank Design.png',         name: 'T-Pay — платёжная система Т-Банка' },
            { logo: '/fonts/Untitled Design.svg',       name: 'Карты международных банков' },
            { logo: '/fonts/Tether 2 from Figma.png',  name: 'USDT (криптовалюта)' },
          ],
          mockupImage: '/fonts/Image 447 from Figma.png',
        },
      },
    ],
  },

  // ── Путь платежей ─────────────────────────────────────────
  {
    id: 'unitpay-basics-path',
    title: 'Путь платежей',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'flowchart',
        content: {
          heading: 'Путь платежа от плательщика до мерчанта',
          buyerLabel: 'Покупатель 🧑',
          steps: [
            {
              label: 'Магазин мерчанта',
              variant: 'blue',
              actions: [
                'Покупатель выбирает товар/услугу на сайте и инициирует оплату',
                'Магазин формирует заказ и передаёт данные в платёжный агрегатор',
              ],
            },
            {
              label: 'Страница оплаты',
              variant: 'green',
              logo: '/fonts/Untitled Design (1).png',
              actions: [
                'Покупатель вводит данные карты',
                'Агрегатор направляет данные в эквайера (банк)',
              ],
            },
            {
              label: 'Банк-эквайер',
              variant: 'blue',
              actions: [
                'Запрашивает авторизацию у банка-эмитента',
                'Банк направляет данные в платёжную систему (Visa, MC, МИР, DC, JCB, UnionPay, AE)',
              ],
            },
            {
              label: 'Банк-эмитент',
              variant: 'blue',
              actions: [
                'Подтверждает или отклоняет платёж',
              ],
            },
          ],
          finalNode: {
            label: 'Обработчик платежей',
            logo: '/fonts/Untitled Design (1).png',
          },
        },
      },
    ],
  },

  // ── Магазин мерчанта ──────────────────────────────────────
  {
    id: 'unitpay-basics-merchant',
    title: 'Магазин мерчанта',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'merchant',
        content: {
          heading: 'Магазин мерчанта',
          description: 'Это проект, который мерчант добавляет в нашу систему для приёма платежей за товары или услуги. Мерчант — это продавец, подключённый к системе эквайринга. Простыми словами, это любой бизнес, который использует инструменты для приёма безналичных платежей от покупателей.',
          acceptLabel: 'Мы принимаем оплату:',
          bullets: [
            'На сайтах',
            'В сообществах ВК',
            'В Telegram — каналах, ботах, мини-аппах',
          ],
          bgImage: '/fonts/фон.jpg',
          phoneImage: '/fonts/Сошал.png',
          formImage: '/fonts/Body from Figma.png',
        },
      },
    ],
  },

  // ── Страница оплаты ───────────────────────────────────────
  {
    id: 'unitpay-basics-payment-page',
    title: 'Страница оплаты',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'merchant',
        content: {
          heading: 'Страница оплаты',
          description: 'Это элемент на сайте/приложении мерчанта, который позволяет клиентам совершать оплату за товары или услуги через UnitPay, прямо не выходя с сайта.',
          acceptLabel: 'Есть два способа отображения страницы оплаты:',
          bullets: [
            'В виджете (поверх сайта)',
            'На отдельной странице',
          ],
          bgImage: '/fonts/Сошал.png',
          phoneImage: '/fonts/Сошал.png',
          formImage: '/fonts/Body from Figma.png',
          layout: 'phone',
        },
      },
    ],
  },

  // ── Банк-эквайер и Банк-эмитент ───────────────────────────
  {
    id: 'unitpay-basics-banks',
    title: 'Банк-эквайер и Банк-эмитент',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'compare',
        content: {
          panels: [
            {
              title: 'Банк-эквайер',
              description: 'Это банк, который подключает бизнес к приёму безналичных платежей. Он обрабатывает операции и отправляет их в платёжные системы (Visa, MasterCard и др.). Этот банк является партнером UnitPay.',
              cardTitle: 'Банк-эквайер',
              bullets: [
                'Принимает поручение на проведение платежа от имени продавца',
                'Эквайер принимает поручение на проведение платежа от имени продавца',
              ],
              variant: 'green',
            },
            {
              title: 'Банк-эмитент',
              description: 'Это банк, который выпустил карту покупателя (плательщика). Этот банк не является партнёром UnitPay, но он влияет на решение о том, пройдёт ли платёж.',
              cardTitle: 'Банк-эмитент',
              bullets: [
                'Проверяет, что оплату проводит владелец карты (через код подтверждения)',
                'Принимает решение о списании средств, о котором сообщает эквайру.',
              ],
              variant: 'blue',
            },
          ],
        },
      },
    ],
  },

  // ── Онлайн-кассы ──────────────────────────────────────────
  {
    id: 'unitpay-basics-kassa',
    title: 'Онлайн-кассы',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'kassa',
        content: {
          leftTitle: 'Онлайн-кассы',
          leftSubtitle: 'Юнит.',
          leftSubtitleAccent: 'Чеки',
          leftDesc: 'Юнит.Чеки — это альтернативный вариант онлайн-кассы от UnitPay. Мы отправляем чеки клиентам мерчей и в ОФД, откуда данные передаются в налоговую.',
          leftBullets: [
            'Бесшовная интеграция с UnitPay',
            'Полностью соответствует 54-ФЗ',
            'Бесплатная для наших мерчантов',
            'Любые системы налогообложения',
          ],
          rightTitle: 'Сторонняя касса',
          rightDesc: 'Мерчант приобретает контрольно-кассовую технику у одного из наших партнеров.',
          rightPartners: [
            { name: 'АТОЛ',        color: 'linear-gradient(135deg, #FFAA90, #D43A3A)', logo: '/Логотип.png' },
            { name: 'Модулькасса', color: 'linear-gradient(135deg, #C49AFF, #6B1FCC)', logo: '/Group from Figma (1).png' },
            { name: 'екомкасса',   color: 'linear-gradient(135deg, #90D888, #1E7A30)', logo: '/Logo.png' },
            { name: 'Чек-Онлайн', color: 'linear-gradient(135deg, #FFB0B8, #CC2850)', logo: '/Figma Untitled 04-02.png' },
            { name: 'и другие партнёры...', color: 'transparent' },
          ],
        },
      },
    ],
  },

  // ── Эквайринг ─────────────────────────────────────────────
  {
    id: 'unitpay-basics-acquiring',
    title: 'Эквайринг',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'acquiring',
        hasInternalNav: true,
        content: {
          tabs: [
            {
              label: 'Работа классического эквайринга',
              icon: '',
              title: 'Эквайринг',
              description: 'Эквайринг - это классический,"белый" способ приёма платежей через банк. Он включает в себя отчетность, использование кассы и выплаты на расчетный счет (р/с).',
            },
            {
              label: 'Проблема',
              icon: '',
              title: 'Эквайринг',
              description: 'Эквайринг - это классический,"белый" способ приёма платежей через банк. Он включает в себя отчетность, использование кассы и выплаты на расчетный счет (р/с).',
            },
            {
              label: 'Роль UnitPay',
              icon: '',
              title: 'Роль UnitPay',
              description: 'UnitPay сам заключает договоры с разными банками и платёжными системами и объединяет их в одну форму оплаты. Благодаря этому компании не нужно подключать каждый способ оплаты отдельно.',
            },
            {
              label: 'Неттинг',
              icon: '',
              title: 'Неттинг',
              description: 'Эта схема работы похожа на эквайринг, но в неттинге нет отчётности, чеков и выплат на расчетный счет партнера. Все денежные средства поступают на баланс UnitPay. Неттинг позволяет работать без регистрации ИП или юридического лица.',
            },
          ],
        },
      },
    ],
  },

  // ── Юридические и физические лица ─────────────────────────
  {
    id: 'unitpay-basics-entities',
    title: 'Юридические и физические лица',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'entities',
        content: {
          heading: 'Кто может работать с UnitPay',
          panels: [
            {
              title: 'Юридические лица',
              paragraphs: [
                'Это компании и предприниматели, которые официально зарегистрированы.',
                'ООО/АО — юридические лица, отдельные компании.',
                'ИП — физическое лицо, ведёт бизнес от своего имени. Он официально зарегистрирован, ведёт предпринимательскую деятельность и платит налоги.',
              ],
              bullets: [
                'Оплачивают верификационный платёж — 2000р.',
                'Для подключения доступен неттинг и эквайринг',
                'Работают на домене: UnitPay.ru',
              ],
              bulletIcon: 'diamond',
              variant: 'purple',
            },
            {
              title: 'Физические лица',
              paragraphs: [
                'Это обычный человек, который не зарегистрирован как предприниматель или компания. То есть это ты, я и все, кто не ведёт бизнес на официальном уровне.',
              ],
              bullets: [
                'Для подключения доступен неттинг',
                'Работа без чеков и отчётности',
                'Не оплачивают верификационный платёж',
                'Работают на домене: UnitPay.money',
              ],
              bulletIcon: 'circle',
              variant: 'pink',
            },
          ],
        },
      },
    ],
  },

  // ── Поставщики ────────────────────────────────────────────
  {
    id: 'unitpay-basics-vendors',
    title: 'Поставщики',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'vendors',
        content: {
          title: 'Поставщики эквайринга',
          cards: [
            {
              name: 'Т-Банк',
              description: 'Дает карты РФ, РБ MIR и Tpay. Мерчантов отправляем сами по API.',
              gradient: 'linear-gradient(135deg, #FFD059, #FF9500)',
              logo: '/vendors/Банк Ти (1).png',
            },
            {
              name: 'Точка Банк',
              description: 'Дает нам карты РФ и СБП. Мерчант сам регистрируется в банке по нашей ссылке.',
              gradient: 'linear-gradient(135deg, #C084FC, #7C3AED)',
              logo: '/vendors/Frame 237828 from Figma.png',
            },
            {
              name: 'SOM',
              description: 'Единственный зарубежный эквайринг.',
              gradient: 'linear-gradient(135deg, #86EF8C, #16A34A)',
              logo: '/vendors/Globe from Figma.png',
            },
            {
              name: 'Банк 131',
              description: 'Дает нам карты РФ, СБП и SberPay. Требует отправлять документы исключительно по почте.',
              gradient: 'linear-gradient(135deg, #F87171, #DC2626)',
              logo: '/vendors/Банк 131.png',
            },
          ],
        },
      },
      {
        id: 's2',
        type: 'vendors',
        content: {
          title: 'Поставщики неттинга',
          cards: [
            {
              name: 'Kanyon',
              description: 'Дает нам СБП и выплаты в USDT. Ходит за ручку с Onlipay (подключаем вместе для каскада).',
              gradient: 'linear-gradient(135deg, #FB7185, #E11D48)',
              logo: '/vendors/Kanyon Figma.png',
            },
            {
              name: 'Onlipay',
              description: 'Дает нам СБП и выплаты в USDT.',
              gradient: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
              logo: '/vendors/Онлик.png',
            },
            {
              name: '2Can',
              description: 'Дает нам карты РФ и выплаты в USDT. Мерчантов согласовываем через чат в Telegram.',
              gradient: 'linear-gradient(135deg, #FCD34D, #D97706)',
              logo: '/vendors/Mufasa Payment Telegram Avatar.png',
            },
            {
              name: 'Platio',
              description: 'Единственный зарубежный неттинг. Дает нам на прием и выплаты: карты РФ/зарубеж, СБП, USDT.',
              gradient: 'linear-gradient(135deg, #60A5FA, #2563EB)',
              logo: '/vendors/Платио 2 (1).png',
            },
          ],
        },
      },
    ],
  },

  // ── Аккаунтинг: Введение ─────────────────────────────────
  {
    id: 'accounting-intro',
    title: 'Аккаунтинг',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'welcome',
        content: {
          title: 'Аккаунтинг',
          subtitle: 'Аккаунт-менеджер — это связующее звено между UnitPay и мерчантами. Именно они от лица UnitPay общаются с партнёрами, помогают им и сопровождают в работе с нашим сервисом.',
          ctaLabel: 'Начать',
          image: accountingCat,
          bullets: [
            'Поддержка мерчантов',
            'Мониторинг и аналитика',
            'Взаимодействие внутри команды',
            'Построение долгосрочных отношений',
          ],
        },
      },
    ],
  },

  // ── Аккаунтинг: Инструменты ──────────────────────────────
  {
    id: 'accounting-tools',
    title: 'Инструменты',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'tools',
        content: {
          tools: [
            {
              id: 'admin',
              title: 'Adminка UnitPay',
              gradient: 'linear-gradient(135deg, #6BCB77, #4CAF50)',
              icon: 'Settings',
              description: 'Главный рабочий инструмент. Здесь всё: проекты, транзакции, настройки мерчантов, финансовые данные.',
            },
            {
              id: 'omnidesk',
              title: 'Omnidesk',
              gradient: 'linear-gradient(135deg, #9B59B6, #6c5ce7)',
              icon: 'MessageSquare',
              description: 'Система для взаимодействия с мерчантами и плательщиками. Обращения, тикеты, история переписки.',
            },
            {
              id: 'teamly',
              title: 'Teamly',
              gradient: 'linear-gradient(135deg, #F4A800, #e67e22)',
              icon: 'LayoutDashboard',
              description: 'Инструмент для взаимодействия с другими отделами. Задачи, документы, внутренние процессы.',
            },
            {
              id: 'telegram',
              title: 'Telegram',
              gradient: 'linear-gradient(135deg, #2AABEE, #0984e3)',
              icon: 'Send',
              description: 'Взаимодействие с командой, партнёрами и поставщиками.',
            },
          ],
        },
      },
    ],
  },

  // ── Аккаунтинг: Чаты ─────────────────────────────────────
  {
    id: 'accounting-chats',
    title: 'Чаты',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'tgchats',
        content: {
          footerNote: 'Это не все чаты — но основные, нужные на данном этапе. При добавлении в новые чаты тебе расскажут, для чего они.',
          chats: [
            {
              id: 'accounting',
              name: 'Аккаунтинг 💅',
              avatarImage: '/team/аккаунтинг.jpg',
              preview: 'София: GIF',
              badge: 1209,
              cardId: 'accounting',
            },
            {
              id: 'sb',
              name: 'Взаимодействие с СБ',
              avatarImage: '/team/sb.jpg',
              preview: 'София: может улучшим шаблон?',
              cardId: 'sb',
            },
            {
              id: 'ampm',
              name: 'Взаимодействие Аккаунтинг | PM',
              avatarGradient: 'linear-gradient(140deg, #00b894, #0984e3)',
              avatarText: 'PM',
              preview: 'София: окей, сделаем',
              cardId: 'ampm',
            },
            {
              id: 'alerts',
              name: 'Unitpay Alerts',
              avatarImage: '/team/unitpay-alerts.jpg',
              preview: '🟢 Трафик восстановлен.',
              cardId: 'alerts',
            },
            {
              id: 'partners',
              name: 'Действия партнёров',
              avatarImage: '/team/partner-actions.jpg',
              preview: 'UnitBot: Регистрация нового...',
              badge: 444,
              cardId: 'triggers',
            },
            {
              id: 'urlica',
              name: '❗️Юрлица Triggers',
              avatarGradient: 'linear-gradient(140deg, #e84393, #fd79a8)',
              avatarEmoji: '❗',
              preview: 'UnitBot: [Снижение оборота]',
              badge: 1528,
              cardId: 'triggers',
            },
            {
              id: 'site',
              name: 'Сайт недоступен TRIGGERS ✈️',
              avatarGradient: 'linear-gradient(140deg, #fd9644, #e55039)',
              avatarText: '满',
              preview: 'UnitBot: архив',
              cardId: 'triggers',
            },
          ],
          cards: [
            {
              id: 'accounting',
              name: 'Аккаунтинг',
              avatarImage: '/team/аккаунтинг.jpg',
              description: 'Общий чат всех аккаунт-менеджеров. Здесь обсуждаем рабочие вопросы, делимся информацией и координируемся внутри отдела. Иногда присылаем мемы.',
              tag: 'Внутренний чат отдела',
            },
            {
              id: 'sb',
              name: 'Взаимодействие с СБ',
              avatarImage: '/team/sb.jpg',
              description: 'Чат для взаимодействия со службой безопасности. Сюда пишешь, когда нужна приоритетная проверка мерчанта, согласование проекта или есть вопросы по безопасности.',
              tag: 'Межотдельный',
            },
            {
              id: 'ampm',
              name: 'Взаимодействие Аккаунтинг | PM',
              avatarGradient: 'linear-gradient(140deg, #00b894, #0984e3)',
              avatarText: 'PM',
              description: 'Чат для совместной работы с менеджерами проектов и техническими специалистами. Здесь обсуждаются задачи, которые требуют участия нескольких отделов.',
              tag: 'Межотдельный',
            },
            {
              id: 'alerts',
              name: 'Unitpay Alerts',
              avatarImage: '/team/unitpay-alerts.jpg',
              description: 'Автоматические оповещения о проблемах с доступностью сервисов UnitPay и об их восстановлении. Канал для наших мерчантов.',
              tag: 'Оповещения сервиса',
            },
            {
              id: 'triggers',
              name: 'Чаты с триггерами',
              avatarGradient: 'linear-gradient(140deg, #11998e, #38ef7d)',
              avatarEmoji: '⚡',
              description: 'Автоматические уведомления о действиях партнёров: регистрации, снижении оборота, недоступности сайта и других событиях. Подробнее о триггерах — в курсе «Технические аспекты и интеграция».',
              tag: 'Технические аспекты и интеграция →',
            },
          ],
        },
      },
    ],
  },
]
