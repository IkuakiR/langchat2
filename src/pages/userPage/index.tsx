'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/userPage/page.module.scss';

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
            <h1 className={styles.myPageTitle}>ユーザーページ</h1>
            <div className={styles.myPageGrid}>
                <div className={styles.topRow}>
                    <div className={styles.user}>
                        <h2 className={styles.contentTitle}>USER</h2>
                        <Image
                            src="/images/female1.svg"
                            alt=""
                            width={287}
                            height={182}
                            className={styles.profileImg}
                        />
                        <p className={styles.userName}>Lim Nayeon</p>
                    </div>
                    <div className={styles.bio}>
                        <h2 className={styles.contentTitle}>BIO</h2>
                        <p className={styles.bioText}>
                            日本のアニメが大好きな韓国人です<br />
                            仲良くしてくださいね！<br />
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
                        <p className={styles.locationName}>KOREA</p>
                    </div>
                </div>
                <div className={styles.middleRow}>
                    <div className={styles.language}>
                        <h2 className={styles.contentTitle}>LANGUAGE</h2>
                        <div className={styles.langType}>
                            <p>JPN</p>
                            <p>KOR</p>
                            <p>ENG</p>
                            <p>+</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
