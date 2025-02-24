import streamlit as st
import sounddevice as sd
import wavio
import numpy as np
import io
import requests

st.title("AI Speech-to-Text & Normalization")


duration = 7  
sample_rate = 44100  

if st.button("🎙 Start Recording"):
    st.write("🔴 Recording for 5 seconds...")
    recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype=np.int16)
    sd.wait()  
    st.write("✅ Recording finished.")

    
    audio_bytes = io.BytesIO()
    wavio.write(audio_bytes, recording, sample_rate, sampwidth=2)
    audio_bytes.seek(0)

    
    files = {"file": ("recorded_audio.wav", audio_bytes, "audio/wav")}
    response = requests.post("http://127.0.0.1:8000/upload-audio/", files=files)

    if response.status_code == 200:
        result = response.json()
        st.success("✅ Processing complete!")

        
        original_text = result.get("original_text", "❌ No transcription received.")
        normalized_text = result.get("normalized_text", "❌ Normalization failed.")

        st.write(" **Original Transcription:**")
        st.text_area("Original", original_text, height=100)

        st.write(" **GPT-4 Normalized Text:**")
        st.text_area("Normalized", normalized_text, height=100)

    else:
        st.error(f"❌ STT conversion failed! (HTTP Status Code: {response.status_code})")
        st.text_area("Server Response:", response.text)
