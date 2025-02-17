'use client';

import styles from '@/styles/chatDone/page.module.scss';
import Image from "next/image";
import Link from 'next/link';

export default function ChatDone() {
    return (
        <>
            <div className={styles.container}>
                <p className={styles.pageHeader}>Thank you for talking!</p>
                <Image src={'/images/chatDoneImg.svg'} alt="chatDoneImg" width={780} height={585} className={styles.chatDoneImg} />
                <p className={styles.howsTalk}>相手の対応はいかがでしたか？</p>
                <div className={styles.evaluationFace}>
                    <Image src={'/images/badFace.svg'} alt="languagesIcon" width={80} height={80} className={styles.sideIcon} />
                    <Image src={'/images/goodFace.svg'} alt="languagesIcon" width={80} height={80} className={styles.sideIcon} />
                </div>
                <div className={styles.sendForm}>
                    <input
                        type="text"
                        placeholder='お話してくれてありがとうございました！'
                    />
                </div>
                <Link href={'/'}>
                    <button className={styles.backHomeButton}>ホームに戻る</button>
                </Link>
            </div>
        </>
    );
}