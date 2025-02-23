import { useState } from "react";
import axios from "axios";
import styles from "../styles/fourthstep.module.css"; // Adjust the path if needed

export default function FourthStep() {
    const [selectedVoice, setSelectedVoice] = useState("female-child"); // Default voice
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState([]); // Stores chat history
    const [currentAudio, setCurrentAudio] = useState(null);

    // ✅ Start recording voice input
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

    // ✅ Stop speaking (if audio is playing)
    const stopSpeaking = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setIsSpeaking(false);
        }
    };

    // ✅ Play AI-generated audio
    const playAudio = (url) => {
        if (!url) return;

        const audio = new Audio(url);
        setCurrentAudio(audio);

        audio.play()
            .then(() => setIsSpeaking(true))
            .catch((error) => console.error("Error playing audio:", error));

        audio.onended = () => setIsSpeaking(false);
    };

    // ✅ Send speech text to backend
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

                // ✅ Add AI response immediately to the chat
                addMessage("ai", aiResponse, audioUrl);

                // ✅ Play AI-generated speech first before showing buttons
                if (audioUrl) {
                    playAudio(audioUrl);
                }
            }
        } catch (error) {
            console.error("Error processing speech:", error);
        }
    };

    // ✅ Add messages to chat with optional audio
    const addMessage = (sender, text, audio = null) => {
        setMessages((prevMessages) => [
            ...prevMessages, 
            { sender, text, audio }
        ]);
    };

    return (
        <div className={styles.fourthstepContainer}>
            <h1 className={styles.title}>Fluention AI Voice Assistant</h1>

            {/* ✅ Voice Selection */}
            <div className={styles.voiceSelection}>
                <label>Choose Voice:</label>
                <select className={styles.dropdown} onChange={(e) => setSelectedVoice(e.target.value)} value={selectedVoice}>
                    <option value="female-adult">Female - Adult</option>
                    <option value="male-adult">Male - Adult</option>
                    <option value="female-child">Female - Child</option>
                    <option value="male-child">Male - Child</option>
                </select>
            </div>

            {/* ✅ Chat Container */}
            <div className={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <div key={index} className={`${styles.message} ${msg.sender === "ai" ? styles.ai : styles.user}`}>
                        <p>{msg.text}</p>
                        {msg.audio && (
                            <div className={styles.audioControls}>
                                <button onClick={() => playAudio(msg.audio)}>🔊 Replay</button>
                                <button onClick={stopSpeaking} disabled={!isSpeaking}>⏹ Stop</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Mic and Stop Buttons */}
            <div className={styles.buttonContainer}>
                <button className={styles.recordButton} onClick={startRecording} disabled={isRecording}>
                    {isRecording ? "Listening..." : "Press to Speak 🎤"}
                </button>
            </div>
        </div>
    );
}
