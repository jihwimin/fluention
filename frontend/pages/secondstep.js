import { useState } from "react";
import axios from "axios";
import styles from "../styles/secondstep.module.css";

export default function SecondStep() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [isRecording, setIsRecording] = useState(false);

  // Fetch AI-generated image
  const fetchImage = async () => {
    const response = await axios.get(`http://localhost:8000/generate-image/?difficulty=${difficulty}`);
    setImageUrl(response.data.image_url);
  };

  // Start voice recording
  const startRecording = () => {
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
  };

  // Send speech text to backend
  const sendSpeechToBackend = async (speechText) => {
    const response = await axios.post("http://localhost:8000/process-text/", { text: speechText });
    setCorrectedText(response.data.corrected);
    setScore(response.data.score);

    // Increase difficulty if the score is high
    if (response.data.score > 80) {
      setDifficulty("hard");
      fetchImage();
    }
  };

  return (
    <div className={styles.secondstepContainer}>
      <h1>AI Voice Assistant</h1>

      <button className={styles.button} onClick={fetchImage}>Get AI Image</button>
      {imageUrl && <img className={styles.image} src={imageUrl} alt="Practice Image" />}

      <button className={styles.button} onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Listening..." : "Press to Speak 🎤"}
      </button>

      <p>Original: {text}</p>
      <p>Corrected: {correctedText}</p>
      <p>Score: {score}/100</p>
    </div>
  );
}
