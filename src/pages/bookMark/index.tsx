'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/bookMark/page.module.scss';

interface BookmarkMessage {
    id: string;
    text: string;
    sender: number;
    createdAt: number;
    username: string;
    time: string;
    messageId: string;
    translatedText?: string;
    lang?: string; // 例: "english", "german", "chinese", "korean", "french"
    learned?: boolean;
}

export default function BookMark() {
    // 状態管理
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkMessage | null>(null);
    const [bookmarks, setBookmarks] = useState<BookmarkMessage[]>([]);
    // フィルター用状態：言語フィルタ（selectBox）と習得済みフィルタ（filterOption）
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [filterType, setFilterType] = useState<'all' | 'learned'>('all');

    // 動的ブックマークの読み込み（localStorage）
    useEffect(() => {
        const stored = localStorage.getItem('bookmarks');
        if (stored) {
            try {
                setBookmarks(JSON.parse(stored));
            } catch (error) {
                console.error('Error parsing bookmarks:', error);
            }
        }
    }, []);

    // 静的なダミーデータ（lang, learned を付与）
    const staticBookmarks: BookmarkMessage[] = [
        {
            id: 'dummy1',
            text: "What's good?",
            sender: 0,
            createdAt: Date.now(),
            username: 'Dummy',
            time: '',
            messageId: 'dummy1',
            lang: 'english',
            learned: false,
        },
        {
            id: 'dummy2',
            text: 'Auf jeden',
            sender: 0,
            createdAt: Date.now(),
            username: 'Dummy',
            time: '',
            messageId: 'dummy2',
            lang: 'german',
            learned: false,
        },
        {
            id: 'dummy3',
            text: 'For sure',
            sender: 0,
            createdAt: Date.now(),
            username: 'Dummy',
            time: '',
            messageId: 'dummy3',
            lang: 'english',
            learned: false,
        },
        {
            id: 'dummy4',
            text: '打酱油',
            sender: 0,
            createdAt: Date.now(),
            username: 'Dummy',
            time: '',
            messageId: 'dummy4',
            lang: 'chinese',
            learned: false,
        },
        {
            id: 'dummy5',
            text: 'Krass',
            sender: 0,
            createdAt: Date.now(),
            username: 'Dummy',
            time: '',
            messageId: 'dummy5',
            lang: 'german',
            learned: false,
        },
    ];

    // 両方をまとめる
    const allBookmarks = [...bookmarks, ...staticBookmarks];

    // フィルター処理：言語フィルタと、filterType（全て or 習得済み）で絞り込む
    const filteredBookmarks = allBookmarks.filter((bm) => {
        const langMatch = selectedLanguage === 'all' || bm.lang === selectedLanguage;
        const typeMatch = filterType === 'all' || bm.learned;
        return langMatch && typeMatch;
    });

    const handleDeleteBookmark = (id: string) => {
        // 動的なブックマークのみ削除（sender !== 0）
        const updated = bookmarks.filter((bm) => bm.id !== id);
        setBookmarks(updated);
        localStorage.setItem('bookmarks', JSON.stringify(updated));
    };

    const handleShowDetail = (bm: BookmarkMessage) => {
        setSelectedBookmark(bm);
        setModalOpen(true);
    };

    // モーダル内の「習得した」ボタン押下で learned フラグを更新
    const handleMarkLearned = () => {
        if (!selectedBookmark) return;
        const updatedBookmark = { ...selectedBookmark, learned: true };
        setSelectedBookmark(updatedBookmark);
        // 動的ブックマークの場合は更新する
        if (selectedBookmark.sender !== 0) {
            const updatedDynamic = bookmarks.map((bm) =>
                bm.id === selectedBookmark.id ? { ...bm, learned: true } : bm
            );
            setBookmarks(updatedDynamic);
            localStorage.setItem('bookmarks', JSON.stringify(updatedDynamic));
        }
        setModalOpen(false);
    };

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Link href="/">
                        <div className={styles.logoSet}>
                            <Image
                                src="/images/logo.svg"
                                alt="langchatLogo"
                                width={120}
                                height={80}
                                className={styles.logo}
                            />
                            <Image
                                src="/images/logo_text.svg"
                                alt="langchatLogoText"
                                width={190}
                                height={48}
                                className={styles.logoText}
                            />
                        </div>
                    </Link>
                    <Link href="/myPage">
                        <Image
                            src="/images/profile.svg"
                            alt="profileIcon"
                            width={65}
                            height={65}
                            className={styles.profileIcon}
                        />
                    </Link>
                </header>
                <h1 className={styles.myPageTitle}>
                    <Link href="/myPage/">
                        <span className={styles.myPageText}>マイページ</span>
                    </Link>
                    <span className={styles.bookmarkText}> _ ブックマーク</span>
                </h1>

                <div className={styles.bookmarkContainer}>
                    {filteredBookmarks.length > 0 &&
                        filteredBookmarks.map((bookmark) => (
                            <div key={bookmark.id} className={styles.bookmarkItem}>
                                <div className={styles.bookmarkContent}>
                                    <Image
                                        src={
                                            bookmark.lang === 'german'
                                                ? '/images/gerIcon.svg'
                                                : bookmark.lang === 'chinese'
                                                    ? '/images/chinaIcon.svg'
                                                    : bookmark.lang === 'korean'
                                                        ? '/images/koreanIcon.svg'
                                                        : bookmark.lang === 'french'
                                                            ? '/images/frenchIcon.svg'
                                                            : '/images/usaIcon.svg'
                                        }
                                        alt=""
                                        width={40}
                                        height={40}
                                        className={styles.langIcon}
                                    />
                                    <p>{bookmark.text}</p>
                                </div>
                                <div className={styles.iconContainer}>
                                    {bookmark.sender !== 0 && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteBookmark(bookmark.id)}
                                        >
                                            削除
                                        </button>
                                    )}
                                    <div
                                        className={styles.detailIconContainer}
                                        onClick={() => handleShowDetail(bookmark)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Image
                                            src="/images/bookmark_triangle.svg"
                                            alt=""
                                            width={35}
                                            height={35}
                                            className={styles.detailIcon}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div className={styles.selectBoxContainer}>
                        <select
                            className={styles.selectBox}
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            <option value="all">全言語</option>
                            <option value="english">英語</option>
                            <option value="german">ドイツ語</option>
                            <option value="chinese">中国語</option>
                            <option value="korean">韓国語</option>
                            <option value="french">フランス語</option>
                        </select>
                    </div>
                    <div className={styles.filterOption}>
                        <p
                            className={`${styles.filterOptionItem} ${filterType === 'all' ? styles.active : styles.inactive
                                }`}
                            onClick={() => setFilterType('all')}
                        >
                            全て
                        </p>
                        <p
                            className={`${styles.filterOptionItem} ${filterType === 'learned' ? styles.active : styles.inactive
                                }`}
                            onClick={() => setFilterType('learned')}
                        >
                            習得済み
                        </p>
                    </div>
                </div>
            </div>

            {modalOpen && selectedBookmark && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)}></button>
                        <div className={styles.langType}>
                            <Image
                                src="/images/usaFlag2.svg"
                                alt=""
                                width={127}
                                height={85}
                                className={styles.usaFlag}
                            />
                            <p>英語</p>
                        </div>
                        <p className={styles.fraise}>{selectedBookmark.text}</p>
                        <p className={styles.example}>
                            {selectedBookmark.translatedText
                                ? selectedBookmark.translatedText
                                : '（翻訳結果なし）'}
                        </p>
                        <button className={styles.learnedButton} onClick={handleMarkLearned}>
                            習得した
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}