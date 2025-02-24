from datasets import Dataset, Audio
import pandas as pd
import os


csv_path = "Disordered-child-speech-sentences-database.csv"  
mp3_dir = "46_mp3"  
df = pd.read_csv(csv_path)


df["audio"] = df["file_name"].apply(lambda x: os.path.join(mp3_dir, x))


dataset = Dataset.from_pandas(df)


dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))


dataset.push_to_hub("your_username/disordered_speech_dataset", private=True)

print(" Dataset uploaded to Hugging Face successfully!")
