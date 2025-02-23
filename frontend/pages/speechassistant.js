import styles from '../styles/speechassistant.module.css';
import Image from "next/image";
import Link from 'next/link';


export default function SpeechAssistant() {
  return (
    <div className={styles.container}>
          {/* Navigation Bar */}
          <nav className={styles.navbar}>
              <div className={styles.logo}>
                  <Image src="/logo.png" alt="Fluention Logo" width={170} height={170}/>
              </div>
              <ul className={styles.navLinks}>
                  <li><Link href="/explanation">What is Language Disorder?</Link></li>
                  <li><Link href="/speechassistant">Speech Assistant</Link></li>
                  <li><Link href="/translator">Translator</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li className={styles.auth}><Link href="/login">Login / Sign Up</Link></li>
              </ul>
          </nav>

          {/* Large Yellow Circle */}
          <div className={styles.bigYellowCircle}></div>
          {/* Two Overlapping Circles */}
          <div className={styles.yellowCircle}></div>
          <div className={styles.orangeCircle}></div>
          <div className={styles.whiteCover1}></div>
          {/* White Cutout */}
          <div className={styles.whiteCover2}></div>
          {/* White Cutout */}


          <section className={styles.speechAssistant}>
              <div className={styles.titleContainer}>
                  <div className={styles.titleContainer}>
                      <h1 className={styles.title}>Speech Assistant</h1>
                  </div>
              </div>
        
              <div className={styles.boxContainer}>
                  <div className={styles.box}>
                      <Link href="/firststep">Oral & Breath Control Training</Link>
                  </div>
                  <div className={styles.box}>
                      <Link href="/secondstep">Receptive & Expressive Language Development</Link>
                  </div>
                  <div className={styles.box}>
                      <Link href="/thirdstep">Vocabulary Enhancement</Link>
                  </div>
                  <div className={styles.box}>
                      <Link href="/fourthstep">Contextual Communication Skills</Link>
                  </div>
              </div>
          </section>








          {/* footer begin */}
          <footer className={styles.footer}>
              {/* Logo */}
              <div className={styles.footerLogo}>
                  <Image src="/logo.png" alt="Fluention Logo" width={130} height={50}/>
              </div>

              {/* Footer Links */}
              <div className={styles.footerLinks}>
                  <div className={styles.footerColumn}>
                      <h4>What is Language Disorder?</h4>
                      <h4>Speech Assistant</h4>
                      <ul>
                          <li>Oral & Breath Control Training</li>
                          <li>Receptive & Expressive Language Development</li>
                          <li>Vocabulary Enhancement</li>
                          <li>Contextual Communication Skills</li>
                      </ul>
                  </div>

                  <div className={styles.footerColumn}>
                      <h4><Link href="/translator">Translator</Link></h4>
                      <h4><Link href="/about">About Us</Link></h4>
                  </div>

                  <div className={styles.footerColumn}>
                      <h4>Privacy Policy</h4>
                      <h4>Terms of Service</h4>
                      <h4>Resources & Legal Help</h4>
                  </div>
              </div>

              {/* Copyright */}
              <div className={styles.footerCopyright}>
                  <p>© 2025 Fluention. All Rights Reserved.</p>
              </div>
          </footer>
    </div>
  );
}