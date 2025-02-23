import { useState } from "react";
import styles from "../styles/translator.module.css";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";


export default function Translator() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [recording, setRecording] = useState(false);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    // 🗣 Start Recording (Use MediaRecorder API)
    const handleRecord = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
        }

        try {
        setRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            setRecording(false);
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const formData = new FormData();
            formData.append("file", audioBlob, "recorded_audio.wav");

            try {
            const response = await axios.post("http://127.0.0.1:8000/upload-audio/", formData);
            if (response.data.original_text) {
                setInputText(response.data.original_text);
                setTranslatedText(response.data.normalized_text);
            }
            } catch (error) {
            console.error("STT API Error:", error);
            alert("Speech-to-Text conversion failed.");
            }
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);
        } catch (error) {
        console.error("Microphone access error:", error);
        alert("Microphone access denied.");
        setRecording(false);
        }
    };

    // 🔄 Convert Text to Speech (TTS)
    const handleTTS = async () => {
        try {
        const response = await axios.post("http://127.0.0.1:8000/text-to-speech/", new URLSearchParams({ text: translatedText }));
        if (response.data.audio_file) {
            setAudioUrl(`http://127.0.0.1:8000/${response.data.audio_file}`);
        }
        } catch (error) {
        console.error("TTS API Error:", error);
        alert("Text-to-Speech conversion failed.");
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


        <div className={styles.container}>
        <h1 className={styles.title}>Translator</h1>

        {/* Translation Box */}
        <div className={styles.translationBox}>
            {/* Speech Input & Text Box */}
            <div className={styles.inputSection}>
            <textarea
                className={styles.textInput}
                placeholder="Speak or type here..."
                value={inputText}
                onChange={handleInputChange}
            />
            <button className={styles.micButton} onClick={handleRecord} disabled={recording}>
                {recording ? "🎤 Recording..." : "🎙"}
            </button>
            </div>

            {/* Divider Line */}
            <div className={styles.divider}></div>

            {/* Translated Output */}
            <div className={styles.outputSection}>
            <p className={styles.outputText}>
                {translatedText || "The translated sentence will appear here."}
            </p>
            </div>
        </div>

        {/* Translate & TTS Buttons */}
        <div className={styles.buttonContainer}>
            <button className={styles.translateButton} onClick={handleTTS}>
            Convert to Speech
            </button>

            {audioUrl && (
            <audio controls className={styles.audioPlayer}>
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            )}
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
