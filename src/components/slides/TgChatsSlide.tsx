import { useState } from 'react'
import type { TgChatsContent, TgChatItem, TgChatCard } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: TgChatsContent
}

function Avatar({
  avatarImage, avatarGradient, avatarEmoji, avatarText, className,
}: Pick<TgChatItem, 'avatarImage' | 'avatarGradient' | 'avatarEmoji' | 'avatarText'> & { className: string }) {
  if (avatarImage) {
    return (
      <div className={className} style={{ background: '#333' }}>
        <img src={avatarImage} alt="" className={styles.tgAvatarImg} />
      </div>
    )
  }
  return (
    <div className={className} style={{ background: avatarGradient ?? '#555' }}>
      {avatarEmoji ?? avatarText ?? ''}
    </div>
  )
}

export function TgChatsSlide({ content }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'triggers'>('all')
  const [activeCardId, setActiveCardId] = useState<string>(content.chats[0]?.cardId ?? '')
  const [activeChatId, setActiveChatId] = useState<string>(content.chats[0]?.id ?? '')

  const visibleChats = activeTab === 'all'
    ? content.chats
    : content.chats.filter(c => c.cardId === 'triggers')

  const activeCard: TgChatCard | undefined = content.cards.find(c => c.id === activeCardId)

  function handleChatClick(chat: TgChatItem) {
    setActiveChatId(chat.id)
    setActiveCardId(chat.cardId)
  }

  return (
    <div className={styles.tgFull}>
      <div className={styles.tgSidebar}>
        <div className={styles.tgHeader}>
          <div className={styles.tgHeaderTitle}>Чаты</div>
          <div className={styles.tgTabs}>
            <div
              className={`${styles.tgTab} ${activeTab === 'all' ? styles.tgTabActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Все
            </div>
            <div
              className={`${styles.tgTab} ${activeTab === 'triggers' ? styles.tgTabActive : ''}`}
              onClick={() => setActiveTab('triggers')}
            >
              Триггеры
            </div>
          </div>
        </div>

        <div className={styles.tgChatList}>
          {visibleChats.map(chat => (
            <div
              key={chat.id}
              className={`${styles.tgChat} ${chat.id === activeChatId ? styles.tgChatActive : ''}`}
              onClick={() => handleChatClick(chat)}
            >
              <Avatar
                avatarImage={chat.avatarImage}
                avatarGradient={chat.avatarGradient}
                avatarEmoji={chat.avatarEmoji}
                avatarText={chat.avatarText}
                className={styles.tgAvatar}
              />
              <div className={styles.tgChatInfo}>
                <div className={styles.tgChatName}>{chat.name}</div>
                <div className={styles.tgChatPreview}>{chat.preview}</div>
              </div>
              {chat.badge != null && (
                <div className={styles.tgBadge}>{chat.badge}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tgDetail}>
        <div className={styles.tgDetailHeader}>
          <div className={styles.tgDetailTitle}>Рабочие чаты</div>
          <div className={styles.tgDetailSubtitle}>Нажми на чат слева, чтобы узнать его назначение</div>
        </div>

        <div className={styles.tgDetailBody}>
          {activeCard ? (
            <div key={activeCard.id} className={styles.tgCard}>
              <div className={styles.tgCardHeader}>
                <Avatar
                  avatarImage={activeCard.avatarImage}
                  avatarGradient={activeCard.avatarGradient}
                  avatarEmoji={activeCard.avatarEmoji}
                  avatarText={activeCard.avatarText}
                  className={styles.tgCardAvatar}
                />
                <div className={styles.tgCardName}>{activeCard.name}</div>
              </div>
              <p className={styles.tgCardDesc}>{activeCard.description}</p>
              <span className={styles.tgCardTag}>{activeCard.tag}</span>
            </div>
          ) : (
            <div className={styles.tgDefaultHint}>
              <span>←</span>
              <span>Выбери чат из списка</span>
            </div>
          )}
        </div>

        <div className={styles.tgFooter}>
          {content.footerNote && (
            <span className={styles.tgFooterNote}>{content.footerNote}</span>
          )}
          {content.downloadUrl && (
            <a href={content.downloadUrl} className={styles.tgDownloadBtn} download>
              ↓ Скачать список чатов
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
