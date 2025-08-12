# Emolog Development Makefile
# Easy commands for code quality and development

.PHONY: help install format lint check test clean build push-ready

# Default target
help:
	@echo "🌟 Emolog Development Commands"
	@echo "================================"
	@echo ""
	@echo "📦 Setup & Installation:"
	@echo "  make install     - Install development dependencies"
	@echo ""
	@echo "🎨 Code Quality:"
	@echo "  make format      - Auto-format code with black & isort"
	@echo "  make lint        - Check code quality (black & isort)"
	@echo "  make check       - Run all quality checks"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make test        - Run basic functionality tests"
	@echo "  make build       - Build package for distribution"
	@echo "  make clean       - Clean build artifacts"
	@echo ""
	@echo "✅ Git Ready:"
	@echo "  make push-ready  - Format code + run all checks (ready for push)"
	@echo ""

# Install development dependencies
install:
	@echo "📦 Installing development dependencies..."
	@if command -v uv >/dev/null 2>&1; then \
		uv pip install -e ".[dev]"; \
	else \
		pip install -e ".[dev]"; \
	fi
	@echo "✅ Development environment ready!"

# Auto-format code
format:
	@echo "🎨 Formatting code with black..."
	@black src/
	@echo "📦 Sorting imports with isort..."
	@isort src/
	@echo "✅ Code formatting complete!"

# Check code quality (no changes)
lint:
	@echo "🔍 Checking code formatting..."
	@black --check src/ || (echo "❌ Black formatting issues found! Run 'make format' to fix." && exit 1)
	@echo "📦 Checking import sorting..."
	@isort --check-only src/ || (echo "❌ Import sorting issues found! Run 'make format' to fix." && exit 1)
	@echo "✅ All code quality checks passed!"

# Run all checks
check: lint test
	@echo "🎉 All checks passed! Ready for commit/push."

# Basic functionality test
test:
	@echo "🧪 Running basic functionality tests..."
	@python -c "from src.emolog.cli import main; print('✅ CLI imports work')"
	@python -c "from src.emolog.core.data_manager import DataManager; dm = DataManager(); print('✅ DataManager works')"
	@python -c "from src.emolog.core.emotion_logger import EmotionLogger; el = EmotionLogger(); print('✅ EmotionLogger works')"
	@python -c "from src.emolog.core.analyzer import EmotionAnalyzer; ea = EmotionAnalyzer(); print('✅ EmotionAnalyzer works')"
	@echo "✅ All basic tests passed!"

# Build package
build:
	@echo "🏗️  Building package..."
	@python -m build
	@echo "✅ Package built successfully!"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf build/ dist/ *.egg-info/
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "✅ Clean complete!"

# Get ready for push (format + check)
push-ready: format check
	@echo ""
	@echo "🎉 CODE IS READY FOR PUSH! 🎉"
	@echo "================================"
	@echo "✅ Code formatted with black"
	@echo "✅ Imports sorted with isort"
	@echo "✅ All quality checks passed"
	@echo "✅ Basic functionality verified"
	@echo ""
	@echo "You can now safely:"
	@echo "  git add ."
	@echo "  git commit -m 'Your message'"
	@echo "  git push"
	@echo ""
