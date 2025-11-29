# ChildStory App - Quick Start Guide

## 🚀 How to Start the App

You have **3 options** to start the app:

### Option 1: Start Everything Together (Easiest)
**Double-click:** `start-app.ps1`
- Starts backend automatically
- Waits 15 seconds
- Starts frontend automatically
- ✅ One click, everything runs!

### Option 2: Start Separately (More Control)
1. **Double-click:** `start-backend.bat` (starts backend)
2. **Wait 10-15 seconds** for backend to fully start
3. **Double-click:** `start-frontend.bat` (starts frontend)

### Option 3: Manual Start (For Developers)
**Backend:**
```bash
cd ChildStoryApp\ChildStoryApp
.\mvnw.cmd spring-boot:run
```

**Frontend:**
```bash
cd child_story_mobile
flutter run -d chrome
```

---

## 📍 App URLs

- **Frontend (Flutter):** Opens automatically in Chrome
- **Backend API:** http://localhost:8080
- **H2 Database Console:** http://localhost:8080/h2-console

---

## 🛑 How to Stop the App

- **Backend:** Press `Ctrl+C` in the backend terminal window
- **Frontend:** Press `Ctrl+C` in the frontend terminal window, or close Chrome

---

## ⚠️ Troubleshooting

**If backend won't start:**
- Make sure Java is installed (it should be at `C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot`)
- Close any other apps using port 8080

**If frontend won't start:**
- Make sure Flutter is installed: `flutter doctor`
- Make sure Chrome is installed

**If they can't connect:**
- Start backend first, wait 15 seconds, then start frontend
- Check that backend shows "Started ChildStoryAppApplication" in the terminal

---

## 📝 Notes

- The backend uses an **in-memory H2 database** - data resets when you restart
- The frontend automatically connects to `http://localhost:8080`
- If backend is not running, frontend falls back to mock data

---

## 🎯 Recommended Workflow

1. **Start:** Double-click `start-app.ps1`
2. **Develop:** Make changes to code
3. **Hot Reload (Frontend):** Press `r` in Flutter terminal
4. **Restart Backend:** Press `Ctrl+C` then run `start-backend.bat` again
5. **Stop:** Press `Ctrl+C` in both terminals when done

---

Enjoy building with ChildStory! 🎨📚
