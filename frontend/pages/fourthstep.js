import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/fourthstep.module.css"; // Adjust path as needed

export default function FourthStep() {
    const [selectedVoice, setSelectedVoice] = useState("female-adult"); // Default voice
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    const [audioUrl, setAudioUrl] = useState("");

    // Start recording voice input
    const startRecording = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript;
            setText(userSpeech);
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

    // Stop speaking (if speech is playing)
    const stopSpeaking = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Speak out text using Text-to-Speech
    const speakText = (text) => {
        if ("speechSynthesis" in window) {
            stopSpeaking(); // Stop previous speech

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 1;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechSynthesis.speak(utterance);
        } else {
            alert("Text-to-Speech is not supported in your browser.");
        }
    };

    // Send speech text to the backend for processing
    const sendSpeechToBackend = async (speechText) => {
        try {
            const [gender, age] = selectedVoice.split("-");
            const response = await axios.post("http://localhost:8000/fourthstep/process-voice/", {
                text: speechText,
                gender: gender,
                age: age,
            });

            if (response.data && response.data.audio_url) {
                setAudioUrl(response.data.audio_url);
                playAudio(response.data.audio_url); // Play the audio once it's ready
            } else {
                console.error("No audio URL received from backend.");
            }
        } catch (error) {
            console.error("Error sending speech to backend:", error);
        }
    };

    // Play the generated audio
    const playAudio = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    // Handle voice selection change
    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
    };

    // Add user and AI messages to chat
    const addMessage = (sender, text) => {
        setMessages((prevMessages) => [...prevMessages, { sender, text }]);
    };

    // Handle start recording and send text to backend
    useEffect(() => {
        if (text) {
            addMessage("user", text);
        }
    }, [text]);

    return (
        <div className={styles.fourthstepContainer}>
            <h1 className={styles.title}>Fluention AI Voice Assistant</h1>

            {/* Voice Selection */}
            <div className={styles.voiceSelection}>
                <label>Choose Voice:</label>
                <select
                    className={styles.dropdown}
                    onChange={handleVoiceChange}
                    value={selectedVoice}
                >
                    <option value="female-adult">Female - Adult</option>
                    <option value="male-adult">Male - Adult</option>
                    <option value="female-child">Female - Child</option>
                    <option value="male-child">Male - Child</option>
                </select>
            </div>

            {/* Chat Container */}
            <div className={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <div key={index} className={`${styles.message} ${msg.sender === "ai" ? styles.ai : styles.user}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Mic and Stop Buttons */}
            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.button} ${styles.recordButton}`}
                    onClick={startRecording}
                    disabled={isRecording}
                >
                    {isRecording ? "Listening..." : "Press to Speak 🎤"}
                </button>
                <button
                    className={`${styles.button} ${styles.stopButton}`}
                    onClick={stopSpeaking}
                    disabled={!isSpeaking}
                >
                    ⏹ Stop
                </button>
            </div>

            {/* Audio Playback */}
            {audioUrl && (
                <div className={styles.audioContainer}>
                    <audio controls src={audioUrl} />
                </div>
            )}
        </div>
    );
}
