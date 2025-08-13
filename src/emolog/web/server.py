"""
Emolog Web Dashboard Server
The emotional attic where memories and feelings live
"""

import webbrowser
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from ..core.analyzer import EmotionAnalyzer
from ..core.data_manager import DataManager

# Get the web directory path
WEB_DIR = Path(__file__).parent
STATIC_DIR = WEB_DIR / "static"
TEMPLATES_DIR = WEB_DIR / "templates"

# Create FastAPI app
app = FastAPI(
    title="Emolog - The Emotional Attic",
    description="A peaceful place to explore your feelings",
    version="1.0.0",
)

# Mount static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Setup templates
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Initialize data manager and analyzer
data_manager = DataManager()
analyzer = EmotionAnalyzer()


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """The main attic dashboard"""
    # Get recent emotion data
    recent_entries = data_manager.get_recent_entries(limit=10)
    today_entries = data_manager.get_today_entries()

    # Format timestamps for display
    recent_entries = format_entries_for_display(recent_entries)
    today_entries = format_entries_for_display(today_entries)

    # Get current dominant emotion for the window view
    current_mood = get_current_mood(recent_entries)

    # Get summary stats
    stats = get_dashboard_stats(recent_entries)

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "current_mood": current_mood,
            "recent_entries": recent_entries,
            "today_entries": today_entries,
            "stats": stats,
        },
    )


@app.get("/api/emotions")
async def get_emotions() -> List[Dict[str, Any]]:
    """Get recent emotion entries as JSON"""
    entries = data_manager.get_recent_entries(limit=50)
    return entries


@app.get("/api/stats")
async def get_stats() -> Dict[str, Any]:
    """Get emotion statistics"""
    entries = data_manager.get_recent_entries(limit=100)
    return get_dashboard_stats(entries)


@app.get("/api/mood")
async def get_current_mood_api() -> Dict[str, str]:
    """Get current mood for the window view"""
    recent_entries = data_manager.get_recent_entries(limit=5)
    mood = get_current_mood(recent_entries)
    return {"mood": mood, "description": get_mood_description(mood)}


def get_current_mood(entries: List[Dict[str, Any]]) -> str:
    """Determine current dominant mood from recent entries"""
    if not entries:
        return "peaceful"

    # Get the most recent emotion
    latest_emotion = entries[-1].get("emotion", "").lower()

    # Map emotions to window moods
    mood_mapping = {
        # Positive emotions
        "기쁨": "sunny",
        "만족": "sunny",
        "자신감": "clear",
        "안도": "clear",
        "설렘": "sunny",
        "평온": "peaceful",
        "행복": "sunny",
        "감사": "clear",
        "성취감": "sunny",
        "희망": "clear",
        "편안함": "peaceful",
        "뿌듯함": "sunny",
        # Negative emotions
        "스트레스": "storm",
        "불안": "cloudy",
        "좌절": "rainy",
        "화남": "storm",
        "긴장": "cloudy",
        "피로": "foggy",
        "걱정": "cloudy",
        "슬픔": "rainy",
        "짜증": "storm",
        "실망": "rainy",
        "우울": "rainy",
        "두려움": "storm",
        # Neutral emotions
        "무기력": "foggy",
        "혼란": "cloudy",
        "집중": "clear",
        "호기심": "clear",
        "평범함": "peaceful",
        "무감정": "foggy",
    }

    return mood_mapping.get(latest_emotion, "peaceful")


def get_mood_description(mood: str) -> str:
    """Get poetic description for the current mood"""
    descriptions = {
        "sunny": "따스한 햇살이 창문을 통해 들어오고, 새들이 지저귀는 소리가 들립니다",
        "clear": "맑고 청명한 하늘이 보이며, 산들바람이 커튼을 살랑 흔듭니다",
        "peaceful": "고요한 오후, 구름이 천천히 흘러가는 평온한 풍경입니다",
        "cloudy": "회색 구름이 하늘을 덮고 있지만, 그 사이로 빛이 스며듭니다",
        "foggy": "부드러운 안개가 세상을 감싸고 있어, 모든 것이 몽환적입니다",
        "rainy": "창문에 빗방울이 또르르 흘러내리며, 차분한 빗소리가 들립니다",
        "storm": "먹구름이 몰려오고 번개가 번쩍이지만, 이내 지나갈 것입니다",
    }
    return descriptions.get(mood, "알 수 없는 풍경이 창밖에 펼쳐져 있습니다")


def format_entries_for_display(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Format entry timestamps for better display with date and AM/PM"""
    import re
    from datetime import datetime

    formatted_entries = []
    for entry in entries:
        formatted_entry = entry.copy()
        timestamp = entry.get("timestamp", "")

        try:
            # Handle different timestamp formats
            if "T" in timestamp:
                # ISO format: "2024-01-01T14:30:00+09:00"
                # Remove timezone info
                clean_timestamp = re.sub(r"([+-]\d{2}:\d{2}|Z)$", "", timestamp)
                dt = datetime.fromisoformat(clean_timestamp)
            else:
                # Try to parse other formats
                dt = datetime.fromisoformat(timestamp)

            # Format as Korean style with AM/PM
            date_str = dt.strftime("%m/%d")  # MM/DD
            time_str = dt.strftime("%I:%M %p")  # HH:MM AM/PM

            # Convert AM/PM to Korean
            time_str = time_str.replace("AM", "오전").replace("PM", "오후")

            formatted_entry["display_time"] = f"{date_str} {time_str}"
            formatted_entry["display_date"] = date_str
            formatted_entry["display_clock"] = time_str

        except Exception as e:
            # Fallback for unparseable timestamps
            formatted_entry["display_time"] = (
                timestamp[-8:-3] if len(timestamp) >= 8 else timestamp
            )
            formatted_entry["display_date"] = "날짜불명"
            formatted_entry["display_clock"] = (
                timestamp[-8:-3] if len(timestamp) >= 8 else timestamp
            )

        formatted_entries.append(formatted_entry)
    return formatted_entries


def get_dashboard_stats(entries: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate dashboard statistics"""
    if not entries:
        return {
            "total_entries": 0,
            "avg_intensity": 0,
            "top_emotions": [],
            "top_contexts": [],
        }

    # Calculate basic stats
    total_entries = len(entries)
    intensities = [entry.get("intensity", 5) for entry in entries]
    avg_intensity = sum(intensities) / len(intensities) if intensities else 0

    # Count emotions and contexts
    emotions = [entry.get("emotion", "") for entry in entries if entry.get("emotion")]
    contexts = [entry.get("context", "") for entry in entries if entry.get("context")]

    from collections import Counter

    emotion_counts = Counter(emotions)
    context_counts = Counter(contexts)

    return {
        "total_entries": total_entries,
        "avg_intensity": round(avg_intensity, 1),
        "top_emotions": emotion_counts.most_common(5),
        "top_contexts": context_counts.most_common(3),
    }


def start_server(port: int = 8080, open_browser: bool = False, debug: bool = False):
    """Start the web dashboard server"""
    from rich.console import Console

    console = Console()

    # Create directories if they don't exist
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)

    url = f"http://localhost:{port}"

    console.print(f"\n🏠 Welcome to your emotional attic...")
    console.print(f"🌐 Dashboard starting at: [bold blue]{url}[/bold blue]")
    console.print(f"🪟 Looking out the window of your feelings...")
    console.print(f"✨ Press Ctrl+C to close the attic door\n")

    if open_browser:
        webbrowser.open(url)

    try:
        uvicorn.run(
            "emolog.web.server:app",
            host="127.0.0.1",
            port=port,
            reload=debug,
            log_level="info" if debug else "error",
        )
    except KeyboardInterrupt:
        console.print("\n🚪 Closing the attic door... goodbye! 👋")
