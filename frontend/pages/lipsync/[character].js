import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/lipsync.module.css";

export default function LipsyncVideo() {
  const router = useRouter();
  const { character } = router.query; // Get character name from URL

  // Ensure the character is defined before using it
  if (!character) return null;

  // Map character to corresponding video file
  const videoSrc = `/lipsyncs/sync_${character}.mp4`;

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
      {/* navigation finish */}

      {/* Page Title */}
      <h2 className={styles.title}>{character.charAt(0).toUpperCase() + character.slice(1)}'s Words</h2>

      {/* Video Container */}
      <div className={styles.videoContainer}>
        <video className={styles.video} controls autoPlay>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
