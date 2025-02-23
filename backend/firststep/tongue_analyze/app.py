from flask import Flask, render_template, Response, redirect, url_for
import cv2
import numpy as np
import time
import pyttsx3
import threading

app = Flask(__name__)

# Initialize text-to-speech output
engine = pyttsx3.init()

def speak_async(text):
    """Run pyttsx3 in a separate thread to avoid conflicts with Flask's streaming"""
    threading.Thread(target=speak, args=(text,)).start()

def speak(text):
    """Speak function for pyttsx3"""
    engine.say(text)
    engine.runAndWait()

# Define HSV color range for tongue detection
lower_tongue = np.array([140, 50, 50])  
upper_tongue = np.array([180, 255, 255])

# Exercise steps setup
exercise_steps = ["1st Exercise: Move Tongue Down", "2nd Exercise: Move Tongue Right", "3rd Exercise: Move Tongue Left"]
example_videos = ["tongue_down.mp4", "tongue_right.mp4", "tongue_left.mp4"]
current_step = 0
hold_start_time = 0
rep_count = 0
set_count = 1
max_reps = 3
max_sets = 3
hold_time = 1  # User must hold position for 1 second

# Open webcam
cap = cv2.VideoCapture(0)

def detect_tongue(frame):
    """Detect the tongue using HSV color filtering and return its tip position and area."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_tongue, upper_tongue)
    
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        max_contour = max(contours, key=cv2.contourArea)
        tongue_area = cv2.contourArea(max_contour)
        
        if tongue_area > 500:  # Ignore small detections
            tongue_tip = min(max_contour, key=lambda point: point[0][1])  # Find lowest y-value (topmost point)
            tongue_tip_x, tongue_tip_y = tongue_tip[0]
            
            # Draw Green Contour Around the Tongue
            cv2.drawContours(frame, [max_contour], -1, (0, 255, 0), 2)
            cv2.circle(frame, (tongue_tip_x, tongue_tip_y), 5, (0, 0, 255), -1)

            return tongue_tip_x, tongue_tip_y, tongue_area
    
    return None, None, 0

def generate_frames():
    global current_step, hold_start_time, rep_count, set_count

    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)  # Flip to match mirror effect
        frame_height, frame_width, _ = frame.shape
        mouth_center_x = frame_width // 2
        mouth_center_y = frame_height // 2 + 50  

        tongue_tip_x, tongue_tip_y, tongue_area = detect_tongue(frame)

        # Define a threshold area for detecting "Tongue Down"
        tongue_down_threshold_area = 3500  

        if tongue_tip_x is not None and tongue_tip_y is not None:
            tongue_movement_x = tongue_tip_x - mouth_center_x

            is_tongue_down = tongue_area > tongue_down_threshold_area  
            is_tongue_left = tongue_movement_x < -5  
            is_tongue_right = tongue_movement_x > 5  

            # Determine current exercise step
            if (current_step == 0 and is_tongue_down) or (current_step == 1 and is_tongue_left) or (current_step == 2 and is_tongue_right):
                if hold_start_time == 0:
                    hold_start_time = time.time()
                elif time.time() - hold_start_time >= hold_time:
                    rep_count += 1
                    speak_async(f"{rep_count}")
                    hold_start_time = 0
                    if rep_count >= max_reps:
                        speak_async("Great job!")
                        rep_count = 0
                        current_step = (current_step + 1) % len(exercise_steps)

                        if current_step == 0:
                            set_count += 1
                            if set_count > max_sets:
                                set_count = 1
                        
                        # Redirect to the pre-exercise screen before starting the next step
                        return redirect(url_for('pre_exercise'))

            feedback = f"Hold for {hold_time} seconds..."
        else:
            feedback = f"{exercise_steps[current_step]}"

        # Add feedback text
        cv2.putText(frame, feedback, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
        cv2.putText(frame, f"Sets: {set_count}/{max_sets}, Reps: {rep_count}/{max_reps}", 
                    (frame.shape[1]//2 - 180, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)

        # Encode the frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def pre_exercise():
    return render_template('pre_exercise.html', example_video=example_videos[current_step], exercise_text=exercise_steps[current_step])

@app.route('/exercise')
def exercise():
    return render_template('index.html', example_video=example_videos[current_step], exercise_text=exercise_steps[current_step])

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
