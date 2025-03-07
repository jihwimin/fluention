import styles from "../styles/lipsync.module.css";
import Image from "next/image";
import Link from "next/link";

export default function LipSync() {
  // Character Data (Image and Quote)
  const characters = [
    { src: "/lipsync/barbie.jpeg", quote: "Every night is girls' night.", width: 400, link: "/lipsync/barbie" },
    { src: "/lipsync/pooh.jpeg", quote: "I wasn't going to eat it, I was just going to taste it.", width: 400, link: "/lipsync/pooh" },
    { src: "/lipsync/charlie.jpeg", quote: "Keep looking up... that's the secret of life. ...", width: 400, link: "/lipsync/charlie" },
    { src: "/lipsync/dora.jpeg", quote: "Swiper, no swiping!", width: 400, link: "/lipsync/dora" },
    { src: "/lipsync/loopy.jpeg", quote: "Hi! My name is Loopy.", width: 400, link: "/lipsync/loopy" }
  ];

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
          <li><Link href="/lipsync">Favorite Character Message</Link></li>
          <li className={styles.auth}><Link href="/login">Login / Sign Up</Link></li>
        </ul>
      </nav>

      {/* Page Title */}
      <h2 className={styles.title}>Find Your Favorite Character!</h2>

      {/* Character Grid */}
      <div className={styles.characterGrid}>
        {characters.map((char, index) => (
          <div key={index} className={styles.characterCard}>
            <Link href={char.link}>
              <Image 
                src={char.src} 
                alt="Character" 
                width={char.width} 
                height={250} /* Constant Height */
                className={styles.characterImage} 
              />
            </Link>
            <p className={styles.quote}>"{char.quote}"</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <Image src="/logo.png" alt="Fluention Logo" width={130} height={50} />
        </div>
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
        <div className={styles.footerCopyright}>
          <p>© 2025 Fluention. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
