'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/chatHistory/page.module.scss';

export default function chatHistory() {

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
                    <span className={styles.bookmarkText}> _ チャット履歴</span>
                </h1>
                <div className={styles.historyContainer}>
                    <div className={styles.historyContent}>
                        <div className={styles.historyItem}>
                            <Image
                                src="/images/femaleIcon.svg"
                                alt=""
                                width={60}
                                height={60}
                                className={styles.userIcon}
                            />
                            <div className={styles.userInfo}>
                                <p className={styles.userName}>Lim Nayeon</p>
                                <p className={styles.chatTime}>2025/02/16 14:42</p>
                            </div>
                        </div>
                        <Link href="/userPage/">
                            <div className={styles.toUserProfile}>
                                <p>ユーザーページを見る</p>
                                <Image
                                    src="/images/bookmark_triangle.svg"
                                    alt=""
                                    width={35}
                                    height={35}
                                    className={styles.detailIcon}
                                />
                            </div>
                        </Link>
                    </div>
                    <div className={styles.historyContent}>
                        <div className={styles.historyItem}>
                            <Image
                                src="/images/maleIcon.svg"
                                alt=""
                                width={60}
                                height={60}
                                className={styles.userIcon}
                            />
                            <div className={styles.userInfo}>
                                <p className={styles.userName}>George Patton</p>
                                <p className={styles.chatTime}>2025/02/16 8:16</p>
                            </div>
                        </div>
                        <Link href="/userPage/">
                            <div className={styles.toUserProfile}>
                                <p>ユーザーページを見る</p>
                                <Image
                                    src="/images/bookmark_triangle.svg"
                                    alt=""
                                    width={35}
                                    height={35}
                                    className={styles.detailIcon}
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}