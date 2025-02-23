import styles from "../styles/firststep.module.css"; 
import Image from "next/image";
import Link from "next/link";

export default function FirstStep() {
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
                    <li><Link href="/lipsync">Favorite Character Message</Link></li>
                    <li className={styles.auth}><Link href="/login">Login / Sign Up</Link></li>
                </ul>
            </nav>

            {/* Page Title */}
            <h2 className={styles.title}>Oral & Breath Control Training</h2>

            {/* Big Box Navigation */}
            <div className={styles.boxContainer}>
                <Link href="/firststep/mouth-analyze">
                    <div className={styles.analysisBox}>
                        <h3>Mouth Analyzer</h3>
                        <p>Analyze your mouth movements for better speech.</p>
                    </div>
                </Link>

                <Link href="/firststep/tongue-analyze">
                    <div className={styles.analysisBox}>
                        <h3>Tongue Analyzer</h3>
                        <p>Track and improve your tongue movements.</p>
                    </div>
                </Link>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerLogo}>
                    <Image src="/logo.png" alt="Fluention Logo" width={130} height={50}/>
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
