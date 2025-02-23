import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/thirdstep.module.css";
import Image from "next/image";
import Link from "next/link";

export default function ThirdStep() {
    const [currentWord, setCurrentWord] = useState("");
    const [userSpeech, setUserSpeech] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [containerColor, setContainerColor] = useState(styles.fixedContainer); // Default white container

    const playAudio = (audioUrl) => {
        if (!audioUrl) {
            console.error("[ERROR] No valid audio URL to play.");
            return;
        }

        const audio = new Audio(audioUrl);
        audio.play()
            .then(() => console.log("[DEBUG] Streaming audio is playing:", audioUrl))
            .catch((error) => console.error("[ERROR] Failed to play streamed audio:", error));
    };

    // Fetch a new word from the backend
    const fetchWord = async () => {
        try {
            setContainerColor(styles.fixedContainer); // Reset container color to white
            setUserSpeech(""); 
            setAudioUrl(""); 
            const response = await axios.get("http://localhost:8000/thirdstep/get-word/");
            setCurrentWord(response.data.word);
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    };

    // Play TTS pronunciation for the word
    const playWordPronunciation = async () => {
        if (!currentWord) return;

        try {
            const response = await axios.get(`http://localhost:8000/thirdstep/text-to-speech/?word=${currentWord}`, {
                responseType: "blob",
            });

            console.log("[DEBUG] Received audio stream");
            const audioUrl = URL.createObjectURL(response.data);
            setAudioUrl(audioUrl);
            playAudio(audioUrl);
        } catch (error) {
            console.error("[ERROR] Error generating TTS:", error);
        }
    };

    // Start voice recording
    const startRecording = () => {
        if (!currentWord) {
            alert("Get a word first!");
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.start();

        recognition.onresult = async (event) => {
            const userSpokenWord = event.results[0][0].transcript.trim();
            setUserSpeech(userSpokenWord);
            checkPronunciation(userSpokenWord);
        };

        recognition.onspeechend = () => {
            setIsRecording(false);
            recognition.stop();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
        };
    };

    // Check user's pronunciation
    const checkPronunciation = async (spokenWord) => {
        try {
            const response = await axios.post("http://localhost:8000/thirdstep/check-pronunciation/", {
                word: currentWord,
                user_said: spokenWord,
            });

            if (response.data.correct) {
                setContainerColor(styles.correctContainer); // Turns green if correct
            } else {
                setContainerColor(styles.incorrectContainer); // Turns red if incorrect
            }

            setTimeout(fetchWord, 2000);
        } catch (error) {
            console.error("Error checking pronunciation:", error);
        }
    };

    useEffect(() => {
        fetchWord();
    }, []);

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

            {/* White Fixed Container with Dynamic Color */}
            <div className={containerColor}>
                <h2 className={styles.title}>Vocabulary Enhancement</h2>

                {/* Pronunciation Game Box */}
                <div className={styles.gameBox}>
                    <h3 className={styles.subtitle}>Pronunciation Game</h3>

                    {/* Word and Play Button */}
                    <div className={styles.wordContainer}>
                        <button className={styles.wordButton}>{currentWord}</button>
                        <button className={styles.playButton} onClick={playWordPronunciation}>
                            <Image src="/icons/speaker.png" alt="Speaker" width={30} height={30} />
                        </button>
                    </div>

                    {/* Recording Button */}
                    <button 
                        className={styles.recordButton} 
                        onClick={startRecording} 
                        disabled={isRecording}
                        style={{ opacity: isRecording ? 0.5 : 1, transition: "opacity 0.3s ease-in-out" }} // Transparency Effect
                    >
                        <Image 
                            src="/icons/mic.png" 
                            alt="Mic" 
                            width={40} 
                            height={40} 
                            className={isRecording ? styles.micBlink : ""} // Apply blinking animation when recording
                        />
                    </button>
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
