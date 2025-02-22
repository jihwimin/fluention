import styles from '../styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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

          <div className={styles.hero}>
              {/* Large Yellow Circle */}
              <div className={styles.bigYellowCircle}></div>
              {/* Two Overlapping Circles */}
              <div className={styles.yellowCircle}></div>
              <div className={styles.orangeCircle}></div>
              <div className={styles.whiteCover1}></div>
              {/* White Cutout */}
              <div className={styles.whiteCover2}></div>
              {/* White Cutout */}

              {/* Hero Text */}
              <h1 className={styles.heroText}>
                  <span className={styles.line1}>Break Communication Barriers</span>
                  <span className={styles.line2}>with AI-Assisted Learning</span>
              </h1>

              {/* Bottom Right Logo */}
              <Image
                  className={styles.bottomRightLogo}
                  src="/logo.png"
                  alt="Fluention Logo"
                  width={130}
                  height={130}
              />

              {/* About Fluention */}
              <div className={styles.aboutText}>
                  <h2>What is Fluention?</h2>
                  <p>
                      <span className={styles["highlight-fluent"]}>Fluent:</span> Able to express oneself easily and
                      articulately.
                  </p>
                  <p>
                      <span className={styles["highlight-tion"]}>-tion:</span> Forming nouns of action.
                  </p>
              </div>

          </div>


          {/* Problem & Solution Sections */}
          <section className={styles.problem}>
              <h2>Problem</h2>
              <p>Many individuals with autism, neurodivergent conditions, or speech disorders struggle with
                  pronunciation, sentence formation, and comprehension...</p>
          </section>

          <section className={styles.solution}>
              <h2>Solution</h2>
              <p>Our AI-driven platform helps you pronounce better, understand faster, and communicate effortlessly—all
                  with personalized support.</p>
          </section>

          {/* AI Services */}
          <section className={styles.services}>
              <div className={styles.serviceBox}>
                  <h3>AI Speech Language Pathologist Assistant</h3>
                  <p>Fluention’s AI-powered speech therapy is inspired by speech and rehabilitation programs from top
                      university hospitals...</p>
                  <button className="button">Learn More</button>
              </div>
              <div className={styles.serviceBox}>
                  <h3>AI-Powered Language Disorder Translator</h3>
                  <p>Fluention’s AI-powered Language Disorder Translator helps individuals with speech and language
                      impairments express themselves clearly...</p>
                  <button className="button">Learn More</button>
              </div>
          </section>

          {/* About Us */}
          <section className={styles.aboutUs}>
              <h2>About Us</h2>
              <p>At Fluention, we believe that everyone deserves to be heard and understood...</p>
              <button className="button">Learn More</button>
          </section>

          {/* Footer */}
          <footer className={styles.footer}>
              <Image src="/logo.png" alt="Fluention Logo" width={170} height={170}/>
              <div className={styles.footerLinks}>
                  <Link href="/explanation">What is Language Disorder?</Link>
                  <Link href="/translator">Translator</Link>
                  <Link href="/speechassistant">Speech Assistant</Link>
                  <Link href="/about">About Us</Link>
              </div>
              <p>© 2025 Fluention. All Rights Reserved.</p>
          </footer>
      </div>
  );
}
