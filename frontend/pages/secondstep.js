import { useState } from "react";
import axios from "axios";
import styles from "../styles/secondstep.module.css";

export default function SecondStep() {
  const [imageUrl, setImageUrl] = useState("");
  const [scenario, setScenario] = useState(""); // Store scenario internally
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // ✅ Tracks if TTS is playing

  // Fetch AI-generated image & store scenario internally
  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/generate-image/");
      setImageUrl(response.data.image_url);
      setScenario(response.data.scenario_prompt); // Store scenario for AI comparison
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start voice recording
  const startRecording = () => {
    if (!scenario) {
      alert("Please generate an image first!"); // Prevent recording before image generation
      return;
    }

    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    recognition.start();

    recognition.onresult = async (event) => {
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

  // Speak out the AI-corrected response using Text-to-Speech
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      stopSpeaking(); // Stop any previous speech before speaking again

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Set language
      utterance.rate = 1; // Normal speaking rate

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
  };

  // Stop the current AI speech
  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel(); // ✅ Stop the current speech
      setIsSpeaking(false);
    }
  };

  // Send speech text to backend (with stored scenario)
  const sendSpeechToBackend = async (speechText) => {
    try {
      const response = await axios.post("http://localhost:8000/process-text/", {
        text: speechText,
        scenario_prompt: scenario, // Include scenario for AI comparison
      });

      if (response.data) {
        setCorrectedText(response.data.corrected || "No correction available.");
        setScore(response.data.score !== undefined ? response.data.score : "N/A");

        // Speak the corrected text automatically
        speakText(response.data.corrected);
      }
    } catch (error) {
      console.error("Error processing speech:", error);
    }
  };

  return (
    <div className={styles.secondstepContainer}>
      <h1>AI Voice Assistant</h1>

      {/* Fetch AI-generated image */}
      <button className={styles.button} onClick={fetchImage} disabled={loading}>
        {loading ? "Generating..." : "Get AI Image"}
      </button>

      {/* Display AI-generated image */}
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img className={styles.image} src={imageUrl} alt="Practice Scenario" />
        </div>
      )}

      {/* Start Recording */}
      <button className={styles.button} onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Listening..." : "Press to Speak 🎤"}
      </button>

      {/* Display User Input & AI Feedback */}
      {text && (
        <div className={styles.resultContainer}>
          <p><strong>Your Description:</strong> {text}</p>
          <p><strong>AI Corrected:</strong> {correctedText}</p>

          {/* Speak & Stop Buttons */}
          <button className={styles.button} onClick={() => speakText(correctedText)}>🔊 Replay</button>
          <button className={styles.button} onClick={stopSpeaking} disabled={!isSpeaking}>⏹ Stop</button>

          <p><strong>Score:</strong> {score}/100</p>
        </div>
      )}
    </div>
  );
}
