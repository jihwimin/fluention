import styles from '../styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
      <div className={styles.container}>
          {/* Navigation Bar */}
          <nav className={styles.navbar}>
              <div className={styles.logo}>
                    <Link href="/">
                        <Image src="/logo.png" alt="Fluention Logo" width={170} height={170} />
                    </Link>
              </div>
              <ul className={styles.navLinks}>
                  <li><Link href="/explanation">What is Language Disorder?</Link></li>
                  <li><Link href="/speechassistant">Speech Assistant</Link></li>
                  <li><Link href="/translator">Translator</Link></li>
                  <li><Link href="/about">About Us</Link></li>
                  <li className={styles.auth}><Link href="/login">Login / Sign Up</Link></li>
              </ul>
          </nav>

          {/* navigation finish */}


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
<<<<<<< HEAD
                      <button className={`${styles.learnMoreBtn} ${styles.learnMoreLeft}`}>Learn More</button>
=======
                      <Link href="/speechassistant">
                          <button className={`${styles.learnMoreBtn} ${styles.learnMoreLeft}`}>Learn More</button>
                      </Link>
>>>>>>> e0f6d2898e596e0a1af72fe1cfe32254b38736f6
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
<<<<<<< HEAD
                      <button className={`${styles.learnMoreBtn} ${styles.learnMoreRight}`}>Learn More</button>
=======
                      <Link href="/translator">
                          <button className={`${styles.learnMoreBtn} ${styles.learnMoreRight}`}>Learn More</button>
                      </Link>
>>>>>>> e0f6d2898e596e0a1af72fe1cfe32254b38736f6
                  </div>
              </div>

          </section>


          <section className={styles.aboutUs}>
              <h2 className={styles.aboutTitle}>About Us</h2>
              <div className={styles.underline}></div>

              {/* White Rectangle to Cover Middle Border */}
              <div className={styles.whiteCover}></div>

              {/* Profile Images (They should overlap) */}
              <div className={styles.profileImages}>
                  <div className={styles.profileWrapper}>
                      <Image src="/민지인.png" alt="Team Member 1" width={80} height={80}/>
                  </div>
                  <div className={styles.profileWrapper}>
                      <Image src="/민지휘.JPG" alt="Team Member 2" width={80} height={80}/>
                  </div>
                  <div className={styles.profileWrapper}>
                      <Image src="/백낙준.jpeg" alt="Team Member 3" width={80} height={80}/>
                  </div>
                  <div className={styles.profileWrapper}>
                      <Image src="/전윤제.jpeg" alt="Team Member 4" width={80} height={80}/>
                  </div>
              </div>

              {/* About Us Description */}
              <div className={styles.aboutContent}>
                  <p>
                      At Fluention, we believe that everyone deserves to be heard and understood. Inspired
                      by personal experiences with loved ones who have developmental and speech disorders, we saw
                      firsthand the frustration of being unable to express thoughts clearly.
                  </p>
                  <p>
                      While communication challenges can be isolating, the right tools can bridge the gap.
                      That’s why we built Fluention—an AI-powered platform designed to assist with speech therapy
                      and translate language disorders into clear, understandable communication.
                  </p>
                  <p>
                      Using neuroscience-backed methods and cutting-edge AI, we help individuals train, improve,
                      and express themselves with confidence.
                  </p>
              </div>

              {/* Learn More Button */}
              <button className={styles.learnMoreBtn}>Learn More</button>
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


