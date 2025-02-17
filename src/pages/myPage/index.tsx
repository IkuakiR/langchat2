'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/myPage/page.module.scss';

export default function MyPage() {
    return (
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
            <h1 className={styles.myPageTitle}>マイページ</h1>
            <div className={styles.myPageGrid}>
                {/* 上段のグリッド */}
                <div className={styles.topRow}>
                    <div className={styles.user}>
                        <h2 className={styles.contentTitle}>USER</h2>
                        <Image
                            src="/images/profileImg.svg"
                            alt=""
                            width={287}
                            height={182}
                            className={styles.profileImg}
                        />
                        <p className={styles.userName}>ikuchan0311</p>
                    </div>
                    <div className={styles.bio}>
                        <h2 className={styles.contentTitle}>BIO</h2>
                        <p className={styles.bioText}>
                            いつかヨーロッパに旅行に行きたいので<br />
                            ドイツ語を勉強中！！<br />
                            カメラに興味があります＾＾<br />
                            Nice to meet you!<br />
                            I wanna go to germany sometime!
                        </p>
                    </div>
                    <div className={styles.location}>
                        <h2 className={styles.contentTitle}>LOCATION</h2>
                        <Image
                            src="/images/japanphoto.svg"
                            alt=""
                            width={322}
                            height={180}
                            className={styles.japanImg}
                        />
                        <p className={styles.locationName}>JAPAN</p>
                    </div>
                </div>
                <div className={styles.bottomRow}>
                    <div className={styles.language}>
                        <h2 className={styles.contentTitle}>LANGUAGE</h2>
                        <div className={styles.langType}>
                            <p>JPN</p>
                            <p>CHN</p>
                            <p>ENG</p>
                            <p>+</p>
                        </div>
                    </div>
                    <div className={styles.bookmark}>
                        <div className={styles.bookmarkTop}>
                            <h2 className={styles.contentTitle}>BOOKMARK</h2>
                            <Link href="/bookMark/" className={styles.moreLink}>
                                watch more→
                            </Link>
                        </div>
                        <div className={styles.bookmarkContents}>
                            <div className={styles.bookmarkContent}>
                                <Image
                                    src="/images/usaIcon.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    className={styles.langIcon}
                                />
                                <p>What&apos;s good?</p>
                            </div>
                            <div className={styles.bookmarkContent}>
                                <Image
                                    src="/images/germanyIcon.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                    className={styles.langIcon}
                                />
                                <p>Auf jeden</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
