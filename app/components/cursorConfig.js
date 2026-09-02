// DOM element size (px). Label cursor shows at scale(1) = 150 px.
export const CURSOR_BASE_SIZE = 150;

// Visual dot size at rest (px).
export const CURSOR_DEFAULT_SIZE = 30;

// Clip-path radius target used by LayeredCursor / About (px diameter).
export const CURSOR_EXPANDED_SIZE = 480;

// Project mode cursor — approximately 4x the default dot size (30px → 120px)
export const CURSOR_PROJECT_SIZE = 160;

export const CURSOR_LERP_FACTOR = 0.2;

export const getCursorScale = (size) => size / CURSOR_BASE_SIZE;

export const getCursorRadius = (size) => size / 2;