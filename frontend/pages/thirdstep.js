import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/thirdstep.module.css";

export default function ThirdStep() {
    const [currentWord, setCurrentWord] = useState("");
    const [userSpeech, setUserSpeech] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");

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
  
  

    // Fetch a challenging word from the backend
    const fetchWord = async () => {
        try {
            const response = await axios.get("http://localhost:8000/thirdstep/get-word/");
            setCurrentWord(response.data.word);
            setFeedback(""); // Reset feedback for a new round
            setUserSpeech(""); // Clear previous user input
            setAudioUrl(""); // Reset audio
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    };

    // Play TTS pronunciation for the word
    const playWordPronunciation = async () => {
      if (!currentWord) return;
  
      try {
          const response = await axios.get(`http://localhost:8000/thirdstep/text-to-speech/?word=${currentWord}`, {
              responseType: "blob", // ✅ Receive binary audio data
          });
  
          console.log("[DEBUG] Received audio stream");
  
          // ✅ Create an audio URL from the response blob
          const audioUrl = URL.createObjectURL(response.data);
          setAudioUrl(audioUrl);
  
          // ✅ Play streamed audio immediately
          playAudio(audioUrl);
      } catch (error) {
          console.error("[ERROR] Error generating TTS:", error);
      }
  };
  


    // Start voice recording and speech recognition
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

    // Send user's speech to backend for pronunciation check
    const checkPronunciation = async (spokenWord) => {
        try {
            const response = await axios.post("http://localhost:8000/thirdstep/check-pronunciation/", {
                word: currentWord,
                user_said: spokenWord,
            });

            if (response.data.correct) {
                setFeedback("✅ Correct!");
            } else {
                setFeedback("❌ Incorrect!");
            }

            // Fetch a new word after 2 seconds
            setTimeout(fetchWord, 2000);
        } catch (error) {
            console.error("Error checking pronunciation:", error);
        }
    };

    useEffect(() => {
        fetchWord(); // Load a word when the component mounts
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Pronunciation Game</h1>

            {/* Display current word */}
            <div className={styles.wordContainer}>
                <h2 className={styles.word}>{currentWord}</h2>
                <button className={styles.playButton} onClick={playWordPronunciation}>
                    🔊 Hear Pronunciation
                </button>
            </div>

            {/* User Speech & Feedback */}
            <div className={`${styles.feedbackBox} ${feedback === "✅ Correct!" ? styles.correct : styles.incorrect}`}>
                {feedback && <p className={styles.feedback}>{feedback}</p>}
            </div>

            {/* Start Recording Button */}
            <button className={styles.recordButton} onClick={startRecording} disabled={isRecording}>
                {isRecording ? "🎤 Listening..." : "🎤 Press to Speak"}
            </button>

            {/* Show User Speech */}
            {userSpeech && <p className={styles.userSpeech}>You said: <strong>{userSpeech}</strong></p>}

            {/* Play AI Pronunciation Again */}
            {audioUrl && (
                <div className={styles.audioContainer}>
                    <audio controls src={audioUrl} autoPlay />
                </div>
            )}
        </div>
    );
}
