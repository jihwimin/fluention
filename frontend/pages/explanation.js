import styles from '../styles/explanation.module.css';
import Image from "next/image";
import Link from 'next/link';


export default function Explanation() {
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
              
              {/* Two Overlapping Circles */}
              <div className={styles.yellowCircle}></div>
              <div className={styles.orangeCircle}></div>
              <div className={styles.whiteCover1}></div>
              {/* White Cutout */}
              <div className={styles.whiteCover2}></div>
              {/* White Cutout */}
              {/*lower orange and white circles*/}
              <div className={styles.lowerOrangeCircle}></div>
              <div className={styles.lowerWhiteCircle}></div>
              {/* Hero Text */}
              <h1 className={styles.heroText}>
                  <span className={styles.line1}>What is Language Disorder?</span>
              </h1>
          </div>


          {/* Understanding Language Disorders Section */}
          <section className={styles.languageDisorderSection}>
              <h2 className={styles.sectionTitle}>Understanding Language Disorders</h2>
              <div className={styles.descriptionBox}>
                <p>
                  Language disorder refers to difficulties in understanding, processing, or expressing language. 
                  It is not simply about mispronouncing words or having a speech delay—it involves challenges in 
                  comprehension, sentence structure, vocabulary use, and the ability to convey thoughts meaningfully.
                </p>
                <p>
                  Language disorders can affect both spoken and written communication and may persist from 
                  childhood into adulthood. Without appropriate support, individuals with language disorders 
                  often struggle with learning, social interactions, and daily communication.
                </p>
                <p>
                  Language disorders can be classified into receptive, expressive, and mixed language disorders, 
                  each affecting different aspects of communication.
                </p>
              </div>
          </section>


          <section className={styles.languageDisorders}>
              <h2 className={styles.sectionTitle}>Types of Language Disorders</h2>

              <div className={styles.disorder}>
                  <h3 className={styles.disorderTitle}>
                      <a href="#">Receptive Language Disorder (Difficulty Understanding Language)</a>
                  </h3>
                  <p>
                      People with receptive language disorder struggle to understand spoken or written language. They may:
                  </p>
                  <ul>
                      <li>Have difficulty following instructions or processing what is being said.</li>
                      <li>Struggle with understanding complex sentences or figurative language.</li>
                      <li>Frequently ask for repetition or clarification.</li>
                      <li>Misinterpret words or conversations, leading to confusion in social situations.</li>
                  </ul>
              </div>

              <div className={styles.disorder}>
                  <h3 className={styles.disorderTitle}>
                      <a href="#">Expressive Language Disorder (Difficulty Using Language)</a>
                  </h3>
                  <p>
                      Individuals with expressive language disorder have trouble forming sentences, choosing the right words, or structuring their thoughts into clear communication. They may:
                  </p>
                  <ul>
                      <li>Speak in short, incomplete sentences or struggle with proper grammar.</li>
                      <li>Have limited vocabulary and repeat simple words instead of using varied expressions.</li>
                      <li>Find it hard to describe events, share ideas, or hold a conversation.</li>
                      <li>Struggle with naming objects or recalling words, even when they recognize them.</li>
                  </ul>
              </div>

              <div className={styles.disorder}>
                  <h3 className={styles.disorderTitle}>
                      <a href="#">Mixed Receptive-Expressive Language Disorder</a>
                  </h3>
                  <p>
                      Some individuals experience both receptive and expressive difficulties, meaning they struggle
                      to understand language and express themselves effectively. This can significantly impact
                      learning, social interactions, and overall communication ability.
                  </p>
              </div>
          </section>

          <section className={styles.causesSection}>
              <h2 className={styles.sectionTitle}>Causes of Language Disorders</h2>

              <div className={styles.causesContainer}>
                  {/* Neurological Injuries */}
                  <div className={`${styles.circle} ${styles.orangeBorder}`}>
                      <h3 className={styles.causesTitle}>
                          <a href="#">Neurological Injuries or Conditions</a>
                      </h3>
                      <ul>
                          <li>Traumatic brain injuries (TBI)</li>
                          <li>Aphasia due to stroke</li>
                          <li>Brain tumors or degenerative diseases</li>
                      </ul>
                  </div>

                  {/* Neurodevelopmental Conditions */}
                  <div className={`${styles.circle} ${styles.yellowBorder}`}>
                      <h3 className={styles.causesTitle}>
                          <a href="#">Neurodevelopmental Conditions</a>
                      </h3>
                      <ul>
                          <li>Autism Spectrum Disorder (ASD)</li>
                          <li>Attention-Deficit Hyperactivity Disorder (ADHD)</li>
                          <li>Intellectual Disabilities</li>
                      </ul>
                  </div>

                  {/* Hearing Impairments */}
                  <div className={`${styles.circle} ${styles.orangeBorder}`}>
                      <h3 className={styles.causesTitle}>
                          <a href="#">Hearing Impairments & Auditory Processing Disorders</a>
                      </h3>
                      <ul>
                          <li>Difficulty distinguishing or processing speech sounds correctly</li>
                      </ul>
                  </div>

                  {/* Genetic & Environmental Factors */}
                  <div className={`${styles.circle} ${styles.yellowBorder}`}>
                      <h3 className={styles.causesTitle}>
                          <a href="#">Genetic & Environmental Factors</a>
                      </h3>
                      <ul>
                          <li>Family history of language disorders</li>
                          <li>Limited language exposure in early childhood</li>
                      </ul>
                  </div>
              </div>
          </section>

          <section className={styles.impactSection}>
              <h2 className={styles.sectionTitle}>How Language Disorders Impact Daily Life</h2>
              <p className={styles.impactDescription}>
                  Language disorders are not just about speech difficulties—they affect education, 
                  social interactions, emotional well-being, and daily tasks.
              </p>

              <div className={styles.impactContainer}>
                  {/* Children & Students */}
                  <div className={`${styles.impactBox} ${styles.leftBox}`}>
                      <h3 className={styles.impactTitle}>Children & Students</h3>
                      <ul>
                          <li>Struggles with reading, writing, and understanding lessons.</li>
                          <li>Difficulty following classroom instructions, leading to frustration.</li>
                          <li>Social challenges due to misunderstandings with peers.</li>
                      </ul>
                  </div>

                  {/* Adults */}
                  <div className={`${styles.impactBox} ${styles.rightBox}`}>
                      <h3 className={styles.impactTitle}>Adults</h3>
                      <ul>
                          <li>Workplace communication challenges, making collaboration difficult.</li>
                          <li>Struggles with expressing thoughts clearly in conversations.</li>
                          <li>Frustration and social withdrawal due to communication barriers.</li>
                      </ul>
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
