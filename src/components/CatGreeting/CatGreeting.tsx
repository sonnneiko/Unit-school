import { useState, useEffect, useMemo } from 'react'
import catImg from '../../assets/unit-cat/Лайк (2).png'
import styles from './CatGreeting.module.css'

const PHRASES = [
  'Привет! 👋',
  'Как дела?',
  'Рад тебя видеть!',
  'Я скучал)',
  'Как проходит обучение?',
  'Как настроение?',
  'Удачи в обучении!',
  'Я тут)',
  'Я ждал тебя!',
  'Люблю UnitPay!',
  'Хорошего денёчка ☀️',
  'Вперёд к новым знаниям!',
]

interface Props {
  onDone: () => void
}

export function CatGreeting({ onDone }: Props) {
  const [hiding, setHiding] = useState(false)
  const phrase = useMemo(() => PHRASES[Math.floor(Math.random() * PHRASES.length)], [])

  useEffect(() => {
    const hideTimer = setTimeout(() => setHiding(true), 3200)
    const doneTimer = setTimeout(onDone, 3700)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className={`${styles.wrap} ${hiding ? styles.hiding : ''}`}>
      <div className={styles.bubble}>
        {phrase}
        <span className={styles.bubbleTail} />
      </div>
      <img src={catImg} alt="Юнит" className={styles.cat} />
    </div>
  )
}
