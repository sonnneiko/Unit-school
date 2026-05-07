import { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle, Zap, ArrowLeftRight, ArrowDown, ArrowRight } from 'lucide-react'
import type { AcquiringContent } from '../../types'
import styles from './slides.module.css'

const TAB_ICONS = [
  <RefreshCw size={16} strokeWidth={2} />,
  <AlertTriangle size={16} strokeWidth={2} />,
  <Zap size={16} strokeWidth={2} />,
  <ArrowLeftRight size={16} strokeWidth={2} />,
]

function DiagramBase({ dimmed }: { dimmed?: boolean }) {
  return (
    <div className={`${styles.acqDiagramBase} ${dimmed ? styles.acqDiagramDimmed : ''}`}>
      <div className={styles.acqStore}>
        <img src="/Untitled Image from Figma.png" alt="" className={styles.acqStoreImg} />
        <span className={styles.acqStoreLabel}>Магазин</span>
      </div>
      <div className={styles.acqArrow}>→</div>
      <div className={styles.acqPill}>Запрос на оплату</div>
      <div className={styles.acqArrow}>→</div>
      <div className={styles.acqBoxYellow}>ТБанк</div>
      <div className={styles.acqArrowText}>→ Показывает<br />форму оплаты</div>
      <img src="/fonts/Image 447 from Figma.png" alt="" className={styles.acqFormImg} />
    </div>
  )
}

function Tab1() {
  return (
    <div className={styles.acqPanel}>
      <DiagramBase />
    </div>
  )
}

function Tab2() {
  return (
    <div className={styles.acqPanel2}>
      <div className={styles.acqProblemDiagram}>
        <DiagramBase dimmed />
        <div className={styles.acqProblemOverlay}>
          <span>НО ЧТО ЕСЛИ ТБАНК ОТКАЖЕТ?</span>
          <span>СЛОМАЕТСЯ?</span>
          <span>ИЛИ МНЕ НУЖНЫ ДРУГИЕ СПОСОБЫ ОПЛАТЫ?</span>
        </div>
      </div>
      <div className={styles.acqRedCardBottom}>
        <h3 className={styles.acqCardTitle}>Минусы прямого эквайринга</h3>
        <ul className={styles.acqCardList}>
          <li>Привязка к одному банку</li>
          <li>Не всегда доступны все необходимые способы оплаты</li>
        </ul>
      </div>
    </div>
  )
}

function Tab3() {
  const banks = [
    { bank: 'ТБанк',      methods: 'Карты, Т-Pay' },
    { bank: 'Банк 131',   methods: 'Карты, СБП, SberPay' },
    { bank: 'Точка Банк', methods: 'Карты, СБП' },
  ]
  return (
    <div className={styles.acqPanel3}>
      <div className={styles.acqTab3Flow}>
        <div className={styles.acqBoxGrayMd}>ООО или ИП</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqPillMd}>Документы</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqBoxGreenMd}>Unitpay</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqPillMd}>Заявка на подключение</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqTab3Fork}>
          <div className={styles.acqTab3ColHeaders}>
            <span>Вендоры</span>
            <span>Методы оплаты</span>
          </div>
          <div className={styles.acqTab3BranchRows}>
            {banks.map((b, i) => (
              <div key={i} className={styles.acqBranchRow}>
                <div className={styles.acqBoxPlain}>{b.bank}</div>
                <span className={styles.acqArrowH}>→</span>
                <div className={styles.acqMethodTag}>{b.methods}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className={styles.acqArrowH}>→</span>
      <div className={styles.acqFormRight}>
        <p className={styles.acqFormRightTitle}>Все методы на одной форме</p>
        <img src="/fonts/Image 447 from Figma.png" alt="" className={styles.acqFormImgSmall} />
      </div>
    </div>
  )
}

function Tab4() {
  return (
    <div className={styles.acqPanel4}>
      <div className={styles.acqNettingDiagram}>
        <div className={`${styles.acqBoxPinkMd} ${styles.acqBoxTwoLine}`}>
          <span>ООО/ИП</span>
          <span>Физическое лицо</span>
        </div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqPillMd}>Документы</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqBoxGreenMd}>Unitpay</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqPillMd} style={{textAlign:'center', lineHeight:'1.3'}}>Заявка на<br/>подключение</div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqVendorBox}>
          {['OnliPay', 'TwoCan', 'Kanyon', 'Platio...'].map((v, i) => (
            <div key={i} className={styles.acqVendorItem}>{v}</div>
          ))}
        </div>
        <span className={styles.acqArrowH}>→</span>
        <div className={styles.acqNettingMethods}>
          <div className={styles.acqMethodTag}>СБП, карты РФ</div>
          <div className={styles.acqMethodTag}>Карты РФ/зарубеж, СБП, USDT</div>
        </div>
      </div>
      <div className={styles.acqBlueCardBottom}>
        <h3 className={styles.acqCardTitle}>Отличия от эквайринга</h3>
        <ul className={styles.acqCardList}>
          <li>Нет чеков и отчетности</li>
          <li>Нет выплат на расчетный счет</li>
          <li>Можно работать без ИП или юридического лица</li>
        </ul>
      </div>
    </div>
  )
}

export function AcquiringSlide({
  content,
  onLastTab,
  initialTab,
}: {
  content: AcquiringContent
  onLastTab?: (isLast: boolean) => void
  initialTab?: number
}) {
  const [activeTab, setActiveTab] = useState(initialTab ?? 0)

  useEffect(() => {
    const tab = initialTab ?? 0
    setActiveTab(tab)
    onLastTab?.(tab === content.tabs.length - 1)
  }, [initialTab])

  const handleTab = (i: number) => {
    setActiveTab(i)
    onLastTab?.(i === content.tabs.length - 1)
  }

  const tab = content.tabs[activeTab]

  return (
    <div className={styles.acquiringFull}>
      <div className={styles.acquiringTop}>
        <h1 className={styles.acquiringTitle}>{tab.title}</h1>
        <p className={styles.acquiringDesc}>{tab.description}</p>
        <div className={styles.acquiringTabs}>
          {content.tabs.map((t, i) => (
            <button
              key={i}
              className={`${styles.acquiringTab} ${i === activeTab ? styles.acquiringTabActive : ''}`}
              onClick={() => handleTab(i)}
            >
              <span className={styles.acquiringTabIcon}>{TAB_ICONS[i]}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.acquiringBody}>
        {activeTab === 0 && <Tab1 />}
        {activeTab === 1 && <Tab2 />}
        {activeTab === 2 && <Tab3 />}
        {activeTab === 3 && <Tab4 />}
      </div>
    </div>
  )
}
