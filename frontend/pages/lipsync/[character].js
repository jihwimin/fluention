import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/lipsync.module.css";
import Image from "next/image";
import Link from "next/link";

export default function LipsyncVideo() {
    const router = useRouter();
    const { character } = router.query; // ✅ Get character from URL
    const [userText, setUserText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [lipsyncVideo, setLipsyncVideo] = useState(null);
    const [error, setError] = useState(null);

    // ✅ Define the default video path
    const videoPath = character ? `/lipsyncs/sync_${character}.mp4` : "";
    const characterTitle = character ? character.charAt(0).toUpperCase() + character.slice(1) : "";

    // ✅ Ensure default video plays on initial render
    useEffect(() => {
        if (character) {
            setLipsyncVideo(videoPath); // Load default character video
        }
    }, [character]);

    const generateLipsync = async () => {
        if (!character || !userText) {
            alert("Please enter text before generating!");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:8000/lipsync/generate", {
                character,
                text: userText
            });

            if (response.data && response.data.request_id) {
                checkLipsyncStatus(response.data.request_id);
            } else {
                setError("Failed to generate lipsync video.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Error generating lipsync:", err);
            setError("An error occurred while generating lipsync.");
            setIsLoading(false);
        }
    };

    const checkLipsyncStatus = async (requestId) => {
        let status = "pending";

        while (status === "pending") {
            try {
                const statusResponse = await axios.get(`http://localhost:8000/lipsync/status/${requestId}`);
                status = statusResponse.data.status;

                if (status === "completed") {
                    setLipsyncVideo(statusResponse.data.video_url); // ✅ Replace default video with generated lipsync
                    setIsLoading(false);
                    return;
                } else if (status === "failed") {
                    setError("Lipsync generation failed.");
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Error checking lipsync status:", err);
                setError("Failed to check lipsync status.");
                setIsLoading(false);
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 3000)); // ✅ Check status every 3 seconds
        }
    };

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
      <h2 className={styles.title}>{characterTitle}'s Words</h2>
      
            {/* ✅ Video Section */}
            <div className={styles.videoContainer}>
                {lipsyncVideo ? (
                    <video className={styles.video} controls autoPlay loop>
                        <source src={lipsyncVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>Loading video...</p>
                )}
            </div>

            {/* User Input */}
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.textInput}
                    placeholder="Enter what you want the character to say..."
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                />
                <button className={styles.generateButton} onClick={generateLipsync} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Lipsync"}
                </button>
            </div>

            {/* Error Message */}
            {error && <p className={styles.error}>{error}</p>}
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
