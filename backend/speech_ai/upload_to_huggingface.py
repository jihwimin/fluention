from datasets import Dataset, Audio
import pandas as pd
import os

# 1️⃣ CSV 파일 로드
csv_path = "Disordered-child-speech-sentences-database.csv"  # ✅ CSV 파일 경로
mp3_dir = "46_mp3"  # ✅ MP3 파일이 들어있는 폴더 경로
df = pd.read_csv(csv_path)

# 2️⃣ MP3 파일 경로 추가
df["audio"] = df["file_name"].apply(lambda x: os.path.join(mp3_dir, x))

# 3️⃣ Hugging Face Dataset 변환
dataset = Dataset.from_pandas(df)

# 4️⃣ 오디오 파일을 Hugging Face Dataset에 추가
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))

# 5️⃣ Hugging Face에 업로드 (사용자명/데이터셋 이름 변경 필수)
dataset.push_to_hub("your_username/disordered_speech_dataset", private=True)

print("✅ Dataset uploaded to Hugging Face successfully!")
