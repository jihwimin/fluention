import { useState } from "react";
import axios from "axios";
import styles from "../styles/fourthstep.module.css";
import Image from "next/image";
import Link from "next/link";

export default function FourthStep() {
    const [selectedVoice, setSelectedVoice] = useState("female-child");
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);

    const startRecording = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript;
            addMessage("user", userSpeech);
            sendSpeechToBackend(userSpeech);
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

    const stopSpeaking = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setIsSpeaking(false);
        }
    };

    const playAudio = (url) => {
        if (!url) return;

        const audio = new Audio(url);
        setCurrentAudio(audio);

        audio.play()
            .then(() => setIsSpeaking(true))
            .catch((error) => console.error("Error playing audio:", error));

        audio.onended = () => setIsSpeaking(false);
    };

    const sendSpeechToBackend = async (speechText) => {
        try {
            const [gender, age] = selectedVoice.split("-");

            const response = await axios.post("http://localhost:8000/fourthstep/process-voice/", {
                text: speechText,
                gender: gender,
                age: age,
            });

            if (response.data) {
                const aiResponse = response.data.reply;
                const audioUrl = response.data.audio_url ? "http://localhost:8000" + response.data.audio_url : null;

                addMessage("ai", aiResponse, audioUrl);

                if (audioUrl) {
                    playAudio(audioUrl);
                }
            }
        } catch (error) {
            console.error("Error processing speech:", error);
        }
    };

    const addMessage = (sender, text, audio = null) => {
        setMessages((prevMessages) => [
            ...prevMessages, 
            { sender, text, audio }
        ]);
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

            {/* Section Title */}
            <h2 className={styles.title}>Contextual Communication Skills</h2>

            {/* Chat Box */}
            <div className={styles.chatBox}>

                {/* Chat Messages */}
                <div className={styles.chatContainer}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`${styles.message} ${msg.sender === "ai" ? styles.ai : styles.user}`}>
                            <p>{msg.text}</p>
                            {msg.audio && (
                                <div className={styles.audioControls}>
                                    <button className={styles.audioButton} onClick={() => playAudio(msg.audio)}>
                                        <Image src="/icons/speaker.png" alt="Speaker" width={30} height={30} />
                                    </button>
                                    <button className={styles.stopButton} onClick={stopSpeaking} disabled={!isSpeaking}>
                                        <Image src="/icons/stop.png" alt="Stop" width={30} height={30} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mic Button */}
                <div className={styles.micContainer}>
                    <button className={styles.micButton} onClick={startRecording} disabled={isRecording}>
                        <Image src="/icons/mic.png" alt="Mic" width={40} height={40} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerLogo}>
                    <Image src="/logo.png" alt="Fluention Logo" width={130} height={50}/>
                </div>
                <div className={styles.footerCopyright}>
                    <p>© 2025 Fluention. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
