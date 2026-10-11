import cv2
import numpy as np
from PIL import Image, ImageSequence
import time
import argparse
import os


MIN_CONTOUR_AREA = 2000
DEFECT_DEPTH_RATIO = 0.02
FINGER_MIN_DISTANCE = 30
OPEN_FINGER_THRESHOLD = 4  
FPS_SMOOTH = 0.9


CR_MIN, CR_MAX = 135, 180
CB_MIN, CB_MAX = 85, 140

# Face tracker params
FACE_MIN_SIZE = (60, 60)
FACE_SMOOTH_ALPHA = 0.6   
FACE_HOLD_FRAMES = 10     

def skin_mask_ycrcb(image):
    ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
    mask = cv2.inRange(ycrcb, np.array((0, CR_MIN, CB_MIN)), np.array((255, CR_MAX, CB_MAX)))
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask = cv2.GaussianBlur(mask, (7, 7), 0)
    _, mask = cv2.threshold(mask, 50, 255, cv2.THRESH_BINARY)
    return mask

def largest_contour(mask):
    contours_info = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = contours_info[0] if len(contours_info) == 2 else contours_info[1]
    if not contours:
        return None
    c = max(contours, key=cv2.contourArea)
    if cv2.contourArea(c) < MIN_CONTOUR_AREA:
        return None
    return c

def get_wrist_point(contour):
    pts = contour.reshape(-1, 2)
    idx = np.argmax(pts[:, 1])
    return tuple(pts[idx])

def get_fingertips_from_contour(contour):
    hull = cv2.convexHull(contour, returnPoints=False)
    if hull is None or len(hull) < 3:
        return []
    defects = cv2.convexityDefects(contour, hull)
    if defects is None:
        return []
    contour_len = cv2.arcLength(contour, True)
    min_defect_depth = DEFECT_DEPTH_RATIO * contour_len
    pts = contour.reshape(-1, 2)
    candidates = []
    for i in range(defects.shape[0]):
        s_idx, e_idx, f_idx, depth = defects[i, 0]
        depth_val = depth / 256.0
        if depth_val < min_defect_depth:
            continue
        start = tuple(pts[s_idx])
        far = tuple(pts[f_idx])
        if start[1] < far[1] + 20:
            candidates.append(start)
    filtered = []
    for p in candidates:
        if all(np.hypot(p[0]-q[0], p[1]-q[1]) >= FINGER_MIN_DISTANCE for q in filtered):
            filtered.append(p)
    if not filtered:
        hull_pts = cv2.convexHull(contour, returnPoints=True).reshape(-1, 2)
        M = cv2.moments(contour)
        if M['m00'] != 0:
            cx = int(M['m10']/M['m00'])
            cy = int(M['m01']/M['m00'])
            cand2 = [tuple(p) for p in hull_pts if p[1] < cy + 30]
            for p in cand2:
                if all(np.hypot(p[0]-q[0], p[1]-q[1]) >= FINGER_MIN_DISTANCE for q in filtered):
                    filtered.append(p)
    filtered = sorted(filtered, key=lambda x: (x[0], x[1]))
    return filtered[:5]

def load_gif_frames(gif_path):
    pil_img = Image.open(gif_path)
    frames = []
    durations = []
    for frame in ImageSequence.Iterator(pil_img):
        rgba = frame.convert("RGBA")
        frame_np = np.array(rgba)  # RGBA
        frames.append(frame_np)
        durations.append(frame.info.get('duration', 100))
    if not frames:
        raise RuntimeError("No frames loaded from GIF")
    return frames, durations

def overlay_rgba_onto_bgr(bg_img, overlay_rgba, x, y, scale=1.0):
    h_bg, w_bg = bg_img.shape[:2]
    if scale != 1.0:
        new_w = int(overlay_rgba.shape[1] * scale)
        new_h = int(overlay_rgba.shape[0] * scale)
        if new_w <= 0 or new_h <=0:
            return bg_img
        overlay_rgba = cv2.resize(overlay_rgba, (new_w, new_h), interpolation=cv2.INTER_AREA)
    o_h, o_w = overlay_rgba.shape[:2]
    x1, y1 = int(x), int(y)
    x2, y2 = x1 + o_w, y1 + o_h
    ox1 = max(0, x1); oy1 = max(0, y1)
    ox2 = min(w_bg, x2); oy2 = min(h_bg, y2)
    if ox1 >= ox2 or oy1 >= oy2:
        return bg_img
    sx1 = ox1 - x1; sy1 = oy1 - y1
    sx2 = sx1 + (ox2 - ox1); sy2 = sy1 + (oy2 - oy1)
    bg_region = bg_img[oy1:oy2, ox1:ox2].astype(np.float32)
    ov_region = overlay_rgba[sy1:sy2, sx1:sx2].astype(np.float32)
    ov_rgb = ov_region[..., :3][:, :, ::-1]
    alpha = ov_region[..., 3:4] / 255.0
    out_region = alpha * ov_rgb + (1.0 - alpha) * bg_region
    bg_img[oy1:oy2, ox1:ox2] = out_region.astype(np.uint8)
    return bg_img

def draw_face_box(img, rect, color=(255,255,255), thickness=2, radius=8):
    # rect = (x,y,w,h) draw a simple rounded rectangle (approx)
    x, y, w, h = rect
    # clip to image
    h_img, w_img = img.shape[:2]
    x = max(0, min(x, w_img-1)); y = max(0, min(y, h_img-1))
    w = max(1, min(w, w_img - x)); h = max(1, min(h, h_img - y))
    # draw rectangle (thin)
    cv2.rectangle(img, (x,y), (x+w, y+h), color, thickness, cv2.LINE_AA)
    # small center dot
    cx, cy = x + w//2, y + h//2
    cv2.circle(img, (cx, cy), 3, color, -1)

def smooth_rect(prev, curr, alpha):
    if prev is None:
        return curr
    x = int(alpha * prev[0] + (1-alpha) * curr[0])
    y = int(alpha * prev[1] + (1-alpha) * curr[1])
    w = int(alpha * prev[2] + (1-alpha) * curr[2])
    h = int(alpha * prev[3] + (1-alpha) * curr[3])
    return (x,y,w,h)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--camera", type=int, default=0)
    p.add_argument("--gif", type=str, default="caaat.gif",
                   help="Path to GIF to overlay when hand is open (default: caaat.gif)")
    p.add_argument("--debug", action="store_true")
    args = p.parse_args()

    if not os.path.isfile(args.gif):
        print("GIF file not found:", args.gif)
        print("Put your GIF named 'caaat.gif' in the same folder or pass --gif with the path.")
        return

    frames, durations = load_gif_frames(args.gif)
    durations = [max(10, d)/1000.0 for d in durations]

    
    face_cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
    if not os.path.isfile(face_cascade_path):
        print("Haar cascade not found at", face_cascade_path)
        print("Face box will be disabled. To enable, ensure OpenCV is fully installed.")
        face_cascade = None
    else:
        face_cascade = cv2.CascadeClassifier(face_cascade_path)

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        print("Cannot open camera", args.camera)
        return

    gif_idx = 0
    gif_timer = time.time()
    prev_time = time.time()
    fps_display = 0.0
    debug = args.debug

    # face rect smoothing state
    last_face_rect = None
    face_hold = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.flip(frame, 1)
            display = frame.copy()

            # First: detect face (grayscale faster)
            face_rect = None
            if face_cascade is not None:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=FACE_MIN_SIZE)
                if len(faces) > 0:
                    # choose largest detected face
                    face_rect = max(faces, key=lambda r: r[2]*r[3])
                    # smooth rectangle with previous for stability
                    if last_face_rect is not None:
                        face_rect = smooth_rect(last_face_rect, face_rect, FACE_SMOOTH_ALPHA)
                    last_face_rect = face_rect
                    face_hold = FACE_HOLD_FRAMES
                else:
                    # no detection this frame: hold last rect for a few frames then drop
                    if face_hold > 0 and last_face_rect is not None:
                        face_hold -= 1
                        face_rect = last_face_rect
                    else:
                        face_rect = None
                        last_face_rect = None

            # Create skin mask, but if face_rect exists, zero that area out so face won't be considered skin-hand
            mask = skin_mask_ycrcb(frame)
            if face_rect is not None:
                x,y,w,h = face_rect
                pad = int(0.12 * w)  # small padding around face
                x1 = max(0, x - pad); y1 = max(0, y - pad)
                x2 = min(mask.shape[1], x + w + pad); y2 = min(mask.shape[0], y + h + pad)
                mask[y1:y2, x1:x2] = 0

            c = largest_contour(mask)
            tips = []
            wrist = None
            bbox = None
            if c is not None:
                wrist = get_wrist_point(c)
                tips = get_fingertips_from_contour(c)
                x, y, w, h = cv2.boundingRect(c)
                bbox = (x, y, w, h)
                # optional: draw contour/hull lightly (not too bright)
                cv2.drawContours(display, [c], -1, (80, 200, 80), 1)
                hull_pts = cv2.convexHull(c, returnPoints=True)
                if hull_pts is not None:
                    cv2.drawContours(display, [hull_pts], -1, (200, 80, 80), 1)

            is_open = len(tips) >= OPEN_FINGER_THRESHOLD
            now = time.time()
            if is_open:
                if now - gif_timer >= durations[gif_idx]:
                    gif_timer = now
                    gif_idx = (gif_idx + 1) % len(frames)
                gif_frame = frames[gif_idx]
                if bbox:
                    bx, by, bw, bh = bbox
                    target_w = int(bw * 1.2)
                    scale = target_w / gif_frame.shape[1]
                    px = bx + bw//2 - int(gif_frame.shape[1]*scale)//2
                    py = max(0, by - int(gif_frame.shape[0]*scale) - 10)
                else:
                    h_img, w_img = display.shape[:2]
                    scale = 0.4
                    px = w_img//2 - int(gif_frame.shape[1]*scale)//2
                    py = h_img//2 - int(gif_frame.shape[0]*scale)//2
                display = overlay_rgba_onto_bgr(display, gif_frame, px, py, scale=scale)
            else:
                gif_idx = 0
                gif_timer = now

            # draw face box if present (simple, unobtrusive)
            if face_rect is not None:
                draw_face_box(display, face_rect, color=(255,255,255), thickness=1)

            # draw fingertip/wrist visuals
            if wrist is not None:
                cv2.circle(display, wrist, 6, (200,200,0), -1)
            for i, t in enumerate(tips):
                color = (0,255,0) if i==0 else (0,0,255)
                cv2.circle(display, t, 10 if i==0 else 6, color, -1)
                if wrist is not None:
                    cv2.line(display, wrist, t, (0,255,255), 2)

            if debug:
                cv2.imshow("Mask", mask)

            dt = time.time() - prev_time
            prev_time = time.time()
            if dt > 0:
                fps_frame = 1.0/dt
                fps_display = FPS_SMOOTH * fps_display + (1 - FPS_SMOOTH) * fps_frame
            cv2.putText(display, f"FPS: {int(fps_display)}", (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (20,240,20), 2)
            cv2.putText(display, f"Open: {is_open} tips:{len(tips)}", (10,60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (240,240,240), 1)

            cv2.imshow("Finger + GIF Overlay", display)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            if key == ord('d'):
                debug = not debug

    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()

