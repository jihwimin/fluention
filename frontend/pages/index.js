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
              <p>Many individuals with autism, neurodivergent conditions, or speech disorders (such as dysarthria,
                  aphasia, or apraxia of speech)
                  struggle with pronunciation, sentence formation, and comprehension. Despite advancements in AI, there
                  is no comprehensive tool
                  that both enhances speech clarity and simplifies complex information for better understanding. This
                  makes communication and
                  learning challenging for many.</p>
          </section>

          <section className={styles.solutionSection}>
              <h2 className={styles.solutionTitle}>Solution</h2>
              <p className={styles.solutionDescription}>
                  Our AI-driven platform helps you pronounce better, understand faster, and communicate effortlessly—
                  all with personalized support.
              </p>

              {/* Large Background Numbers */}
              <div className={`${styles.bigNumber} ${styles.number1}`}>1</div>
              <div className={`${styles.bigNumber} ${styles.number2}`}>2</div>

              {/* Circles */}
              <div className={`${styles.circle} ${styles.yellowCircle}`}></div>
              <div className={`${styles.circle} ${styles.orangeCircle}`}></div>

              {/* AI Services */}
              <div className={styles.services}>
                  {/* Left Service Box (Moves Up) */}
                  <div className={`${styles.serviceBox} ${styles.serviceBoxLeft}`}>
                      <h3 className={`${styles.serviceTitle} ${styles.serviceTitleLeft}`}>
                          AI Speech Language Pathologist Assistant
                      </h3>
                      <p>
                          Fluention’s AI-powered speech therapy is inspired by speech and rehabilitation programs
                          from top university hospitals and integrates clinically validated neuroscience research
                          on dysarthria rehabilitation. Train your pronunciation, articulation, and speech clarity
                          with a structured, science-backed approach—anytime, anywhere
                      </p>
                      <button className={`${styles.learnMoreBtn} ${styles.learnMoreLeft}`}>Learn More</button>
                  </div>

                  {/* Right Service Box (Moves Down) */}
                  <div className={`${styles.serviceBox} ${styles.serviceBoxRight}`}>
                      <h3 className={`${styles.serviceTitle} ${styles.serviceTitleRight}`}>
                          AI-Powered Language Disorder Translator
                      </h3>
                      <p>
                          Fluention’s AI-powered Language Disorder Translator helps individuals with speech and
                          language impairments express themselves clearly. By translating unclear speech, fragmented
                          sentences, and complex texts into structured, understandable language, our AI bridges the
                          gap between thought and communication.
                      </p>
                      <button className={`${styles.learnMoreBtn} ${styles.learnMoreRight}`}>Learn More</button>
                  </div>
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


