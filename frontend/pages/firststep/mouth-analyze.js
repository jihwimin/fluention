import { useState } from "react";
import styles from "../../styles/mouth-analyze.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MouthAnalyze() {
    const exercises = [
        { text: "1st Exercise: Open Your Mouth", video: "/videos/mouth_wide.mp4" },
        { text: "2nd Exercise: Say 'oooo'", video: "/videos/say_o.mp4" },
        { text: "3rd Exercise: Say 'eeeee'", video: "/videos/say_e.mp4" }
    ];

    const [currentStep, setCurrentStep] = useState(0);

    const nextExercise = () => {
        if (currentStep < exercises.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            alert("All exercises completed! 🎉");
            setCurrentStep(0); // Reset to first exercise if needed
        }
    };

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

            {/* Page Title */}
            <h2 className={styles.title}>Oral & Breath Control Training</h2>

            {/* ✅ Exercise Container */}
            <div className={styles.exerciseContainer}>
                <h3>{exercises[currentStep].text}</h3>

                {/* ✅ Video Section */}
                <video 
                    key={currentStep}  /* Force re-render on state change */
                    className={styles.video} 
                    controls 
                    autoPlay 
                    loop
                >
                    <source src={exercises[currentStep].video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* ✅ Next Exercise Button */}
                <button className={styles.nextButton} onClick={nextExercise}>
                    Next Exercise ➡️
                </button>
            </div>

            {/* Camera Feed */}
            <div className={styles.cameraContainer}>
                <h3 className={styles.cameraTitle}>Live Mouth Analysis</h3>
                <div className={styles.cameraBox}>
                    <img className={styles.videoFeed} src="http://127.0.0.1:5001/video_feed" alt="Live Mouth Analysis" />
                </div>
            </div>

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
