import { useState } from "react";
import axios from "axios";
import styles from "../styles/secondstep.module.css";

export default function SecondStep() {
  const [imageUrl, setImageUrl] = useState("");
  const [scenario, setScenario] = useState(""); // ✅ Scenario stored internally
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch AI-generated image & store scenario internally (but don't display it)
  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/generate-image/");
      setImageUrl(response.data.image_url);
      setScenario(response.data.scenario_prompt); // ✅ Store scenario for AI comparison (but don't show it)
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

  // Send speech text to backend (with stored scenario)
  const sendSpeechToBackend = async (speechText) => {
    try {
      const response = await axios.post("http://localhost:8000/process-text/", {
        text: speechText,
        scenario_prompt: scenario, // ✅ Include scenario for AI comparison
      });

      if (response.data) {
        setCorrectedText(response.data.corrected || "No correction available.");
        setScore(response.data.score !== undefined ? response.data.score : "N/A");
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
          <p><strong>Score:</strong> {score}/100</p>
        </div>
      )}
    </div>
  );
}
