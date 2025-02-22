import cv2
import mediapipe as mp
import numpy as np
import time
import pyttsx3

# Mediapipe Initialization
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

# Initialize text-to-speech output
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# Lip landmark indices (for tracking)
UPPERLIP_LANDMARKS = [61,185,40,39, 37,0, 267, 269,270, 409,291,308,415, 310, 311, 312, 13,82, 81, 80,191,78,62]
LOWERLIP_LANDMARKS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308,324,402,317,14,87,178,88,95,78,62,76]

# Lip height calculation landmarks
LOWERLIP_LANDMARKS_FOR_CALC = [291, 308, 324, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61]
UPPERLIP_LANDMARKS_FOR_CALC = [291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62]

# Exercise steps setup
exercise_steps = ["1st Exercise: Open Your Mouth", "2nd Exercise: Say 'oooo'", "3rd Exercise: Say 'eeeee'"]
current_step = 0
waiting = False
hold_start_time = 0
rep_count = 0
set_count = 1
max_reps = 3
max_sets = 3
hold_time = 2  # User must hold position for 2 seconds

# Example videos
example_videos = ["example_videos/mouth_wide.mp4", "example_videos/say_o.mp4", "example_videos/say_e.mp4"]
example_cap = cv2.VideoCapture(example_videos[current_step])

def show_pre_exercise_screen(exercise_name, example_video_path):
    """ Display an instruction screen before starting an exercise with improved design """
    cap_example = cv2.VideoCapture(example_video_path)
    for i in range(3, 0, -1):
        speak(str(i))
        start_time = time.time()
        while time.time() - start_time < 1:
            ret, frame = cap_example.read()
            if not ret:
                cap_example.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = cap_example.read()
            frame = cv2.resize(frame, (450, 250))
            
            
            screen = np.ones((600, 800, 3), dtype=np.uint8) * 255  
            cv2.rectangle(screen, (50, 50), (750, 550), (200, 200, 200), 3)
            cv2.putText(screen, "GET READY!", (screen.shape[1]//2 - 120, 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
            cv2.putText(screen, exercise_name, (screen.shape[1]//2 - 200, 180),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
            cv2.putText(screen, f"Starting in {i}...", (screen.shape[1]//2 - 140, 260),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 0, 0), 3)
            
            # Place the example video in the bottom portion
            screen[300:550, 175:625] = frame
            
            cv2.imshow("Exercise Instructions", screen)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    cap_example.release()
    cv2.destroyAllWindows()

def get_lip_metrics(landmarks):
    """ 입술의 높이와 너비 비율 계산 및 발음 감지 """
    top_lip = np.mean([landmarks[i] for i in UPPERLIP_LANDMARKS_FOR_CALC], axis=0)
    bottom_lip = np.mean([landmarks[i] for i in LOWERLIP_LANDMARKS_FOR_CALC], axis=0)
    lip_height = np.linalg.norm(top_lip - bottom_lip)

    left_lip = landmarks[61]
    right_lip = landmarks[291]
    lip_width = np.linalg.norm(left_lip - right_lip)

    lip_ratio = lip_height / lip_width
    is_mouth_open = lip_ratio > 0.2  # mouth open
    is_ooooo = 0.11 < lip_ratio < 0.14  # 'ooooo' pronunciation threshold
    is_eeeee = 0.16 < lip_ratio < 0.19  # 'eeeee' pronunciation threshold

    return lip_ratio, lip_height, lip_width, is_mouth_open, is_ooooo, is_eeeee

cap = cv2.VideoCapture(0)

# Show the instruction screen before the first exercise
show_pre_exercise_screen(exercise_steps[current_step], example_videos[current_step])

with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        ret, frame = cap.read()
        if not ret:
            break

        ret_ex, example_frame = example_cap.read()
        if not ret_ex:
            example_cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  
            ret_ex, example_frame = example_cap.read()
        example_frame = cv2.resize(example_frame, (450, 250))  

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks = np.array([(lm.x * frame.shape[1], lm.y * frame.shape[0]) for lm in face_landmarks.landmark])
                lip_ratio, lip_height, lip_width, is_mouth_open, is_ooooo, is_eeeee = get_lip_metrics(landmarks)

                if (current_step == 0 and is_mouth_open) or (current_step == 1 and is_ooooo) or (current_step == 2 and is_eeeee):
                    if hold_start_time == 0:
                        hold_start_time = time.time()
                    elif time.time() - hold_start_time >= hold_time:
                        rep_count += 1
                        speak(f"{rep_count}")
                        hold_start_time = 0
                        if rep_count >= max_reps:
                            rep_count = 0
                            current_step = (current_step + 1) % len(exercise_steps)
                            show_pre_exercise_screen(exercise_steps[current_step], example_videos[current_step])
                            if current_step == 0:
                                set_count += 1
                                if set_count > max_sets:
                                    set_count = 1
                    feedback = f"Hold for {hold_time} seconds..."
                else:
                    hold_start_time = 0
                    feedback = f"{exercise_steps[current_step]}"

                cv2.putText(frame, feedback, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 5)
                cv2.putText(frame, f"Sets: {set_count}/{max_sets}, Reps: {rep_count}/{max_reps}", 
            (frame.shape[1]//2 - 160, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)

                # Draw only lip tracking overlay
                for i in range(len(UPPERLIP_LANDMARKS) - 1):
                    pt1 = (int(landmarks[UPPERLIP_LANDMARKS[i]][0]), int(landmarks[UPPERLIP_LANDMARKS[i]][1]))
                    pt2 = (int(landmarks[UPPERLIP_LANDMARKS[i + 1]][0]), int(landmarks[UPPERLIP_LANDMARKS[i + 1]][1]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 2)
                for i in range(len(LOWERLIP_LANDMARKS) - 1):
                    pt1 = (int(landmarks[LOWERLIP_LANDMARKS[i]][0]), int(landmarks[LOWERLIP_LANDMARKS[i]][1]))
                    pt2 = (int(landmarks[LOWERLIP_LANDMARKS[i + 1]][0]), int(landmarks[LOWERLIP_LANDMARKS[i + 1]][1]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 2)
                for idx in UPPERLIP_LANDMARKS + LOWERLIP_LANDMARKS:
                    x, y = int(landmarks[idx][0]), int(landmarks[idx][1])
                    cv2.circle(frame, (x, y), 3, (0, 255, 0), -1) 

        
        frame[frame.shape[0]-250:frame.shape[0], 50:500] = example_frame

        cv2.imshow('Lip Exercise', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
