import { useState } from "react";
import axios from "axios";
import styles from "../styles/secondstep.module.css";
import Image from "next/image";
import Link from "next/link";

export default function SecondStep() {
  const [imageUrl, setImageUrl] = useState("");
  const [scenario, setScenario] = useState("");
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/secondstep/generate-image/");
      setImageUrl(response.data.image_url);
      setScenario(response.data.scenario_prompt);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (!scenario) {
      alert("Please generate an image first!");
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

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      stopSpeaking();
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

  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendSpeechToBackend = async (speechText) => {
    try {
      const response = await axios.post("http://localhost:8000/secondstep/process-text/", {
        text: speechText,
        scenario_prompt: scenario,
      });

      if (response.data) {
        setCorrectedText(response.data.corrected || "No correction available.");
        setScore(response.data.score !== undefined ? response.data.score : "N/A");
        speakText(response.data.corrected);
      }
    } catch (error) {
      console.error("Error processing speech:", error);
    }
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
      {/* navigation finish */}

      {/* White Fixed Container */}
      <div className={styles.fixedContainer}>
        <h2 className={styles.title}>Receptive & Expressive Language Development</h2>

        {/* Generate Image Button */}
        <button className={styles.button} onClick={fetchImage} disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {/* Display AI-generated image */}
        {imageUrl && (
          <div className={styles.imageContainer}>
            <img className={styles.image} src={imageUrl} alt="Practice Scenario" />
          </div>
        )}

        {/* Start Recording Button */}
        <button className={styles.button} onClick={startRecording} disabled={isRecording}>
          {isRecording ? "Listening..." : "Press to Speak 🎤"}
        </button>

        {/* Display User Input & AI Feedback */}
        {text && (
          <div className={styles.resultContainer}>
            <p><strong>Your Description:</strong> {text}</p>
            <p><strong>AI Corrected:</strong> {correctedText}</p>
            <button className={styles.button} onClick={() => speakText(correctedText)}>🔊 Replay</button>
            <button className={styles.button} onClick={stopSpeaking} disabled={!isSpeaking}>⏹ Stop</button>
            <p><strong>Score:</strong> {score}/100</p>
          </div>
        )}
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
