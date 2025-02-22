import streamlit as st
import requests

st.title("🎤 AI (STT)")


uploaded_file = st.file_uploader("File upload (MP3, WAV)", type=["mp3", "wav"])

if uploaded_file is not None:
    
    st.audio(uploaded_file, format="audio/mp3")

    
    with st.spinner("🎙 wait!"):
        try:
            
            files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
            response = requests.post("http://127.0.0.1:8000/upload-audio/", files=files)

            
            if response.status_code == 200:
                result = response.json()
                
                
                if "text" in result:
                    text_result = result["text"]
                    if text_result.strip():
                        st.success("✅ done!")
                        st.write("📜 **converted:**")
                        st.text_area("", text_result, height=150)
                    else:
                        st.warning("⚠️ No text converted. Please check if the voice data is normal.")
                else:
                    st.error("❌")
            else:
                st.error(f"❌ STT fail! (HTTP code: {response.status_code})")
                st.text_area("server:", response.text)

        except Exception as e:
            st.error(f"❌ fail: {str(e)}")
