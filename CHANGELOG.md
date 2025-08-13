# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 🌐 **Web Dashboard**: Beautiful "Emotional Attic" interface
  - `emo web`: Start local web server for emotion visualization
  - 3D attic with skylight window showing current mood
  - Real-time weather effects based on emotions (sun, rain, clouds, fog, storms)
  - Today's emotions and recent entries display
  - Responsive design for mobile and desktop
- 🎨 **Emotion-based Visuals**
  - Dynamic skylight scenes that change with your mood
  - Natural light scattering and glass reflection effects
  - Smooth animations including cloud drift and rain
  - Realistic 3D perspective and spatial depth
- 📱 **Improved Time Display**
  - Korean-style date/time formatting (MM/DD 오전/오후)
  - Cleaner timestamp presentation in web interface
  - Proper timezone handling for web dashboard
- 🇰🇷 **Better Korean Input Support**
  - Custom input function to fix Korean character composition issues
  - Smooth backspace handling for Korean text
  - UTF-8 encoding optimization for terminal input
  - Applied to all text input fields (situation, emotion, thoughts, tags, etc.)

### Technical Details
- **New Dependencies**: fastapi, uvicorn[standard], jinja2
- **Web Framework**: FastAPI with Jinja2 templates
- **Frontend**: Pure CSS with advanced animations and 3D transforms
- **Real-time Updates**: WebSocket-like periodic refresh for live data

## [0.1.0] - 2024-08-12

### Added
- 🎉 Initial release of Emolog
- ✨ Interactive emotion logging with structured input flow
  - Situation, emotion, intensity, body reaction, thought, context, tags
  - Pre-defined emotion categories and body reactions
  - Automatic completion and suggestions
- 📊 Comprehensive analysis tools
  - `emo stats`: Emotion distribution and statistics
  - `emo patterns`: Day/time-based pattern analysis
  - `emo triggers`: Stress trigger identification
  - `emo timeline`: Emotion timeline visualization
- 🛠️ Full CRUD operations
  - `emo log`: Create new emotion entries
  - `emo edit`: Edit existing entries field by field
  - `emo delete`: Selective deletion of entries
  - `emo reset`: Bulk data reset with period options
- 💾 Data management features
  - `emo backup`: Create compressed backups
  - `emo export`: Export to CSV/JSON formats
  - Local storage in `~/.emolog/` directory
  - JSONL format for efficient storage
- 🕐 KST timezone support
  - All timestamps in Korean Standard Time
  - Automatic conversion from UTC for existing data
- 🔒 Privacy protection
  - Local-only data storage
  - No external data transmission
  - User-controlled backup and export
- 🛡️ Code quality
  - Pre-push Git hooks with Black formatter
  - GitHub Actions CI/CD pipeline
  - OIDC-based PyPI publishing (no token management needed)
  - Automated PyPI publishing with Trusted Publisher

### Technical Details
- **Python 3.9+** compatibility
- **Dependencies**: click, rich, python-dateutil
- **CLI framework**: Click with Rich for beautiful terminal output
- **Data format**: JSONL for append-only logging
- **Architecture**: Modular design with clear separation of concerns

[unreleased]: https://github.com/gmlee/emolog/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/gmlee/emolog/releases/tag/v0.1.0
