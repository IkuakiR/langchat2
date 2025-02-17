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
}

export default function BookMark() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBookmark, setSelectedBookmark] = useState<BookmarkMessage | null>(null);
    const [bookmarks, setBookmarks] = useState<BookmarkMessage[]>([]);

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

    const handleDeleteBookmark = (id: string) => {
        const updatedBookmarks = bookmarks.filter((bm) => bm.id !== id);
        setBookmarks(updatedBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    };

    const handleShowDetail = (bm: BookmarkMessage) => {
        setSelectedBookmark(bm);
        setModalOpen(true);
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
                    {bookmarks.length > 0 &&
                        bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className={styles.bookmarkItem}>
                                <div className={styles.bookmarkContent}>
                                    <Image
                                        src="/images/usaIcon.svg"
                                        alt=""
                                        width={40}
                                        height={40}
                                        className={styles.langIcon}
                                    />
                                    <p>{bookmark.text}</p>
                                </div>
                                <div className={styles.iconContainer}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteBookmark(bookmark.id)}
                                    >
                                        削除
                                    </button>
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

                    <div className={styles.bookmarkItem}>
                        <div className={styles.bookmarkContent}>
                            <Image
                                src="/images/usaIcon.svg"
                                alt=""
                                width={40}
                                height={40}
                                className={styles.langIcon}
                            />
                            <p>What&apos;s good?</p>
                        </div>
                        <div
                            className={styles.detailIconContainer}
                            onClick={() => setModalOpen(true)}
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
                    <div className={styles.bookmarkItem}>
                        <div className={styles.bookmarkContent}>
                            <Image
                                src="/images/gerIcon.svg"
                                alt=""
                                width={40}
                                height={40}
                                className={styles.langIcon}
                            />
                            <p>Auf jeden</p>
                        </div>
                        <div
                            className={styles.detailIconContainer}
                            onClick={() => setModalOpen(true)}
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
                    <div className={styles.bookmarkItem}>
                        <div className={styles.bookmarkContent}>
                            <Image
                                src="/images/usaIcon.svg"
                                alt=""
                                width={40}
                                height={40}
                                className={styles.langIcon}
                            />
                            <p>For sure</p>
                        </div>
                        <div
                            className={styles.detailIconContainer}
                            onClick={() => setModalOpen(true)}
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
                    </div>
                </div>
            )}
        </>
    );
}