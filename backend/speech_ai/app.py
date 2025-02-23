import streamlit as st
import sounddevice as sd
import wavio
import numpy as np
import io
import requests

st.title("🎤 AI Speech-to-Text & Normalization")

# 🔹 녹음 설정
duration = 5  # 녹음 시간 (초)
sample_rate = 44100  # 샘플링 레이트

if st.button("🎙 Start Recording"):
    st.write("🔴 Recording for 5 seconds...")
    recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype=np.int16)
    sd.wait()  # 녹음 완료까지 대기
    st.write("✅ Recording finished.")

    # WAV 파일로 변환
    audio_bytes = io.BytesIO()
    wavio.write(audio_bytes, recording, sample_rate, sampwidth=2)
    audio_bytes.seek(0)

    # FastAPI 서버로 오디오 전송
    files = {"file": ("recorded_audio.wav", audio_bytes, "audio/wav")}
    response = requests.post("http://127.0.0.1:8000/upload-audio/", files=files)

    if response.status_code == 200:
        result = response.json()
        st.success("✅ Processing complete!")

        # 📝 원본 및 정규화된 텍스트 가져오기
        original_text = result.get("original_text", "❌ No transcription received.")
        normalized_text = result.get("normalized_text", "❌ Normalization failed.")

        st.write("📜 **Original Transcription:**")
        st.text_area("Original", original_text, height=100)

        st.write("✨ **GPT-4 Normalized Text:**")
        st.text_area("Normalized", normalized_text, height=100)

    else:
        st.error(f"❌ STT conversion failed! (HTTP Status Code: {response.status_code})")
        st.text_area("Server Response:", response.text)
