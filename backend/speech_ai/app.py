import streamlit as st
import requests

st.title("🎤 AI Speech-to-Text & Normalization")


uploaded_file = st.file_uploader("File upload (MP3, WAV)", type=["mp3", "wav"])

if uploaded_file is not None:
    
    st.audio(uploaded_file, format="audio/mp3")

    
    with st.spinner("🎙 Processing... Please wait!"):
        try:
            
            files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
            response = requests.post("http://127.0.0.1:8000/upload-audio/", files=files)

            
            if response.status_code == 200:
                result = response.json()
                
                # Ensure both text fields exist in the response
                if "original_text" in result and "normalized_text" in result:
                    original_text = result["original_text"]
                    normalized_text = result["normalized_text"]

                    st.success("✅ Processing complete!")
                    
                    st.write("📜 **Original Transcription:**")
                    st.text_area("Original", original_text, height=100)

                    st.write("✨ **GPT-4 Normalized Text:**")
                    st.text_area("Normalized", normalized_text, height=100)
                    
                else:
                    st.error("❌ Unexpected response from the server. Please check logs.")
            else:
                st.error(f"❌ STT conversion failed! (HTTP Status Code: {response.status_code})")
                st.text_area("Server Response:", response.text)

        except Exception as e:
            st.error(f"❌ An error occurred: {str(e)}")
            
