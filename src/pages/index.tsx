'use client';

import styles from '@/styles/indexPage/page.module.scss';
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <Image src={'/images/logo.svg'} alt="langchatLogo" width={120} height={80} className={styles.logo} />
          <div className={styles.title}>
            <Image src={'/images/logo_text.svg'} alt="langchatLogoText" width={238} height={61} className={styles.logoText} />
            <p className={styles.welcomeText}>へようこそ！</p>
          </div>
          <Link href="/myPage">
            <Image src={'/images/profile.svg'} alt="profileIcon" width={65} height={65} className={styles.profileIcon} />
          </Link>
        </header>

        <main className={styles.main}>
          <h2 className={styles.mainTitle}>今日はどんなお話がしたいですか？</h2>

          <div className={styles.content}>
            <aside className={styles.sidebar}>
              <div className={styles.languages}>
                <Image src={'/images/languagesImg.svg'} alt="languagesIcon" width={65} height={65} className={styles.sideIcon} />
                <p className={styles.sideText}>言語</p>
              </div>
              <div className={styles.hobbies}>
                <Image src={'/images/hobbyImg.svg'} alt="profileIcon" width={65} height={65} className={styles.sideIcon} />
                <p className={styles.sideText}>趣味</p>
              </div>
              <div className={styles.regions}>
                <Image src={'/images/regionImg.svg'} alt="profileIcon" width={65} height={65} className={styles.sideIcon} />
                <p className={styles.sideText}>国・地域</p>
              </div>
            </aside>

            <section className={styles.selectSection}>
              <div className={styles.gridTop}>
                {[
                  '/images/usaFlag.svg',
                  '/images/germanyFlag.svg',
                  '/images/chinaFlag.svg',
                  '/images/koreaFlag.svg',
                  '/images/italyFlag.svg'
                ].map((src, index) => (
                  <div key={index} className={styles.gridItem}>
                    <Image
                      src={src}
                      alt={`Flag ${index + 1}`}
                      fill
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.roomList}>
                <ul>
                  <li className={styles.roomItem}>
                    <Link href="/chatRoom">
                      <div className={styles.imageWrapper}>
                        <Image
                          src={'/images/male1.svg'}
                          alt=""
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      </div>
                    </Link>
                    <span className={styles.roomLabel}>ルーム01</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/male2.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム02</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/female1.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム03</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/male1.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム04</span>
                  </li>
                  <li className={styles.roomItem}>
                    <a href="">
                      <div className={styles.imageWrapper}>
                        <Image
                          src={'/images/male2.svg'}
                          alt=""
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      </div>
                    </a>
                    <span className={styles.roomLabel}>ルーム05</span>
                  </li>
                </ul>

                <ul>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/female1.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム06</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/male3.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム07</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/male1.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム08</span>
                  </li>
                  <li className={styles.roomItem}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={'/images/male2.svg'}
                        alt=""
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                    <span className={styles.roomLabel}>ルーム09</span>
                  </li>
                  <li className={styles.roomItem}>
                    <a href="">
                      <div className={styles.imageWrapper}>
                        <Image
                          src={'/images/male3.svg'}
                          alt=""
                          fill
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                      </div>
                    </a>
                    <span className={styles.roomLabel}>ルーム10</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
