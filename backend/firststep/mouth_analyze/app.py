from flask import Flask, render_template, Response, redirect, url_for
import cv2
import mediapipe as mp
import numpy as np
import time
import pyttsx3
import threading

app = Flask(__name__)

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

# Initialize text-to-speech output
engine = pyttsx3.init()

def speak_async(text):
    """Run pyttsx3 in a separate thread to avoid conflicts with Flask's streaming"""
    threading.Thread(target=speak, args=(text,)).start()

def speak(text):
    """Speak function for pyttsx3"""
    engine.say(text)
    engine.runAndWait()

# Lip landmark indices (for tracking)
UPPERLIP_LANDMARKS = [61,185,40,39, 37,0, 267, 269,270, 409,291,308,415, 310, 311, 312, 13,82, 81, 80,191,78,62]
LOWERLIP_LANDMARKS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308,324,402,317,14,87,178,88,95,78,62,76]

# Exercise steps setup
exercise_steps = ["1st Exercise: Open Your Mouth", "2nd Exercise: Say 'oooo'", "3rd Exercise: Say 'eeeee'"]
example_videos = ["static/mouth_wide.mp4", "static/say_o.mp4", "static/say_e.mp4"]
current_step = 0
hold_start_time = 0
rep_count = 0
set_count = 1
max_reps = 3
max_sets = 3
hold_time = 2  # User must hold position for 2 seconds

# Open webcam
cap = cv2.VideoCapture(0)

def get_lip_metrics(landmarks):
    """Calculate lip height and width ratio for detecting mouth movements"""
    top_lip = np.mean([landmarks[i] for i in UPPERLIP_LANDMARKS], axis=0)
    bottom_lip = np.mean([landmarks[i] for i in LOWERLIP_LANDMARKS], axis=0)
    lip_height = np.linalg.norm(top_lip - bottom_lip)

    left_lip = landmarks[61]
    right_lip = landmarks[291]
    lip_width = np.linalg.norm(left_lip - right_lip)

    lip_ratio = lip_height / lip_width
    is_mouth_open = lip_ratio > 0.2  # Open mouth
    is_ooooo = 0.23 < lip_ratio < 0.28  # "oooo" sound
    is_eeeee = 0.19 < lip_ratio < 0.23  # "eeeee" sound

    return lip_ratio, is_mouth_open, is_ooooo, is_eeeee

def generate_frames():
    global current_step, hold_start_time, rep_count, set_count

    with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
        while True:
            success, frame = cap.read()
            if not success:
                break

            frame = cv2.flip(frame, 1)  # Flip to match mirror effect
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image)

            holding = False  # Default: not holding
            progress = 0  # Default progress at 0%

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    landmarks = np.array([(lm.x * frame.shape[1], lm.y * frame.shape[0]) for lm in face_landmarks.landmark])
                    lip_ratio, is_mouth_open, is_ooooo, is_eeeee = get_lip_metrics(landmarks)

                    # Check if user is continuously holding the correct position
                    goal_condition_met = (
                        (current_step == 0 and is_mouth_open) or
                        (current_step == 1 and is_ooooo) or
                        (current_step == 2 and is_eeeee)
                    )

                    if goal_condition_met:
                        if hold_start_time == 0:
                            hold_start_time = time.time()  # Start hold timer

                        hold_duration = time.time() - hold_start_time
                        progress = min(int((hold_duration / hold_time) * 100), 100)  # Convert hold time to percentage

                        if hold_duration >= hold_time:
                            rep_count += 1
                            speak_async(f"{rep_count}")
                            hold_start_time = 0
                            progress = 0  # Reset progress bar
                            if rep_count >= max_reps:
                                speak_async("Great job!")
                                rep_count = 0
                                current_step = (current_step + 1) % len(exercise_steps)
                                return redirect(url_for('pre_exercise'))
                        holding = True
                    else:
                        hold_start_time = 0  # Reset hold timer
                        progress = 0  # Reset progress bar
                        holding = False
            # Display 'Hold for 2 seconds' above the progress bar
            if holding:
                cv2.putText(frame, "Hold for 2 seconds", (30, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            # Display progress bar
            
            bar_length = int((progress / 100) * 300)  # Convert progress to pixel width
            cv2.rectangle(frame, (30, 80), (30 + 300, 100), (100, 100, 100), 2)  # Bar outline
            cv2.rectangle(frame, (30, 80), (30 + bar_length, 100), (0, 255, 0), -1)  # Filled progress

            # Display rep count at top center
            frame_width = frame.shape[1]
            cv2.putText(frame, f"Reps: {rep_count}/{max_reps}", 
                        (frame_width // 2 - 100, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route('/')
def pre_exercise():
    """Display the pre-exercise screen before starting each step."""
    return render_template('pre_exercise.html', example_video=example_videos[current_step], exercise_text=exercise_steps[current_step])

@app.route('/exercise')
def exercise():
    """Display the main exercise screen with the live camera feed and example video."""
    return render_template('index.html', example_video=example_videos[current_step], exercise_text=exercise_steps[current_step])

@app.route('/video_feed')
def video_feed():
    """Stream the processed video feed with lip tracking to the web interface."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/progress')
def progress():
    global hold_start_time
    if hold_start_time == 0:
        progress = 0
        holding = False
    else:
        hold_duration = time.time() - hold_start_time
        progress = min(int((hold_duration / hold_time) * 100), 100)
        holding = hold_duration > 0  # True if holding

    return {"progress": progress, "holding": holding}

if __name__ == '__main__':
    app.run(debug=True)
