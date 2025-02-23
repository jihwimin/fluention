import cv2
import numpy as np
import time
import pyttsx3

# Initialize text-to-speech output
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# Define HSV color range for tongue detection
lower_tongue = np.array([140, 50, 50])  
upper_tongue = np.array([180, 255, 255])

# Exercise steps setup
exercise_steps = ["1st Exercise: Move Tongue Down", "2nd Exercise: Move Tongue Right", "3rd Exercise: Move Tongue Left"]
example_videos = ["example_videos/tongue_down.mp4", "example_videos/tongue_right.mp4", "example_videos/tongue_left.mp4"]
current_step = 0
hold_start_time = 0
rep_count = 0
set_count = 1
max_reps = 3
max_sets = 3
hold_time = 1  # User must hold position for 1 second

cap = cv2.VideoCapture(0)

# Get webcam resolution to match the pre-exercise screen
_, sample_frame = cap.read()
frame_height, frame_width, _ = sample_frame.shape  

def show_pre_exercise_screen(exercise_name, video_path, width, height):
    """Display an instruction screen before starting an exercise with a bigger example video."""
    cap_example = cv2.VideoCapture(video_path)
    
    for i in range(3, 0, -1):
        speak(str(i))
        start_time = time.time()
        while time.time() - start_time < 1:
            ret, frame = cap_example.read()
            if not ret:
                cap_example.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = cap_example.read()
            frame = cv2.resize(frame, (600, 400))  

            # **Create a screen matching the webcam resolution**
            screen = np.ones((height, width, 3), dtype=np.uint8) * 255  
            cv2.rectangle(screen, (50, 50), (width - 50, height - 50), (200, 200, 200), 3)  
            
            # Adjusted font sizes & positions
            cv2.putText(screen, "GET READY!", (screen.shape[1]//2 - 220, 150),  
                        cv2.FONT_HERSHEY_SIMPLEX, 2.5, (0, 0, 255), 6)  
            cv2.putText(screen, exercise_name, (screen.shape[1]//2 - 350, 250),  
                        cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 0), 4)
            cv2.putText(screen, f"Starting in {i}...", (screen.shape[1]//2 - 200, 350),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.8, (255, 0, 0), 5)

            
            video_x = width // 2 - 300  
            video_y = height // 2 - 100  
            screen[video_y:video_y + 400, video_x:video_x + 600] = frame  

            cv2.imshow("Exercise Instructions", screen)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    cap_example.release()
    cv2.destroyAllWindows()

def detect_tongue(frame):
    """Detect the tongue using HSV color filtering and return its tip position and area."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_tongue, upper_tongue)
    
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        max_contour = max(contours, key=cv2.contourArea)
        tongue_area = cv2.contourArea(max_contour)  # Get tongue area
        
        if tongue_area > 500:  # Ignore small detections
            tongue_tip = min(max_contour, key=lambda point: point[0][1])  # Find lowest y-value (topmost point)
            tongue_tip_x, tongue_tip_y = tongue_tip[0]
            
            # Draw Green Contour Around the Tongue
            cv2.drawContours(frame, [max_contour], -1, (0, 255, 0), 2)  # Green outline
            cv2.circle(frame, (tongue_tip_x, tongue_tip_y), 5, (0, 0, 255), -1)  # Red dot for tongue tip

            return tongue_tip_x, tongue_tip_y, tongue_area
    
    return None, None, 0

# Show the instruction screen before the first exercise
show_pre_exercise_screen(exercise_steps[current_step], example_videos[current_step], frame_width, frame_height)

# Open the example video for continuous playback
example_cap = cv2.VideoCapture(example_videos[current_step])

# Main loop for video processing
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    mouth_center_x, mouth_center_y = frame_width // 2, frame_height // 2 + 50  # Approximate mouth center

    tongue_tip_x, tongue_tip_y, tongue_area = detect_tongue(frame)

    # Define a threshold area for detecting "Tongue Down"
    tongue_down_threshold_area = 3500 

    if tongue_tip_x is not None and tongue_tip_y is not None:
        tongue_movement_x = tongue_tip_x - mouth_center_x

        is_tongue_down = tongue_area > tongue_down_threshold_area  # Use area to determine tongue down
        is_tongue_left = tongue_movement_x < -5  # Tongue moved left
        is_tongue_right = tongue_movement_x > 5  # Tongue moved right

        # Determine current exercise step
        if (current_step == 0 and is_tongue_down) or (current_step == 1 and is_tongue_left) or (current_step == 2 and is_tongue_right):
            if hold_start_time == 0:
                hold_start_time = time.time()
            elif time.time() - hold_start_time >= hold_time:
                rep_count += 1
                speak(f"{rep_count}")
                hold_start_time = 0
                if rep_count >= max_reps:
                    speak("Great job!")
                    rep_count = 0
                    current_step = (current_step + 1) % len(exercise_steps)

                    # Show pre-exercise screen before the next step
                    show_pre_exercise_screen(exercise_steps[current_step], example_videos[current_step], frame_width, frame_height)

                    # Reset the example video
                    example_cap = cv2.VideoCapture(example_videos[current_step])

                    if current_step == 0:
                        set_count += 1
                        if set_count > max_sets:
                            set_count = 1
            feedback = f"Hold for {hold_time} seconds..."
        else:
            hold_start_time = 0
            feedback = f"{exercise_steps[current_step]}"
    else:
        feedback = f"{exercise_steps[current_step]}"

    # Display feedback & rep count
    cv2.putText(frame, feedback, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 5)
    cv2.putText(frame, f"Sets: {set_count}/{max_sets}, Reps: {rep_count}/{max_reps}", 
            (frame.shape[1]//2 - 180, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)

    cv2.imshow('Tongue Exercise', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
