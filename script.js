// Global variables
const shapePattern = [7,11,15,17,19,21,21,23,23,25,25,25,25,25,25,25,23,23,21,21,19,17,15,11,7];
const gridSize = 25;
let pixels = [];
let pixelOpacities = new Map();
let brushMode = true;
let emojiMode = true;
let isDrawing = false;
let drawingState = null;
let totalActivePixels = 0;
let uploadedImage = null;
let imageCanvas = null;
let imageContext = null;
let currentGifData = null;
let gifFrames = [];
let brushOpacity = 255;

// Animation variables
let frames = [];
let currentFrameIndex = 0;
let isPlaying = false;
let animationInterval = null;
let frameDuration = 100; // Default duration in ms
let maxHistorySize = 50;
let currentDrawingSession = null;

// Default values for sliders
const defaultValues = {
    opacity: 255,
    threshold: 128,
    brightness: 0,
    contrast: 100,
    fontSize: 10,
    emojiSize: 20
};

let selectedEmoji = '😀';
let currentCategory = 'smileys';

// DOM elements
const brushToggle = document.getElementById('brushToggle');
const emojiToggle = document.getElementById('emojiToggle');
const emojiModes = document.getElementById('emojiMode');
const emojiSelected = document.querySelector('.selected-emoji-display');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');
const opacityPreview = document.getElementById('opacityPreview');
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');
const pasteBtn = document.getElementById('pasteBtn');
const textBtn = document.getElementById('textBtn');
const emojiBtn = document.getElementById('emojiBtn');
const binaryBtn = document.getElementById('binaryBtn');
const gifBtn = document.getElementById('gifBtn');
const gifUpload = document.getElementById('gifUpload');
const importControls = document.getElementById('importControls');
const binaryImportControls = document.getElementById('binaryImportControls');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');
const contrastSlider = document.getElementById('contrastSlider');
const contrastValue = document.getElementById('contrastValue');
const applyBtn = document.getElementById('applyBtn');
const fillBtn = document.getElementById('fillBtn');
const clearBtn = document.getElementById('clearBtn');
const invertBtn = document.getElementById('invertBtn');
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');
const rotateBtn = document.getElementById('rotateBtn');
const activeCount = document.getElementById('activeCount');
const totalPixelsCount = document.getElementById('totalPixels');
const emojiGrid = document.getElementById('emojiGrid');
const emojiSearch = document.getElementById('emojiSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const selectedEmojiDisplay = document.querySelector('.selected-emoji-display');

// Export modal elements
const exportBtn = document.getElementById('exportBtn');
const exportModal = document.getElementById('exportModal');
const closeExportModal = document.getElementById('closeExportModal');
const exportTabs = document.querySelectorAll('.export-tab');
const exportTabContents = document.querySelectorAll('.export-tab-content');
const exportPreviewCanvas = document.getElementById('exportPreviewCanvas');
const previewSize = document.getElementById('previewSize');
const previewFormat = document.getElementById('previewFormat');

// Image export elements
const imageFormat = document.getElementById('imageFormat');
const imageScale = document.getElementById('imageScale');
const imageQuality = document.getElementById('imageQuality');
const imageQualityValue = document.getElementById('imageQualityValue');
const qualityGroup = document.getElementById('qualityGroup');
const imageBg = document.getElementById('imageBg');
const customBgColor = document.getElementById('customBgColor');
const pixelStyle = document.getElementById('pixelStyle');
const opacityThreshold = document.getElementById('opacityThreshold');
const opacityThresholdValue = document.getElementById('opacityThresholdValue');
const downloadImageBtn = document.getElementById('downloadImageBtn');

// Animation export elements
const animationFormat = document.getElementById('animationFormat');
const downloadAnimationBtn = document.getElementById('downloadAnimationBtn');
const animationPreviewCanvas = document.getElementById('animationPreviewCanvas');
const animationPreviewInfo = document.getElementById('animationPreviewInfo');
const previewPlayPauseBtn = document.getElementById('previewPlayPauseBtn');

// Data export elements
const dataFormat = document.getElementById('dataFormat');
const dataOutput = document.getElementById('dataOutput');
const copyDataBtn = document.getElementById('copyDataBtn');
const downloadDataBtn = document.getElementById('downloadDataBtn');

// Share elements
const sharePreset = document.getElementById('sharePreset');
const shareTwitter = document.getElementById('shareTwitter');
const shareFacebook = document.getElementById('shareFacebook');
const shareNative = document.getElementById('shareNative');
const copyImageLink = document.getElementById('copyImageLink');

// Animation DOM elements
const newFrameBtn = document.getElementById('newFrameBtn');
const duplicateFrameBtn = document.getElementById('duplicateFrameBtn');
const deleteFrameBtn = document.getElementById('deleteFrameBtn');
const playBtn = document.getElementById('playBtn');
const framesContainer = document.getElementById('framesContainer');
const durationSlider = document.getElementById('durationSlider');
const durationValue = document.getElementById('durationValue');

// History controls
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

// Binary input controls
const binaryInput = document.getElementById('binaryInput');
const applyBinaryBtn = document.getElementById('applyBinaryBtn');

// Modal elements
const textModal = document.getElementById('textModal');
const emojiModal = document.getElementById('emojiModal');
const gifModal = document.getElementById('gifModal');
const closeTextModal = document.getElementById('closeTextModal');
const closeEmojiModal = document.getElementById('closeEmojiModal');
const closeGifModal = document.getElementById('closeGifModal');
const gifPreview = document.getElementById('gifPreview');
const gifFrameCount = document.getElementById('gifFrameCount');
const gifDimensions = document.getElementById('gifDimensions');
const processGifBtn = document.getElementById('processGifBtn');
const gifProgress = document.getElementById('gifProgress');
const gifProgressFill = document.getElementById('gifProgressFill');
const gifProgressText = document.getElementById('gifProgressText');
const gifBrightnessSlider = document.getElementById('gifBrightnessSlider');
const gifBrightnessValue = document.getElementById('gifBrightnessValue');
const gifContrastSlider = document.getElementById('gifContrastSlider');
const gifContrastValue = document.getElementById('gifContrastValue');
const gifThresholdSlider = document.getElementById('gifThresholdSlider');
const gifThresholdValue = document.getElementById('gifThresholdValue');
const gifInvertColors = document.getElementById('gifInvertColors');
const deleteAllModal = document.getElementById('deleteAllModal');
const closeDeleteAllModal = document.getElementById('closeDeleteAllModal');
const cancelDeleteAllBtn = document.getElementById('cancelDeleteAllBtn');
const confirmDeleteAllBtn = document.getElementById('confirmDeleteAllBtn');
const textInput = document.getElementById('textInput');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const emojiSizeSlider = document.getElementById('emojiSizeSlider');
const emojiSizeValue = document.getElementById('emojiSizeValue');
const fontType = document.getElementById('fontType');
const generateTextBtn = document.getElementById('generateTextBtn');
const generateEmojiBtn = document.getElementById('generateEmojiBtn');

// Add comprehensive emoji database
const emojiData = {
    smileys: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'
    ],
    people: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧔', '👱', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🤺', '🏇', '🏂', '🏄', '🚣', '🏊', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌', '👭', '👫', '👬', '💏', '💑', '👪'
    ],
    animals: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'
    ],
    food: [
        '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾'
    ],
    travel: [
        '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚉', '🚊', '🚝', '🚞', '🚋', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🚟', '🚠', '🚡', '🛶', '🚤', '🛥️', '🛳️', '⛵', '🚢', '⚓', '🪝', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', '🌁'
    ],
    activities: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤸', '🤼', '🤽', '🤾', '🧘', '🏃', '🚴', '🧗', '🧙', '🎯', '🪀', '🎳', '🎮', '🕹️', '🎰', '🎲', '🧩', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑️', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎬', '📺', '📷', '📸', '📹', '📽️', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻'
    ],
    objects: [
        '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⏳', '⌛', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🦯', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧽', '🚽', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧻', '🪒', '🧼', '🪥', '🪶', '🧽', '🧯', '🛒', '🚁', '🛸', '🚀', '🛰️', '💺', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🌡️', '🗺️', '🧭', '🧨', '🧯', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛗', '🪟', '🪑', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧', '🏺'
    ],
    symbols: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'
    ],
    flags: [
        '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇮🇨', '🇨🇻', '🇧🇶', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳', '🇨🇽', '🇨🇨', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾', '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇪🇺', '🇫🇰', '🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭', '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳', '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇱', '🇮🇹', '🇯🇲', '🇯🇵', '🎌', '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷', '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭', '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿', '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵', '🇲🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇳', '🇵🇱', '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇼🇸', '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨', '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰', '🇸🇮', '🇬🇸', '🇸🇧', '🇸🇴', '🇿🇦', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰', '🇧🇱', '🇸🇭', '🇰🇳', '🇱🇨', '🇲🇫', '🇵🇲', '🇻🇨', '🇸🇩', '🇸🇷', '🇸🇯', '🇸🇿', '🇸🇪', '🇨🇭', '🇸🇾', '🇹🇼', '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻', '🇻🇮', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦', '🇻🇪', '🇻🇳', '🇼🇫', '🇪🇭', '🇾🇪', '🇿🇲', '🇿🇼'
    ]
};

// Helper function to pause animation if playing
function pauseAnimationIfPlaying() {
    if (isPlaying) {
        togglePlayback();
    }
}

// Animation functions
function initializeAnimation() {
    // Create first frame with current state and its own history
    const initialFrame = {
        pixels: new Map(pixelOpacities),
        duration: 100,
        history: [],
        historyIndex: -1
    };
    
    // Initialize the frame's history with empty state
    initialFrame.history.push(new Map());
    initialFrame.historyIndex = 0;
    
    frames = [initialFrame];
    currentFrameIndex = 0;
    updateFramesDisplay();
    updateDurationDisplay();
    updateHistoryButtons();
}

function createNewFrame() {
    // Stop animation if playing
    if (isPlaying) {
        togglePlayback();
    }
    
    // Create new frame with empty state
    const newFrame = {
        pixels: new Map(),
        duration: frameDuration,
        history: [],
        historyIndex: -1
    };
    
     // Initialize the new frame's history with empty state
    newFrame.history.push(new Map());
    newFrame.historyIndex = 0;
    
    frames.push(newFrame);
    currentFrameIndex = frames.length - 1;
    
    // Clear current grid and load new frame
    pixelOpacities.clear();
    updateDisplay();
    updateFramesDisplay();
    updateDurationDisplay();
    updateHistoryButtons();
}

function duplicateCurrentFrame() {
    // Stop animation if playing
    if (isPlaying) {
        togglePlayback();
    }
    
    const currentFrame = frames[currentFrameIndex];

    const duplicatedFrame = {
        pixels: new Map(currentFrame.pixels),
        duration: currentFrame.duration,
        history: currentFrame.history.map(historyState => new Map(historyState)), // Deep copy history
        historyIndex: currentFrame.historyIndex
    };
    
    frames.splice(currentFrameIndex + 1, 0, duplicatedFrame);
    currentFrameIndex++;
    
    updateFramesDisplay();
    updateDurationDisplay();
    updateHistoryButtons();
}


function deleteCurrentFrame() {
    // Stop animation if playing
    if (isPlaying) {
        togglePlayback();
    }
    
    if (frames.length <= 1) {
        showFeedback('Cannot delete the last frame', 'error');
        return;
    }
    
    // Guardar el índice antes de eliminar
    const frameToDelete = currentFrameIndex;
    
    // Save current frame state before deletion (to preserve any unsaved changes)
    if (frameToDelete >= 0 && frameToDelete < frames.length) {
        frames[frameToDelete].pixels = new Map(pixelOpacities);
    }
    
    // Eliminar el frame actual
    frames.splice(frameToDelete, 1);
    
    // Ajustar el índice: siempre ir al frame anterior si es posible
    if (frameToDelete > 0) {
        currentFrameIndex = frameToDelete - 1;
    } else {
        // Si eliminamos el primer frame, quedarnos en 0 (que ahora es el siguiente frame)
        currentFrameIndex = 0;
    }
    
    // Load the target frame directly without using loadFrame to avoid state collision
    const targetFrame = frames[currentFrameIndex];
    pixelOpacities = new Map(targetFrame.pixels);
    frameDuration = targetFrame.duration;
    
    updateDisplay();
    updateFramesDisplay();
    updateDurationDisplay();
    updateHistoryButtons();
    
    showFeedback('Frame deleted', 'success');
}

function loadFrame(frameIndex) {
    if (frameIndex < 0 || frameIndex >= frames.length) return;
    
    // Save current frame state before switching
    if (currentFrameIndex >= 0 && currentFrameIndex < frames.length) {
        frames[currentFrameIndex].pixels = new Map(pixelOpacities);
    }
    
    currentFrameIndex = frameIndex;
    const currentFrame = frames[frameIndex];
    
    // Load the frame's pixels and duration
    pixelOpacities = new Map(currentFrame.pixels);
    frameDuration = currentFrame.duration;
    
    updateDisplay();
    updateDurationDisplay();
    updateFramesDisplay();
    updateHistoryButtons();
}

function saveCurrentFrame() {
    if (currentFrameIndex >= 0 && currentFrameIndex < frames.length) {
        frames[currentFrameIndex].pixels = new Map(pixelOpacities);
        frames[currentFrameIndex].duration = frameDuration;
        updateFramesDisplay();
    }
}

function updateFramesDisplay() {
    framesContainer.innerHTML = '';
    
    // Update export tab states when frames change
    updateExportTabStates();
    
    frames.forEach((frame, index) => {
        const frameElement = document.createElement('div');
        frameElement.className = `frame-preview ${index === currentFrameIndex ? 'active' : ''}`;
        frameElement.dataset.frameIndex = index;
        frameElement.draggable = true;
        
        // Add drag event listeners
        frameElement.addEventListener('dragstart', handleFrameDragStart);
        frameElement.addEventListener('dragover', handleFrameDragOver);
        frameElement.addEventListener('drop', handleFrameDrop);
        frameElement.addEventListener('dragend', handleFrameDragEnd);
        frameElement.addEventListener('dragenter', handleFrameDragEnter);
        frameElement.addEventListener('dragleave', handleFrameDragLeave);
        
        // Add touch event listeners for mobile
        frameElement.addEventListener('touchstart', handleFrameTouchStart, { passive: false });
        frameElement.addEventListener('touchmove', handleFrameTouchMove, { passive: false });
        frameElement.addEventListener('touchend', handleFrameTouchEnd, { passive: false });
        
        // Create mini grid
        const miniGrid = document.createElement('div');
        miniGrid.className = 'frame-mini-grid';
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const miniPixel = document.createElement('div');
                miniPixel.className = 'frame-mini-pixel';
                
                const rowWidth = shapePattern[row] || 0;
                const startCol = Math.floor((gridSize - rowWidth) / 2);
                const endCol = startCol + rowWidth - 1;
                
                if (col >= startCol && col <= endCol) {
                    const pixelId = `${row}-${col}`;
                    const opacity = frame.pixels.get(pixelId) || 0;
                    
                    if (opacity > 0) {
                        miniPixel.classList.add('active');
                        const grayValue = Math.round(opacity);
                        miniPixel.style.backgroundColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                    }
                } else {
                    miniPixel.classList.add('inactive');
                }
                
                miniGrid.appendChild(miniPixel);
            }
        }
        
        // Add frame number
        const frameNumber = document.createElement('div');
        frameNumber.className = 'frame-number';
        frameNumber.textContent = index + 1;
        
        // Add duration bar
        const durationBar = document.createElement('div');
        durationBar.className = 'frame-duration-bar';
        const durationPercent = (frame.duration / 1000) * 100;
        durationBar.style.width = `${Math.min(100, durationPercent)}%`;
        
        frameElement.appendChild(miniGrid);
        frameElement.appendChild(frameNumber);
        frameElement.appendChild(durationBar);
        
        // Add click event
        frameElement.addEventListener('click', () => {
            if (isPlaying) {
                togglePlayback();
            }
            saveCurrentFrame();
            loadFrame(index);
        });
        
        framesContainer.appendChild(frameElement);
    });
}

function updateDurationDisplay() {
    durationSlider.value = frameDuration;
    durationValue.value = frameDuration;
}

// Drag and Drop variables
let draggedFrameIndex = null;
let touchDraggedFrameIndex = null;
let isDraggingFrame = false;
let touchStartTime = 0;
let touchStartPosition = { x: 0, y: 0 };
let dragThreshold = 15; // pixels - increased for better scroll tolerance
let dragDelay = 200; // milliseconds - slightly longer delay
let deleteButtonLongPressTimer = null;
let deleteButtonLongPressDelay = 1000; // 1 second for long press

// Drag and Drop handlers
function handleFrameDragStart(e) {
    const frameElement = e.target.closest('.frame-preview');
    if (!frameElement) return;
    
    draggedFrameIndex = parseInt(frameElement.dataset.frameIndex);
    frameElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', frameElement.outerHTML);
}

function handleFrameDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleFrameDragEnter(e) {
    e.preventDefault();
    const frameElement = e.target.closest('.frame-preview');
    if (frameElement) {
        frameElement.classList.add('drag-over');
    }
}

function handleFrameDragLeave(e) {
    const frameElement = e.target.closest('.frame-preview');
    if (frameElement) {
        frameElement.classList.remove('drag-over');
    }
}

function handleFrameDrop(e) {
    e.preventDefault();
    
    const frameElement = e.target.closest('.frame-preview');
    if (!frameElement) return;
    
    const targetFrameIndex = parseInt(frameElement.dataset.frameIndex);
    
    if (draggedFrameIndex !== null && draggedFrameIndex !== targetFrameIndex) {
        // Pause animation if playing
        if (isPlaying) {
            togglePlayback();
        }
        
        // Save current frame state before reordering
        saveCurrentFrame();
        
        // Perform the reorder
        reorderFrames(draggedFrameIndex, targetFrameIndex);
        
        //showFeedback(`Frame ${draggedFrameIndex + 1} moved to position ${targetFrameIndex + 1}`, 'success');
    }
    
    // Clean up drag styles
    document.querySelectorAll('.frame-preview').forEach(frame => {
        frame.classList.remove('drag-over', 'dragging');
    });
}

function handleFrameDragEnd(e) {
    const frameElement = e.target.closest('.frame-preview');
    if (frameElement) {
        frameElement.classList.remove('dragging');
    }
    document.querySelectorAll('.frame-preview').forEach(frame => {
        frame.classList.remove('drag-over');
    });
    draggedFrameIndex = null;
}

function reorderFrames(fromIndex, toIndex) {
    // Remove the frame from its original position
    const [movedFrame] = frames.splice(fromIndex, 1);
    
    // Insert it at the new position
    frames.splice(toIndex, 0, movedFrame);
    
    // Update currentFrameIndex to follow the moved frame
    if (currentFrameIndex === fromIndex) {
        // The current frame was moved
        currentFrameIndex = toIndex;
    } else if (fromIndex < currentFrameIndex && toIndex >= currentFrameIndex) {
        // Frame moved from before current to after/at current
        currentFrameIndex--;
    } else if (fromIndex > currentFrameIndex && toIndex <= currentFrameIndex) {
        // Frame moved from after current to before/at current
        currentFrameIndex++;
    }
    
    // Refresh the display
    updateFramesDisplay();
    updateDurationDisplay();
}

// Touch event handlers for mobile frame reordering
function handleFrameTouchStart(e) {
    const frameElement = e.target.closest('.frame-preview');
    if (!frameElement) return;
    
    const touch = e.touches[0];
    touchStartTime = Date.now();
    touchStartPosition = { x: touch.clientX, y: touch.clientY };
    touchDraggedFrameIndex = parseInt(frameElement.dataset.frameIndex);
    isDraggingFrame = false; // Don't start dragging immediately
    
    // Don't prevent default here - let normal tap and scroll behavior work initially
}

function handleFrameTouchMove(e) {
    if (touchDraggedFrameIndex === null) return;
    
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosition.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Determine movement direction - prioritize horizontal scrolling
    const isHorizontalMovement = deltaX > deltaY && deltaX > 8;
    const isVerticalMovement = deltaY > deltaX && deltaY > 15;
    
    // If horizontal movement, allow scrolling and don't start dragging
    if (isHorizontalMovement && !isDraggingFrame) {
        return; // Let the browser handle horizontal scrolling
    }
    
    // Check if we should start dragging (only on vertical movement or long press)
    if (!isDraggingFrame && (isVerticalMovement && distance > dragThreshold || currentTime - touchStartTime > dragDelay)) {
        isDraggingFrame = true;
        const frameElement = document.querySelector(`[data-frame-index="${touchDraggedFrameIndex}"]`);
        if (frameElement) {
            frameElement.classList.add('dragging');
        }
    }
    
    if (!isDraggingFrame) return;
    
    e.preventDefault();
    
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetFrame = elementBelow ? elementBelow.closest('.frame-preview') : null;
    
    // Remove drag-over from all frames
    document.querySelectorAll('.frame-preview').forEach(frame => {
        frame.classList.remove('drag-over');
    });
    
    // Add drag-over to target frame if valid
    if (targetFrame && targetFrame.dataset.frameIndex !== touchDraggedFrameIndex.toString()) {
        targetFrame.classList.add('drag-over');
    }
}

function handleFrameTouchEnd(e) {
    if (touchDraggedFrameIndex === null) return;
    
    // If we were dragging, handle the drop
    if (isDraggingFrame) {
        e.preventDefault();
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetFrame = elementBelow ? elementBelow.closest('.frame-preview') : null;
        
        if (targetFrame) {
            const targetFrameIndex = parseInt(targetFrame.dataset.frameIndex);
            
            if (touchDraggedFrameIndex !== targetFrameIndex) {
                // Pause animation if playing
                if (isPlaying) {
                    togglePlayback();
                }
                
                // Save current frame state before reordering
                saveCurrentFrame();
                
                // Perform the reorder
                reorderFrames(touchDraggedFrameIndex, targetFrameIndex);
                
                showFeedback(`Frame ${touchDraggedFrameIndex + 1} moved to position ${targetFrameIndex + 1}`, 'success');
            }
        }
    }
    
    // Clean up
    document.querySelectorAll('.frame-preview').forEach(frame => {
        frame.classList.remove('drag-over', 'dragging');
    });
    
    touchDraggedFrameIndex = null;
    isDraggingFrame = false;
}

// Long press handlers for delete button
function startDeleteLongPress(e) {
    // Clear any existing timer
    if (deleteButtonLongPressTimer) {
        clearTimeout(deleteButtonLongPressTimer);
    }
    
    // Start long press timer
    deleteButtonLongPressTimer = setTimeout(() => {
        // Check if we have more than one frame to delete
        if (frames.length <= 1) {
            showFeedback('Cannot delete all frames - need at least one frame', 'error');
            return;
        }
        
        // Show confirmation modal
        showDeleteAllModal();
        
        // Add visual feedback to button
        deleteFrameBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            deleteFrameBtn.style.transform = '';
        }, 100);
        
        // Mark that long press was triggered to prevent normal click
        deleteButtonLongPressTimer = 'triggered';
        
    }, deleteButtonLongPressDelay);
    
    // Don't prevent default - let normal touch events work
}

function cancelDeleteLongPress(e) {
    // Check if long press was triggered
    const wasTriggered = deleteButtonLongPressTimer === 'triggered';
    
    // Clear the timer if it exists
    if (deleteButtonLongPressTimer && deleteButtonLongPressTimer !== 'triggered') {
        clearTimeout(deleteButtonLongPressTimer);
    }
    
    // Reset timer
    deleteButtonLongPressTimer = null;
    
    // Reset button style
    deleteFrameBtn.style.transform = '';
    
    // If long press was triggered, prevent the normal click
    if (wasTriggered && e.type === 'touchend') {
        e.preventDefault();
        e.stopPropagation();
    }
}

function updateCurrentFrameDuration() {
    frameDuration = Math.max(50, parseInt(durationSlider.value));
    if (currentFrameIndex >= 0 && currentFrameIndex < frames.length) {
        frames[currentFrameIndex].duration = frameDuration;
        updateFramesDisplay();
    }
    updateDurationDisplay();
}

function updateDurationFromInput() {
    let inputValue = parseInt(durationValue.value);
    
    // Clamp the value between min and max
    inputValue = Math.max(50, Math.min(1000, inputValue));
    
    frameDuration = inputValue;
    if (currentFrameIndex >= 0 && currentFrameIndex < frames.length) {
        frames[currentFrameIndex].duration = frameDuration;
        updateFramesDisplay();
    }
    
    // Update both slider and input field to reflect the clamped value
    durationSlider.value = frameDuration;
    durationValue.value = frameDuration;
}

function togglePlayback() {
    if (isPlaying) {
        // Stop animation
        isPlaying = false;
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        
        // Update play button icon
        const playIcon = playBtn.querySelector('.btn-icon');
        if (playIcon) {
            playIcon.setAttribute('data-feather', 'play');
            feather.replace();
        }
        
        // Restore the actual current frame state (don't use loadFrame as it might save wrong state)
        const currentFrame = frames[currentFrameIndex];
        pixelOpacities = new Map(currentFrame.pixels);
        updateDisplay();
        updateFramesDisplay();
        
        //showFeedback('Animation stopped', 'success');
    } else {
        // Start animation
        if (frames.length <= 1) {
            showFeedback('Need at least 2 frames to animate', 'error');
            return;
        }
        
        // Save current frame state before starting animation
        saveCurrentFrame();
        
        isPlaying = true;
        let animationFrameIndex = 0;
        
        // Update play button icon
        const playIcon = playBtn.querySelector('.btn-icon');
        if (playIcon) {
            playIcon.setAttribute('data-feather', 'pause');
            feather.replace();
        }
        
        function playNextFrame() {
            if (!isPlaying) return;
            
            const frame = frames[animationFrameIndex];
            // Create a temporary copy to avoid modifying the global state
            const tempPixelOpacities = new Map(frame.pixels);
            pixelOpacities = tempPixelOpacities;
            updateDisplay();
            
            // Highlight current frame in timeline
            document.querySelectorAll('.frame-preview').forEach((el, index) => {
                el.classList.toggle('active', index === animationFrameIndex);
            });
            
            animationFrameIndex = (animationFrameIndex + 1) % frames.length;
            
            if (isPlaying) {
                animationInterval = setTimeout(playNextFrame, frame.duration);
            }
        }
        
        playNextFrame();
        //showFeedback('Animation started', 'success');
    }
}

// History management functions
function saveToHistory() {
    if (currentFrameIndex < 0 || currentFrameIndex >= frames.length) return;
    
    const currentFrame = frames[currentFrameIndex];
    
    // Remove any future history if we're not at the end
    if (currentFrame.historyIndex < currentFrame.history.length - 1) {
        currentFrame.history = currentFrame.history.slice(0, currentFrame.historyIndex + 1);
    }
    
    // Add current state to frame's history
    const currentState = new Map(pixelOpacities);
    currentFrame.history.push(currentState);
    
    // Limit history size
    if (currentFrame.history.length > maxHistorySize) {
        currentFrame.history.shift();
    } else {
        currentFrame.historyIndex++;
    }
    
    updateHistoryButtons();
    
    // Save current frame in animation
    saveCurrentFrame();
}

function loadFromHistory(index) {
    if (currentFrameIndex < 0 || currentFrameIndex >= frames.length) return;
    
    const currentFrame = frames[currentFrameIndex];
    
    if (index >= 0 && index < currentFrame.history.length) {
        pixelOpacities = new Map(currentFrame.history[index]);
        currentFrame.historyIndex = index;
        currentFrame.pixels = new Map(pixelOpacities); // Update frame's current state
        updateDisplay();
        updateHistoryButtons();
        updateFramesDisplay(); // Update frame preview to reflect history changes
    }
}

function undo() {
    if (currentFrameIndex < 0 || currentFrameIndex >= frames.length) return;
    
    const currentFrame = frames[currentFrameIndex];
    if (currentFrame.historyIndex > 0) {
        loadFromHistory(currentFrame.historyIndex - 1);
    }
}

function redo() {
    if (currentFrameIndex < 0 || currentFrameIndex >= frames.length) return;
    
    const currentFrame = frames[currentFrameIndex];
    if (currentFrame.historyIndex < currentFrame.history.length - 1) {
        loadFromHistory(currentFrame.historyIndex + 1);
    }
}

function updateHistoryButtons() {
    if (currentFrameIndex < 0 || currentFrameIndex >= frames.length) {
        if (undoBtn) {
            undoBtn.disabled = true;
            undoBtn.style.opacity = '0.5';
        }
        if (redoBtn) {
            redoBtn.disabled = true;
            redoBtn.style.opacity = '0.5';
        }
        return;
    }
    
    const currentFrame = frames[currentFrameIndex];
    
    if (undoBtn) {
        undoBtn.disabled = currentFrame.historyIndex <= 0;
        undoBtn.style.opacity = currentFrame.historyIndex <= 0 ? '0.5' : '1';
    }
    if (redoBtn) {
        redoBtn.disabled = currentFrame.historyIndex >= currentFrame.history.length - 1;
        redoBtn.style.opacity = currentFrame.historyIndex >= currentFrame.history.length - 1 ? '0.5' : '1';
    }
}


// Binary input functions
function toggleBinaryImport() {
    const isVisible = binaryImportControls.style.display !== 'none';
    
    if (isVisible) {
        binaryImportControls.style.display = 'none';
        binaryBtn.classList.remove('active');
    } else {
        // Hide other import controls
        importControls.style.display = 'none';
        
        // Show binary import controls
        binaryImportControls.style.display = 'block';
        binaryBtn.classList.add('active');
        
        // Focus on the textarea
        binaryInput.focus();
    }
}

function applyBinaryData() {
    const binaryData = binaryInput.value.trim();
    if (!binaryData) return;
    
    pauseAnimationIfPlaying();
    
    try {
        const values = binaryData.split(',').map(v => parseInt(v.trim()));
        let valueIndex = 0;
        
        pixelOpacities.clear();
        
        for (let row = 0; row < gridSize; row++) {
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            for (let col = startCol; col <= endCol; col++) {
                if (valueIndex < values.length) {
                    const value = values[valueIndex];
                    if (value > 0) {
                        const pixelId = `${row}-${col}`;
                        pixelOpacities.set(pixelId, Math.max(0, Math.min(255, value)));
                    }
                    valueIndex++;
                }
            }
        }
        
        saveToHistory();
        updateDisplay();
        showBinaryFeedback('Pixel data applied successfully!', 'success');
        
        // Hide binary import controls after applying
        binaryImportControls.style.display = 'none';
        binaryBtn.classList.remove('active');
        
        // Clear the input
        binaryInput.value = '';
        
    } catch (error) {
        showBinaryFeedback('Invalid pixel data format', 'error');
    }
}

function showBinaryFeedback(message, type) {
    showFeedback(message, type);
}

// Initialize grid
function initializeGrid() {
    const grid = document.getElementById('pixelGrid');
    grid.innerHTML = '';
    pixels = [];
    pixelOpacities.clear();
    totalActivePixels = 0;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.dataset.row = row;
            pixel.dataset.col = col;
            
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            if (col >= startCol && col <= endCol) {
                totalActivePixels++;
                
                // Mouse events for drawing
                pixel.addEventListener('mousedown', (e) => handleMouseDown(e, row, col));
                pixel.addEventListener('mouseenter', (e) => handleMouseEnter(e, row, col));
                pixel.addEventListener('mouseup', () => handleMouseUp());
                
                // Touch events for mobile
                pixel.addEventListener('touchstart', (e) => handleTouchStart(e, row, col));
                pixel.addEventListener('touchmove', (e) => handleTouchMove(e));
                pixel.addEventListener('touchend', () => handleTouchEnd());
                
                // Prevent context menu
                pixel.addEventListener('contextmenu', (e) => e.preventDefault());
            } else {
                pixel.classList.add('inactive');
            }
            
            grid.appendChild(pixel);
            pixels.push(pixel);
        }
    }
    
    // Global mouse events
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    // Add touch event prevention for grid container to prevent scrolling on gaps
    const gridContainer = grid.parentElement;
    gridContainer.addEventListener('touchstart', (e) => {
        // Only prevent default if touching the grid area, not pixels
        const target = e.target;
        if (target === gridContainer || target === grid) {
            e.preventDefault();
        }
    }, { passive: false });
    
    gridContainer.addEventListener('touchmove', (e) => {
        // Always prevent default to avoid scrolling when dragging
        e.preventDefault();
    }, { passive: false });
    
    updateDisplay();
}

// Mouse and touch event handlers
function handleMouseDown(e, row, col) {
    e.preventDefault();
    
    // Start new drawing session
    currentDrawingSession = new Map(pixelOpacities);
    
    if (brushMode) {
        isDrawing = true;
        const pixelId = `${row}-${col}`;
        const currentOpacity = pixelOpacities.get(pixelId) || 0;
        drawingState = currentOpacity > 0 ? 'erase' : 'fill';
        paintPixel(row, col, drawingState);
    } else {
        togglePixel(row, col);
        // For single click, save immediately
        finishDrawingSession();
    }
}

function handleMouseEnter(e, row, col) {
    if (brushMode && isDrawing) {
        paintPixel(row, col, drawingState);
    }
}

function handleMouseUp() {
    if (isDrawing || currentDrawingSession) {
        finishDrawingSession();
    }
    isDrawing = false;
    drawingState = null;
}

function handleTouchStart(e, row, col) {
    e.preventDefault();
    handleMouseDown(e, row, col);
}

function handleTouchMove(e) {
    // Always prevent default to avoid scrolling
    e.preventDefault();
    
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('pixel') && !element.classList.contains('inactive')) {
        const row = parseInt(element.dataset.row);
        const col = parseInt(element.dataset.col);
        paintPixel(row, col, drawingState);
    }
}

function handleTouchEnd() {
    handleMouseUp();
}

function finishDrawingSession() {
    if (currentDrawingSession) {
        // Only save to history if there were actual changes
        let hasChanges = false;
        
        // Check if current state differs from drawing session start
        if (currentDrawingSession.size !== pixelOpacities.size) {
            hasChanges = true;
        } else {
            for (const [pixelId, opacity] of pixelOpacities) {
                if (currentDrawingSession.get(pixelId) !== opacity) {
                    hasChanges = true;
                    break;
                }
            }
        }
        
        if (hasChanges) {
            saveToHistory();
        }
        
        currentDrawingSession = null;
    }
}

// Pixel manipulation functions
function paintPixel(row, col, action) {
    const pixelId = `${row}-${col}`;
    const pixel = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    if (action === 'fill') {
        pixelOpacities.set(pixelId, brushOpacity);
    } else if (action === 'erase') {
        pixelOpacities.set(pixelId, 0);
    }
    
    updatePixelVisual(pixel, pixelId);
    updateActiveCount();
    updateOutput();
}

function togglePixel(row, col) {
    const pixelId = `${row}-${col}`;
    const pixel = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const currentOpacity = pixelOpacities.get(pixelId) || 0;
    
    if (currentOpacity > 0) {
        pixelOpacities.set(pixelId, 0);
    } else {
        pixelOpacities.set(pixelId, brushOpacity);
    }
    
    updatePixelVisual(pixel, pixelId);
    updateActiveCount();
    updateOutput();
}

function updatePixelVisual(pixel, pixelId) {
    const opacity = pixelOpacities.get(pixelId) || 0;
    const normalizedOpacity = opacity / 255;
    
    if (opacity > 0) {
        pixel.classList.add('active');
        const grayValue = Math.round(255 * normalizedOpacity);
        pixel.style.backgroundColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
        pixel.style.borderColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    } else {
        pixel.classList.remove('active');
        pixel.style.backgroundColor = '';
        pixel.style.borderColor = '';
    }
}

// Slider utility functions
function setupSliderPair(slider, input, callback, defaultValue) {
    // Double-click to reset
    slider.addEventListener('dblclick', () => {
        slider.value = defaultValue;
        input.value = defaultValue;
        callback();
    });
    
    // Slider input
    slider.addEventListener('input', () => {
        input.value = slider.value;
        callback();
    });
    
    // Manual input
    input.addEventListener('input', () => {
        const value = parseInt(input.value);
        if (!isNaN(value) && value >= slider.min && value <= slider.max) {
            slider.value = value;
            callback();
        }
    });
}

// Brush controls
function toggleBrushMode() {
    pauseAnimationIfPlaying();
    brushMode = !brushMode;
    
    if (brushMode) {
        brushToggle.classList.add('active');
    } else {
        brushToggle.classList.remove('active');
    }
}

// Emoji controls
function toggleEmojiMode() {
    emojiMode = !emojiMode;
    
    if (emojiMode) {
        emojiToggle.classList.add('active');
        emojiSelected.style.fontFamily = '"Noto Emoji", sans-serif';
        updateEmojiGridFont();
    } else {
        emojiToggle.classList.remove('active');
        emojiSelected.style.fontFamily = 'Arial, sans-serif';
        updateEmojiGridFont();
    }
}

function updateEmojiGridFont() {
    const emojiOptions = document.querySelectorAll('.emoji-option');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    const fontFamily = emojiMode ? '"Noto Emoji", sans-serif' : 'Arial, sans-serif';
    
    emojiOptions.forEach(option => {
        option.style.fontFamily = fontFamily;
    });
    
    categoryButtons.forEach(button => {
        button.style.fontFamily = fontFamily;
    });
}


function updateOpacity() {
    const value = parseInt(opacitySlider.value);
    brushOpacity = value;
    
    // Update preview
    const normalizedOpacity = value / 255;
    const grayValue = Math.round(255 * normalizedOpacity);
    opacityPreview.style.backgroundColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
}

// Action functions
function fillAll() {
    pauseAnimationIfPlaying();
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const pixelId = `${row}-${col}`;
            pixelOpacities.set(pixelId, brushOpacity);
        }
    }
    
    saveToHistory();
    updateDisplay();
}

function eraseAll() {
    pauseAnimationIfPlaying();
    pixelOpacities.clear();
    saveToHistory();
    updateDisplay();
}

function reverse() {
    pauseAnimationIfPlaying();
    const newOpacities = new Map();
    
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const pixelId = `${row}-${col}`;
            const currentOpacity = pixelOpacities.get(pixelId) || 0;
            newOpacities.set(pixelId, 255 - currentOpacity);
        }
    }
    
    pixelOpacities = newOpacities;
    saveToHistory();
    updateDisplay();
}

// Transform functions
function flipHorizontal() {
    pauseAnimationIfPlaying();
    const newOpacities = new Map();
    
    for (const [pixelId, opacity] of pixelOpacities) {
        const [row, col] = pixelId.split('-').map(Number);
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        const newCol = endCol - (col - startCol);
        newOpacities.set(`${row}-${newCol}`, opacity);
    }
    
    pixelOpacities = newOpacities;
    saveToHistory();
    updateDisplay();
}

function flipVertical() {
    pauseAnimationIfPlaying();
    const newOpacities = new Map();
    
    for (const [pixelId, opacity] of pixelOpacities) {
        const [row, col] = pixelId.split('-').map(Number);
        const newRow = gridSize - 1 - row;
        
        const newRowWidth = shapePattern[newRow] || 0;
        if (newRowWidth > 0) {
            const oldRowWidth = shapePattern[row] || 0;
            const oldStartCol = Math.floor((gridSize - oldRowWidth) / 2);
            const newStartCol = Math.floor((gridSize - newRowWidth) / 2);
            
            const relativePos = (col - oldStartCol) / Math.max(1, oldRowWidth - 1);
            const newCol = Math.round(newStartCol + relativePos * Math.max(1, newRowWidth - 1));
            
            if (newCol >= newStartCol && newCol < newStartCol + newRowWidth) {
                newOpacities.set(`${newRow}-${newCol}`, opacity);
            }
        }
    }
    
    pixelOpacities = newOpacities;
    saveToHistory();
    updateDisplay();
}

function rotate90() {
    pauseAnimationIfPlaying();
    const newOpacities = new Map();
    
    for (const [pixelId, opacity] of pixelOpacities) {
        const [row, col] = pixelId.split('-').map(Number);
        
        const centerX = 12;
        const centerY = 12;
        const x = col - centerX;
        const y = row - centerY;
        
        const newX = -y;
        const newY = x;
        
        const newRow = newY + centerY;
        const newCol = newX + centerX;
        
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            const newRowWidth = shapePattern[newRow] || 0;
            const newStartCol = Math.floor((gridSize - newRowWidth) / 2);
            const newEndCol = newStartCol + newRowWidth - 1;
            
            if (newCol >= newStartCol && newCol <= newEndCol) {
                newOpacities.set(`${newRow}-${newCol}`, opacity);
            }
        }
    }
    
    pixelOpacities = newOpacities;
    saveToHistory();
    updateDisplay();
}

// Display update functions
function updateDisplay() {
    pixels.forEach(pixel => {
        const row = parseInt(pixel.dataset.row);
        const col = parseInt(pixel.dataset.col);
        const pixelId = `${row}-${col}`;
        
        updatePixelVisual(pixel, pixelId);
    });
    
    updateActiveCount();
    updateOutput();
}

function updateActiveCount() {
    let count = 0;
    for (const [pixelId, opacity] of pixelOpacities) {
        if (opacity > 0) count++;
    }
    
    activeCount.textContent = count;
    totalPixelsCount.textContent = totalActivePixels;
}

// Output functions
function generateBinaryOutput() {
    let binaryString = '';
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const pixelId = `${row}-${col}`;
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            if (col >= startCol && col <= endCol) {
                const opacity = pixelOpacities.get(pixelId) || 0;
                binaryString += opacity.toString() + ',';
            }
        }
    }
    
    return binaryString.slice(0, -1);
}

function updateOutput() {
    // Generate binary output for internal use
    generateBinaryOutput();
}

async function copyToClipboard() {
    const binary = generateBinaryOutput();
    
    try {
        await navigator.clipboard.writeText(binary);
        showFeedback('Pixel data copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = binary;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showFeedback('Pixel data copied to clipboard!', 'success');
        } catch (err) {
            showFeedback('Failed to copy pixel data', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback() {
    copyFeedback.classList.add('show');
    
    setTimeout(() => {
        copyFeedback.classList.remove('show');
    }, 2000);
}

// Clipboard paste function
async function pasteFromClipboard() {
    try {
        const clipboardItems = await navigator.clipboard.read();
        
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    const url = URL.createObjectURL(blob);
                    
                    const img = new Image();
                    img.onload = function() {
                        uploadedImage = img;
                        processImage();
                        importControls.style.display = 'block';
                        showFeedback('Image pasted successfully!', 'success');
                        // Auto-apply the image immediately
                        applyImageToPixels();
                        URL.revokeObjectURL(url);
                    };
                    img.onerror = function() {
                        showFeedback('Failed to process pasted image', 'error');
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                    return;
                }
            }
        }
        
        showFeedback('No image found in clipboard', 'error');
    } catch (err) {
        showFeedback('Failed to paste from clipboard', 'error');
        console.error('Paste error:', err);
    }
}

function showFeedback(message, type = 'success') {
    // Remove any existing feedback
    const existingFeedback = document.getElementById('unifiedFeedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create new feedback element
    const feedback = document.createElement('div');
    feedback.id = 'unifiedFeedback';
    feedback.className = `unified-feedback show ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300); // Wait for fade out animation
    }, 1200);
}

// Text to pixel art functions
function showTextModal() {
    textModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    textInput.focus();
}

function hideTextModal() {
    textModal.style.display = 'none';
    document.body.style.overflow = '';
    textInput.value = '';
}

function showEmojiModal() {
    emojiModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideEmojiModal() {
    emojiModal.style.display = 'none';
    document.body.style.overflow = '';
    // DON'T reset emoji selection and category - keep user's current state
    // This preserves the selected emoji and category for next time
}

function showGifModal() {
    gifModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideGifModal() {
    gifModal.style.display = 'none';
    document.body.style.overflow = '';
    // Reset GIF data
    currentGifData = null;
    gifFrames = [];
    gifProgress.style.display = 'none';
    gifProgressFill.style.width = '0%';
}

function showDeleteAllModal() {
    deleteAllModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideDeleteAllModal() {
    deleteAllModal.style.display = 'none';
    document.body.style.overflow = '';
}

function deleteAllFrames() {
    // Pause animation if playing
    if (isPlaying) {
        togglePlayback();
    }
    
    // Reset to a single empty frame
    frames.length = 0;
    currentFrameIndex = 0;
    pixelOpacities.clear();
    
    // Create a new empty frame
    const newFrame = {
        pixels: new Map(),
        duration: 100,
        history: [new Map()],
        historyIndex: 0
    };
    frames.push(newFrame);
    
    // Update displays
    updateFramesDisplay();
    updateDurationDisplay();
    updateDisplay();
    updateHistoryButtons();
    
    hideDeleteAllModal();
    showFeedback('All frames deleted. Started with a fresh empty frame.', 'success');
}

function generateTextPixelArt() {
    const text = textInput.value.trim();
    if (!text) return;
    
    pauseAnimationIfPlaying();
    
    const fontSize = parseInt(fontSizeSlider.value);
    const fontType = document.getElementById('fontType').value;
    
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 25;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 25, 25);
    
    // Set font
    ctx.font = `${fontSize}px '${fontType}', sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Measure text
    const metrics = ctx.measureText(text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
    // Center position
    const centerY = (25 - textHeight) / 2 + metrics.actualBoundingBoxAscent;
        
    // Draw text
    ctx.fillText(text, 12.5, centerY);
    
    // Process the canvas as an image (will be inverted)
    processCanvasAsImage(canvas);
    hideTextModal();
}

function generateEmojiPixelArt() {
    if (!selectedEmoji) return;
    
    pauseAnimationIfPlaying();
    
    const fontSize = parseInt(emojiSizeSlider.value);
    
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 25;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 25, 25);
    
    // Set font for emoji
    if (emojiMode === true) {
        ctx.font = `${fontSize}px "Noto Emoji", sans-serif`;
    } else {
        ctx.font = `${fontSize}px Arial, sans-serif`;
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Measure text
    const metrics = ctx.measureText(selectedEmoji);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        
    // Center position
    const centerY = (25 - textHeight) / 2 + metrics.actualBoundingBoxAscent;
        
    // Draw text
    ctx.fillText(selectedEmoji, 12.5, centerY);
    
    // Process the canvas as an image (will be inverted)
    processCanvasAsImage(canvas);
    hideEmojiModal();
}

function processCanvasAsImage(canvas) {
    // Create a temporary image from canvas
    const img = new Image();
    img.onload = function() {
        uploadedImage = img;
        
        // Create image canvas and context if they don't exist
        if (!imageCanvas) {
            createImageCanvas();
        }
        
        processImage();
        importControls.style.display = 'block';
        
        // Auto-apply with grayscale mode
        applyImageToPixels();
    };
    img.src = canvas.toDataURL();
}

// Image processing functions
function createImageCanvas() {
    imageCanvas = document.createElement('canvas');
    imageCanvas.className = 'preview-canvas';
    imageCanvas.width = 25;
    imageCanvas.height = 25;
    imageContext = imageCanvas.getContext('2d');
    document.body.appendChild(imageCanvas);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        showFeedback('Please select a valid image file', 'error');
        return;
    }

    // Check file size (optional - limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showFeedback('Image file is too large (max 10MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            uploadedImage = img;
            processImage();
            importControls.style.display = 'block';
            showFeedback('Image uploaded successfully!', 'success');
            // Auto-apply the image immediately
            applyImageToPixels();
        };
        img.onerror = function() {
            showFeedback('Failed to process uploaded image', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showFeedback('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
}

function processImage() {
    if (!uploadedImage || !imageCanvas) return;

    imageContext.clearRect(0, 0, 25, 25);
    imageContext.drawImage(uploadedImage, 0, 0, 25, 25);
    applyImageFilters();
}

function applyImageFilters() {
    if (!uploadedImage) return;

    imageContext.clearRect(0, 0, 25, 25);
    imageContext.drawImage(uploadedImage, 0, 0, 25, 25);

    const imageData = imageContext.getImageData(0, 0, 25, 25);
    const data = imageData.data;

    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseInt(contrastSlider.value) / 100;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = ((data[i] - 128) * contrast + 128);
        data[i + 1] = ((data[i + 1] - 128) * contrast + 128);
        data[i + 2] = ((data[i + 2] - 128) * contrast + 128);
        
        data[i] = Math.max(0, Math.min(255, data[i] + brightness));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
    }

    imageContext.putImageData(imageData, 0, 0);
}

function updateImportMode() {
    const mode = importMode.value;
    
    if (mode === 'threshold') {
        thresholdGroup.style.display = 'flex';
    } else {
        thresholdGroup.style.display = 'none';
    }
}

function updateThreshold() {
    // This is called by the slider pair setup
}

function updateBrightness() {
    if (uploadedImage) {
        applyImageFilters();
    }
}

function updateContrast() {
    if (uploadedImage) {
        applyImageFilters();
    }
}

function updateFontSize() {
    // This is called by the slider pair setup
}

function updateEmojiSize() {
    // This is called by the slider pair setup
}

function applyImageToPixels() {
    if (!uploadedImage) return;
    pauseAnimationIfPlaying();

    const imageData = imageContext.getImageData(0, 0, 25, 25);
    const data = imageData.data;

    pixelOpacities.clear();

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            if (col >= startCol && col <= endCol) {
                const pixelIndex = (row * 25 + col) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
                const pixelId = `${row}-${col}`;
                
                const opacity = Math.round(brightness);
                if (opacity > 0) {
                    pixelOpacities.set(pixelId, opacity);
                }
            }
        }
    }

    saveToHistory();
    updateDisplay();
}

// GIF Import Functions
async function handleGifUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if SuperGif library is loaded
    if (typeof SuperGif === 'undefined') {
        showFeedback('GIF processing library not loaded. Please refresh the page.', 'error');
        console.error('SuperGif library not found. Available globals:', Object.keys(window).filter(k => k.toLowerCase().includes('gif')));
        return;
    }

    // Check if file is a GIF
    if (file.type !== 'image/gif') {
        showFeedback('Please select a valid GIF file', 'error');
        return;
    }

    // Check file size (limit to 20MB)
    if (file.size > 20 * 1024 * 1024) {
        showFeedback('GIF file is too large (max 20MB)', 'error');
        return;
    }

    try {
        // Create URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Create a temporary img element
        const tempImg = document.createElement('img');
        tempImg.src = fileUrl;
        tempImg.style.display = 'none';
        document.body.appendChild(tempImg);

        // Initialize SuperGif
        const rub = new SuperGif({
            gif: tempImg,
            auto_play: false,
            show_progress_bar: false
        });

        rub.load(() => {
            try {
                const frameCount = rub.get_length();
                const canvas = rub.get_canvas();
                
                if (frameCount === 0) {
                    showFeedback('No frames found in GIF', 'error');
                    cleanup();
                    return;
                }

                // Debug: Check available methods
                console.log('SuperGif methods:', Object.getOwnPropertyNames(rub).filter(name => typeof rub[name] === 'function'));

                // Try to get frame delays from internal data
                let frameDelays = [];
                try {
                    // Access internal frames if available
                    if (rub.frames && rub.frames.length > 0) {
                        frameDelays = rub.frames.map(frame => frame.delay || 10);
                    }
                } catch (e) {
                    console.log('Could not access frame delays, using default');
                }

                // Store GIF data
                currentGifData = { 
                    rub: rub, 
                    frameCount: frameCount,
                    canvas: canvas,
                    frameDelays: frameDelays
                };
                
                // Update UI with GIF info
                gifFrameCount.textContent = `${frameCount} frames`;
                gifDimensions.textContent = `${canvas.width}x${canvas.height}`;
                
                showGifModal();
                showFeedback('GIF loaded successfully', 'success');
                
            } catch (error) {
                console.error('Error processing GIF:', error);
                showFeedback('Error processing GIF frames', 'error');
                cleanup();
            }
        });

        function cleanup() {
            document.body.removeChild(tempImg);
            URL.revokeObjectURL(fileUrl);
        }
        
    } catch (error) {
        console.error('Error loading GIF:', error);
        showFeedback('Error loading GIF file', 'error');
    }

    // Reset file input
    event.target.value = '';
}

async function processGifToFrames() {
    if (!currentGifData || !currentGifData.rub) {
        showFeedback('No GIF data to process', 'error');
        return;
    }

    // Pause animation if playing
    pauseAnimationIfPlaying();

    // Show progress
    gifProgress.style.display = 'block';
    gifProgressFill.style.width = '0%';
    gifProgressText.textContent = 'Processing frames...';

    // Get processing settings
    const brightness = parseInt(gifBrightnessValue.value);
    const contrast = parseInt(gifContrastValue.value);
    const threshold = parseInt(gifThresholdValue.value);
    const invertColors = gifInvertColors.checked;

    try {
        const processedFrames = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 25;
        canvas.height = 25;
        
        const { rub, frameCount, frameDelays } = currentGifData;

        for (let i = 0; i < frameCount; i++) {
            const progress = ((i + 1) / frameCount) * 100;
            
            // Update progress
            gifProgressFill.style.width = `${progress}%`;
            gifProgressText.textContent = `Processing frame ${i + 1}/${frameCount}`;

            // Move to frame
            rub.move_to(i);
            
            // Get frame canvas
            const frameCanvas = rub.get_canvas();
            
            // Get frame delay from stored delays or use default
            const frameDelay = (frameDelays && frameDelays[i]) ? frameDelays[i] : 10; // Default 10 centiseconds = 100ms

            // Scale and process to 25x25
            ctx.clearRect(0, 0, 25, 25);
            ctx.drawImage(frameCanvas, 0, 0, 25, 25);

            // Apply image processing
            const processedImageData = ctx.getImageData(0, 0, 25, 25);
            applyImageAdjustments(processedImageData, brightness, contrast, invertColors);
            ctx.putImageData(processedImageData, 0, 0);

            // Convert to pixel data
            const finalImageData = ctx.getImageData(0, 0, 25, 25);
            const framePixels = convertImageDataToPixels(finalImageData.data, threshold);
            
            processedFrames.push({
                pixels: framePixels,
                duration: frameDelay * 10 || 100 // Convert centiseconds to milliseconds
            });

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 1));
        }

        // Detect and merge duplicate frames
        const optimizedFrames = mergeConsecutiveDuplicateFrames(processedFrames);

        // Replace current animation
        frames.length = 0;
        currentFrameIndex = -1; // Set to invalid index to prevent save during loadFrame
        pixelOpacities.clear(); // Clear current pixels to prevent overwriting imported frames

        optimizedFrames.forEach(frameData => {
            const newFrame = {
                pixels: new Map(frameData.pixels),
                duration: frameData.duration,
                history: [new Map(frameData.pixels)],
                historyIndex: 0
            };
            frames.push(newFrame);
        });

        // Load first frame
        if (frames.length > 0) {
            loadFrame(0);
        }

        hideGifModal();
        showFeedback(`GIF imported: ${optimizedFrames.length} frames (${frameCount - optimizedFrames.length} duplicates merged)`, 'success');

    } catch (error) {
        console.error('Error processing GIF:', error);
        showFeedback('Error processing GIF frames', 'error');
        gifProgress.style.display = 'none';
    }
}

function convertImageDataToPixels(data, threshold) {
    const pixels = new Map();
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            if (col >= startCol && col <= endCol) {
                const pixelIndex = (row * 25 + col) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                const a = data[pixelIndex + 3];
                
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
                
                if (brightness > threshold) {
                    const pixelId = `${row}-${col}`;
                    pixels.set(pixelId, Math.round(brightness));
                }
            }
        }
    }
    
    return pixels;
}

function mergeConsecutiveDuplicateFrames(frames) {
    if (frames.length <= 1) return frames;
    
    const merged = [];
    let currentFrame = { ...frames[0] };
    
    for (let i = 1; i < frames.length; i++) {
        const nextFrame = frames[i];
        
        // Compare pixel maps
        if (arePixelMapsEqual(currentFrame.pixels, nextFrame.pixels)) {
            // Merge duration
            currentFrame.duration += nextFrame.duration;
        } else {
            // Different frame, save current and start new
            merged.push(currentFrame);
            currentFrame = { ...nextFrame };
        }
    }
    
    // Add the last frame
    merged.push(currentFrame);
    
    return merged;
}

function arePixelMapsEqual(map1, map2) {
    if (map1.size !== map2.size) return false;
    
    for (let [key, value] of map1) {
        if (map2.get(key) !== value) return false;
    }
    
    return true;
}

function applyImageAdjustments(imageData, brightness, contrast, invert = false) {
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply invert first if enabled
        if (invert) {
            data[i] = 255 - data[i];         // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
        }
        
        // Apply contrast
        data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        
        // Apply brightness
        data[i] = Math.max(0, Math.min(255, data[i] + brightness));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
    }
}

// Emoji functions
function populateEmojiGrid(category) {
    emojiGrid.innerHTML = '';
    const emojis = emojiData[category] || [];
    
    emojis.forEach(emoji => {
        const button = document.createElement('button');
        button.className = 'emoji-option';
        button.textContent = emoji;
        button.dataset.emoji = emoji;
        
        button.style.fontFamily = emojiMode ? '"Noto Emoji", sans-serif' : 'Arial, sans-serif';
        
        button.addEventListener('click', (e) => selectEmoji(e, emoji));
        emojiGrid.appendChild(button);
    });
}

function selectEmoji(e, emoji) {
    e.preventDefault();
    
    // Remove selected class from all options
    document.querySelectorAll('.emoji-option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    e.target.classList.add('selected');
    
    selectedEmoji = emoji;
    selectedEmojiDisplay.textContent = emoji;
    
    selectedEmojiDisplay.style.fontFamily = emojiMode ? '"Noto Emoji", sans-serif' : 'Arial, sans-serif';
}

function handleCategoryChange() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update current category
            currentCategory = btn.dataset.category;
            
            // Populate grid with new category
            populateEmojiGrid(currentCategory);
        });
    });
}

function handleEmojiSearch() {
    emojiSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            populateEmojiGrid(currentCategory);
            return;
        }
        
        // Search through all emojis
        const allEmojis = Object.values(emojiData).flat();
        const filteredEmojis = allEmojis.filter(emoji => {
            // Check if emoji has associated names (only if emojiNames is defined)
            if (typeof emojiNames !== 'undefined' && emojiNames[emoji]) {
                const names = emojiNames[emoji];
                return names.some(name => name.toLowerCase().includes(searchTerm));
            }
            // Fallback to emoji character matching
            return emoji.includes(searchTerm);
        });
        
        // Populate grid with filtered results
        emojiGrid.innerHTML = '';
        
        if (filteredEmojis.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.gridColumn = '1 / -1';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '20px';
            noResults.style.color = '#666';
            noResults.style.fontSize = '0.8rem';
            noResults.textContent = 'No emojis found';
            emojiGrid.appendChild(noResults);
            return;
        }
        
        filteredEmojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-option';
            button.textContent = emoji;
            button.dataset.emoji = emoji;
            button.addEventListener('click', (e) => selectEmoji(e, emoji));
            emojiGrid.appendChild(button);
        });
    });
}

function downloadAsImage() {
    // Create a canvas for the download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size for higher resolution
    const pixelSize = 40; // Each pixel will be 40x40 pixels
    const gapSize = 10; // Gap between pixels (adjust this to match your CSS gap)
    const scaleFactor = pixelSize + gapSize;
    
    canvas.width = gridSize * scaleFactor - gapSize; // Subtract gap from last pixel
    canvas.height = gridSize * scaleFactor - gapSize;
    
    // DON'T fill background - leave it transparent
    // The canvas starts transparent by default
    
    // Draw each pixel ONLY within the valid shape pattern
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const pixelId = `${row}-${col}`;
            const opacity = pixelOpacities.get(pixelId) || 0;
            
            // Calculate pixel position with gaps
            const x = col * scaleFactor;
            const y = row * scaleFactor;
            
            // Draw background pixel (dark gray) for all pixels within the sphere
            ctx.fillStyle = '#111111'; // Dark background for the sphere area
            ctx.fillRect(x, y, pixelSize, pixelSize);
            
            // If pixel has opacity, draw it on top
            if (opacity > 0) {
                const grayValue = Math.round(opacity);
                ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }
    }
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glyph-matrix.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showDownloadFeedback();
    }, 'image/png');
}

function showDownloadFeedback() {
    showFeedback('Image downloaded successfully!', 'success');
}

async function exportAsGif() {
    if (frames.length <= 1) {
        showFeedback('Need at least 2 frames to create GIF', 'error');
        return;
    }
    
    try {
        showFeedback('Loading GIF library...', 'success');
        
        // Fetch worker script to avoid CORS issues
        let workerUrl;
        try {
            const workerResponse = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js');
            const workerBlob = await workerResponse.blob();
            workerUrl = URL.createObjectURL(workerBlob);
        } catch (workerError) {
            console.warn('Could not load worker script, falling back to single-threaded mode');
            workerUrl = null;
        }
        
        showFeedback('Generating GIF...', 'success');
        
        const pixelSize = 40;
        const gapSize = 10;
        const scaleFactor = pixelSize + gapSize;
        
        const canvasWidth = gridSize * scaleFactor - gapSize;
        const canvasHeight = gridSize * scaleFactor - gapSize;
        
        // Initialize gif.js
        const gifOptions = {
            quality: 10,
            width: canvasWidth,
            height: canvasHeight,
            background: '#000000'
        };
        
        if (workerUrl) {
            gifOptions.workers = 2;
            gifOptions.workerScript = workerUrl;
        } else {
            gifOptions.workers = 1;
        }
        
        const gif = new GIF(gifOptions);
        
        // Generate frames and add to GIF
        for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
            const frame = frames[frameIndex];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Draw frame
            for (let row = 0; row < gridSize; row++) {
                const rowWidth = shapePattern[row] || 0;
                const startCol = Math.floor((gridSize - rowWidth) / 2);
                const endCol = startCol + rowWidth - 1;
                
                for (let col = startCol; col <= endCol; col++) {
                    const pixelId = `${row}-${col}`;
                    const opacity = frame.pixels.get(pixelId) || 0;
                    
                    const x = col * scaleFactor;
                    const y = row * scaleFactor;
                    
                    // Draw background pixel
                    ctx.fillStyle = '#111111';
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                    
                    // Draw pixel if it has opacity
                    if (opacity > 0) {
                        const grayValue = Math.round(opacity);
                        ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            }
            
            // Add frame to GIF with its duration
            gif.addFrame(canvas, {delay: frame.duration});
        }
        
        // Render and download GIF
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'glyph-matrix-animation.gif';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Clean up worker URL if created
            if (workerUrl) {
                URL.revokeObjectURL(workerUrl);
            }
            
            showFeedback('GIF exported successfully!', 'success');
        });
        
        gif.on('progress', function(p) {
            const percent = Math.round(p * 100);
            showFeedback(`Generating GIF... ${percent}%`, 'success');
        });
        
        gif.render();
        
    } catch (error) {
        showFeedback('Failed to export GIF', 'error');
        console.error('GIF export error:', error);
    }
}

async function exportAsWebM() {
    if (frames.length <= 1) {
        showFeedback('Need at least 2 frames to create WebM', 'error');
        return;
    }
    
    try {
        showFeedback('Generating WebM...', 'success');
        
        // Create offscreen canvas for recording
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const pixelSize = 40;
        const gapSize = 10;
        const scaleFactor = pixelSize + gapSize;
        
        const canvasWidth = gridSize * scaleFactor - gapSize;
        const canvasHeight = gridSize * scaleFactor - gapSize;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Create MediaRecorder
        const stream = canvas.captureStream(30); // 30 FPS
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'glyph-matrix-animation.webm';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showFeedback('WebM exported successfully!', 'success');
        };
        
        mediaRecorder.onerror = (event) => {
            showFeedback('Failed to export WebM', 'error');
            console.error('WebM export error:', event.error);
        };
        
        // Start recording
        mediaRecorder.start();
        
        // Render animation frames
        let currentFrame = 0;
        let totalDuration = 0;
        
        // Calculate total animation duration
        frames.forEach(frame => {
            totalDuration += frame.duration;
        });
        
        const renderFrame = () => {
            if (currentFrame >= frames.length) {
                // Animation complete, stop recording
                setTimeout(() => {
                    mediaRecorder.stop();
                }, 100); // Small delay to ensure last frame is captured
                return;
            }
            
            const frame = frames[currentFrame];
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Draw frame pixels
            for (let row = 0; row < gridSize; row++) {
                const rowWidth = shapePattern[row] || 0;
                const startCol = Math.floor((gridSize - rowWidth) / 2);
                const endCol = startCol + rowWidth - 1;
                
                for (let col = startCol; col <= endCol; col++) {
                    const pixelId = `${row}-${col}`;
                    const opacity = frame.pixels.get(pixelId) || 0;
                    
                    const x = col * scaleFactor;
                    const y = row * scaleFactor;
                    
                    // Draw background pixel
                    ctx.fillStyle = '#111111';
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                    
                    // Draw pixel if it has opacity
                    if (opacity > 0) {
                        const grayValue = Math.round(opacity);
                        ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                        ctx.fillRect(x, y, pixelSize, pixelSize);
                    }
                }
            }
            
            currentFrame++;
            
            // Schedule next frame
            setTimeout(renderFrame, frame.duration);
        };
        
        // Start rendering
        renderFrame();
        
    } catch (error) {
        showFeedback('Failed to export WebM', 'error');
        console.error('WebM export error:', error);
    }
}

// Header close functionality
function initHeaderClose() {
    const headerClose = document.getElementById('headerClose');
    const header = document.querySelector('.header');
    
    headerClose.addEventListener('click', () => {
        header.style.display = 'none';
    });
}

// Horizontal scrolling for frames container
function initFramesScrolling() {
    const framesContainer = document.getElementById('framesContainer');
    
    // Add wheel event listener for horizontal scrolling
    framesContainer.addEventListener('wheel', (e) => {
        // Prevent default vertical scrolling
        e.preventDefault();
        
        // Convert vertical scroll to horizontal
        framesContainer.scrollLeft += e.deltaY;
    }, { passive: false });
}

// Collapsible controls
function initCollapsibleControls() {
    document.querySelectorAll('.control-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        });
    });
}

// Event listeners
brushToggle.addEventListener('click', toggleBrushMode);
emojiModes.addEventListener('click', toggleEmojiMode);
uploadBtn.addEventListener('click', () => imageUpload.click());
pasteBtn.addEventListener('click', pasteFromClipboard);
textBtn.addEventListener('click', showTextModal);
emojiBtn.addEventListener('click', showEmojiModal);
imageUpload.addEventListener('change', handleImageUpload);
applyBtn.addEventListener('click', applyImageToPixels);
fillBtn.addEventListener('click', fillAll);
clearBtn.addEventListener('click', eraseAll);
invertBtn.addEventListener('click', reverse);
flipHBtn.addEventListener('click', flipHorizontal);
flipVBtn.addEventListener('click', flipVertical);
rotateBtn.addEventListener('click', rotate90);
binaryBtn.addEventListener('click', toggleBinaryImport);
gifBtn.addEventListener('click', () => gifUpload.click());
gifUpload.addEventListener('change', handleGifUpload);

// Export modal event listeners
exportBtn.addEventListener('click', openExportModal);
closeExportModal.addEventListener('click', closeExportModalHandler);

// Animation event listeners
newFrameBtn.addEventListener('click', createNewFrame);
duplicateFrameBtn.addEventListener('click', duplicateCurrentFrame);
deleteFrameBtn.addEventListener('click', deleteCurrentFrame);

// Long press for delete all frames
deleteFrameBtn.addEventListener('mousedown', startDeleteLongPress);
deleteFrameBtn.addEventListener('mouseup', cancelDeleteLongPress);
deleteFrameBtn.addEventListener('mouseleave', cancelDeleteLongPress);
deleteFrameBtn.addEventListener('touchstart', startDeleteLongPress, { passive: false });
deleteFrameBtn.addEventListener('touchend', cancelDeleteLongPress, { passive: false });
deleteFrameBtn.addEventListener('touchcancel', cancelDeleteLongPress, { passive: false });

playBtn.addEventListener('click', togglePlayback);
durationSlider.addEventListener('input', updateCurrentFrameDuration);

// Double-tap reset functionality for duration slider
let lastTapTime = 0;
durationSlider.addEventListener('click', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTapTime;
    
    if (timeDiff < 300) { // Double-tap within 300ms
        // Reset to default value (100ms)
        durationSlider.value = 100;
        frameDuration = 100;
        if (currentFrameIndex >= 0 && currentFrameIndex < frames.length) {
            frames[currentFrameIndex].duration = frameDuration;
            updateFramesDisplay();
        }
        updateDurationDisplay();
        showFeedback('Duration reset to 100ms', 'success');
    }
    
    lastTapTime = currentTime;
});

// Manual input field event listeners
durationValue.addEventListener('input', updateDurationFromInput);
durationValue.addEventListener('change', updateDurationFromInput);

// GIF modal slider synchronization
if (gifBrightnessSlider && gifBrightnessValue) {
    gifBrightnessSlider.addEventListener('input', () => {
        gifBrightnessValue.value = gifBrightnessSlider.value;
    });
    gifBrightnessValue.addEventListener('input', () => {
        gifBrightnessSlider.value = gifBrightnessValue.value;
    });
}

if (gifContrastSlider && gifContrastValue) {
    gifContrastSlider.addEventListener('input', () => {
        gifContrastValue.value = gifContrastSlider.value;
    });
    gifContrastValue.addEventListener('input', () => {
        gifContrastSlider.value = gifContrastValue.value;
    });
}

if (gifThresholdSlider && gifThresholdValue) {
    gifThresholdSlider.addEventListener('input', () => {
        gifThresholdValue.value = gifThresholdSlider.value;
    });
    gifThresholdValue.addEventListener('input', () => {
        gifThresholdSlider.value = gifThresholdValue.value;
    });
}

// History event listeners
if (undoBtn) undoBtn.addEventListener('click', undo);
if (redoBtn) redoBtn.addEventListener('click', redo);

// Binary input event listener
if (applyBinaryBtn) applyBinaryBtn.addEventListener('click', applyBinaryData);

// Modal event listeners
closeTextModal.addEventListener('click', hideTextModal);
closeEmojiModal.addEventListener('click', hideEmojiModal);
closeGifModal.addEventListener('click', hideGifModal);
closeDeleteAllModal.addEventListener('click', hideDeleteAllModal);
cancelDeleteAllBtn.addEventListener('click', hideDeleteAllModal);
confirmDeleteAllBtn.addEventListener('click', deleteAllFrames);
generateTextBtn.addEventListener('click', generateTextPixelArt);
generateEmojiBtn.addEventListener('click', generateEmojiPixelArt);
processGifBtn.addEventListener('click', processGifToFrames);

// Close modals when clicking outside
textModal.addEventListener('click', (e) => {
    if (e.target === textModal) hideTextModal();
});

emojiModal.addEventListener('click', (e) => {
    if (e.target === emojiModal) hideEmojiModal();
});

gifModal.addEventListener('click', (e) => {
    if (e.target === gifModal) hideGifModal();
});

deleteAllModal.addEventListener('click', (e) => {
    if (e.target === deleteAllModal) hideDeleteAllModal();
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideTextModal();
        hideEmojiModal();
        hideGifModal();
        hideDeleteAllModal();
        closeExportModalHandler();
    }
});

// Export Modal Functions
function openExportModal() {
    // Stop animation if playing
    pauseAnimationIfPlaying();
    
    // Save current frame state before exporting
    saveCurrentFrame();
    
    // Update export tab states before showing modal
    updateExportTabStates();
    
    // Update color input to reflect current background selection
    updateCustomColorVisibility();
    
    // Update quality slider visibility based on selected format
    updateQualityVisibility();
    
    exportModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateExportPreview();
    updateDataOutput();
    
    // Initialize feather icons for the modal
    setTimeout(() => {
        feather.replace();
    }, 100);
}

function closeExportModalHandler() {
    stopAnimationPreview(); // Stop animation preview when closing modal
    exportModal.style.display = 'none';
    document.body.style.overflow = '';
}

function updateExportTabStates() {
    const animationTab = document.querySelector('[data-tab="animation"]');
    if (animationTab) {
        if (frames.length <= 1) {
            animationTab.classList.add('disabled');
            animationTab.style.opacity = '0.5';
            animationTab.style.cursor = 'not-allowed';
            
            // If animation tab is currently active, switch to image tab
            if (animationTab.classList.contains('active')) {
                switchExportTab('image');
            }
        } else {
            animationTab.classList.remove('disabled');
            animationTab.style.opacity = '1';
            animationTab.style.cursor = 'pointer';
        }
    }
}

function switchExportTab(tabName) {
    // Don't allow switching to animation tab if only one frame
    if (tabName === 'animation' && frames.length <= 1) {
        return;
    }
    
    // Remove active class from all tabs and contents
    exportTabs.forEach(tab => tab.classList.remove('active'));
    exportTabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}Tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
    
    // Update preview if on image tab
    if (tabName === 'image') {
        stopAnimationPreview(); // Stop animation when switching away
        updateExportPreview();
    } else if (tabName === 'animation') {
        startAnimationPreview(); // Start animation when switching to animation tab
    } else if (tabName === 'data') {
        stopAnimationPreview(); // Stop animation when switching away
        updateDataOutput();
    } else {
        stopAnimationPreview(); // Stop animation when switching to any other tab
    }
}

function updateExportPreview() {
    if (!exportPreviewCanvas) return;
    
    const ctx = exportPreviewCanvas.getContext('2d');
    const scale = parseInt(imageScale.value) || 4;
    const format = imageFormat.value;
    const bg = imageBg.value;
    const style = pixelStyle.value;
    const threshold = parseInt(opacityThreshold.value) || 0;
    
    // Calculate canvas dimensions
    const pixelSize = 8; // Preview pixel size
    const gapSize = 2;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    
    exportPreviewCanvas.width = totalSize;
    exportPreviewCanvas.height = totalSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, exportPreviewCanvas.width, exportPreviewCanvas.height);
    
    // Set background
    if (bg === 'black') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, exportPreviewCanvas.width, exportPreviewCanvas.height);
    } else if (bg === 'white') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, exportPreviewCanvas.width, exportPreviewCanvas.height);
    } else if (bg === 'custom') {
        ctx.fillStyle = customBgColor.value;
        ctx.fillRect(0, 0, exportPreviewCanvas.width, exportPreviewCanvas.height);
    }
    
    // Draw pixels
    const currentFrame = frames[currentFrameIndex];
    const pixelData = currentFrame ? currentFrame.pixels : pixelOpacities;
    
    // Draw pixels exactly like main grid
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const x = col * (pixelSize + gapSize);
            const y = row * (pixelSize + gapSize);
            
            const pixelId = `${row}-${col}`;
            const pixelValue = pixelData.get(pixelId) || 0;
            
            // Only draw pixels that meet threshold
            if (pixelValue >= threshold) {
                // Use same color logic as createExportCanvas: rgb(grayValue, grayValue, grayValue)
                const grayValue = pixelValue;
                ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                
                if (style === 'circle') {
                    ctx.beginPath();
                    ctx.arc(x + pixelSize/2, y + pixelSize/2, pixelSize/2, 0, 2 * Math.PI);
                    ctx.fill();
                } else if (style === 'square') {
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                } else { // rounded
                    const radius = pixelSize * 0.2;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(x, y, pixelSize, pixelSize, radius);
                    } else {
                        // Fallback for browsers without roundRect
                        ctx.rect(x, y, pixelSize, pixelSize);
                    }
                    ctx.fill();
                }
            }
        }
    }
    
    // Update preview info
    const actualScale = scale;
    const actualWidth = totalSize * actualScale / 4; // Since preview is at 1/4 scale
    const actualHeight = actualWidth;
    
    previewSize.textContent = `Size: ${actualWidth}×${actualHeight}`;
    previewFormat.textContent = `Format: ${format.toUpperCase()}`;
}

// Animation preview functionality
let animationPreviewInterval = null;
let animationPreviewCurrentFrame = 0;
let animationPreviewPlaying = false;

function startAnimationPreview() {
    if (!animationPreviewCanvas || frames.length <= 1) {
        if (animationPreviewInfo) {
            animationPreviewInfo.textContent = frames.length <= 1 ? 'Need multiple frames for animation' : 'Animation Preview';
        }
        return;
    }
    
    stopAnimationPreview(); // Stop any existing preview
    animationPreviewPlaying = true;
    updatePreviewPlayPauseButton();
    
    const ctx = animationPreviewCanvas.getContext('2d');
    const pixelSize = 8; // Same as image preview
    const gapSize = 2;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    
    animationPreviewCanvas.width = totalSize;
    animationPreviewCanvas.height = totalSize;
    animationPreviewCanvas.style.width = '200px';
    animationPreviewCanvas.style.height = '200px';
    
    
    // Render first frame and start animation loop
    renderAnimationFrame();
}

function stopAnimationPreview() {
    if (animationPreviewInterval) {
        clearTimeout(animationPreviewInterval);
        animationPreviewInterval = null;
    }
    animationPreviewCurrentFrame = 0;
    animationPreviewPlaying = false;
    updatePreviewPlayPauseButton();
}

function toggleAnimationPreview() {
    if (!animationPreviewCanvas || frames.length <= 1) return;
    
    if (animationPreviewPlaying) {
        pauseAnimationPreview();
    } else {
        resumeAnimationPreview();
    }
}

function pauseAnimationPreview() {
    if (animationPreviewInterval) {
        clearTimeout(animationPreviewInterval);
        animationPreviewInterval = null;
    }
    animationPreviewPlaying = false;
    updatePreviewPlayPauseButton();
}

function resumeAnimationPreview() {
    if (!animationPreviewCanvas || frames.length <= 1) return;
    
    // Clear any existing interval
    if (animationPreviewInterval) {
        clearTimeout(animationPreviewInterval);
        animationPreviewInterval = null;
    }
    
    animationPreviewPlaying = true;
    updatePreviewPlayPauseButton();
    
    // Use the same render logic as startAnimationPreview
    const ctx = animationPreviewCanvas.getContext('2d');
    const pixelSize = 8;
    const gapSize = 2;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    
    // Ensure canvas is properly sized (same as startAnimationPreview)
    animationPreviewCanvas.width = totalSize;
    animationPreviewCanvas.height = totalSize;
    animationPreviewCanvas.style.width = '200px';
    animationPreviewCanvas.style.height = '200px';
    
    // Render current frame immediately, then continue animation
    renderAnimationFrame();
}

function renderAnimationFrame() {
    if (!animationPreviewCanvas || frames.length <= 1 || !animationPreviewPlaying) return;
    
    const ctx = animationPreviewCanvas.getContext('2d');
    const pixelSize = 8;
    const gapSize = 2;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    const frame = frames[animationPreviewCurrentFrame];
    if (!frame) return;
    
    // Clear canvas with dark background like main grid
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, totalSize, totalSize);
    
    // Draw pixels exactly like main grid
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const x = col * (pixelSize + gapSize);
            const y = row * (pixelSize + gapSize);
            
            const pixelId = `${row}-${col}`;
            const pixelValue = frame.pixels.get(pixelId) || 0;
            
            // Draw background pixel (inactive state) like main grid
            ctx.fillStyle = '#000';
            const radius = pixelSize * 0.2; // 20% border-radius like main grid
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, pixelSize, pixelSize, radius);
            } else {
                ctx.rect(x, y, pixelSize, pixelSize);
            }
            ctx.fill();
            
            // Draw active pixel if it has grayscale value
            if (pixelValue > 0) {
                const grayValue = pixelValue;
                ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, y, pixelSize, pixelSize, radius);
                } else {
                    ctx.rect(x, y, pixelSize, pixelSize);
                }
                ctx.fill();
            }
        }
    }
    
    // Update info
    if (animationPreviewInfo) {
        animationPreviewInfo.textContent = `Frame ${animationPreviewCurrentFrame + 1}/${frames.length} (${frame.duration}ms)`;
    }
    
    // Store current frame's duration before moving to next frame
    const currentFrameDuration = frame.duration;
    
    // Move to next frame
    animationPreviewCurrentFrame = (animationPreviewCurrentFrame + 1) % frames.length;
    
    // Schedule next frame using the duration of the frame we just displayed
    if (frames.length > 1 && animationPreviewPlaying) {
        animationPreviewInterval = setTimeout(() => {
            renderAnimationFrame();
        }, currentFrameDuration);
    }
}

function updatePreviewPlayPauseButton() {
    if (!previewPlayPauseBtn) return;
    
    const icon = previewPlayPauseBtn.querySelector('.preview-btn-icon');
    if (!icon) return;
    
    if (animationPreviewPlaying) {
        icon.setAttribute('data-feather', 'pause');
    } else {
        icon.setAttribute('data-feather', 'play');
    }
    
    // Update feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function updateDataOutput() {
    if (!dataOutput) return;
    
    const format = dataFormat.value;
    let output = '';
    
    if (format === 'binary') {
        output = generateBinaryOutput();
    } else if (format === 'json') {
        const frameData = {
            version: "1.0",
            dimensions: { width: gridSize, height: gridSize },
            shape: shapePattern,
            frames: frames.map((frame, index) => ({
                index: index,
                duration: frame.duration || frameDuration,
                pixels: Array.from(frame.pixels || new Map()).map(([index, opacity]) => ({
                    index: index,
                    row: Math.floor(index / gridSize),
                    col: index % gridSize,
                    opacity: opacity
                }))
            }))
        };
        output = JSON.stringify(frameData, null, 2);
    } else if (format === 'array') {
        const currentFrame = frames[currentFrameIndex];
        const pixelData = currentFrame ? currentFrame.pixels : pixelOpacities;
        const pixelArray = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const pixelId = `${row}-${col}`;
                pixelArray.push(pixelData.get(pixelId) || 0);
            }
        }
        output = `const pixelData = [${pixelArray.join(', ')}];`;
    }
    
    dataOutput.value = output;
}

function createExportCanvas(scale = 4, backgroundType = 'transparent', customColor = '#000000', pixelStyleType = 'rounded', opacityThresholdValue = 0) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const pixelSize = 10 * scale;
    const gapSize = 2 * scale;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    
    canvas.width = totalSize;
    canvas.height = totalSize;
    
    // Set background
    if (backgroundType === 'black') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundType === 'white') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (backgroundType === 'custom') {
        ctx.fillStyle = customColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw pixels
    const currentFrame = frames[currentFrameIndex];
    const pixelData = currentFrame ? currentFrame.pixels : pixelOpacities;
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Always use shape pattern (export mode removed)
            const rowWidth = shapePattern[row] || 0;
            const startCol = Math.floor((gridSize - rowWidth) / 2);
            const endCol = startCol + rowWidth - 1;
            
            if (col < startCol || col > endCol) {
                continue; // Skip pixels outside shape pattern
            }
            
            const pixelId = `${row}-${col}`;
            const pixelValue = pixelData.get(pixelId) || 0;
            
            const x = col * (pixelSize + gapSize);
            const y = row * (pixelSize + gapSize);
            
            // Check if grayscale value meets threshold for rendering
            const shouldRender = pixelValue >= opacityThresholdValue;
            
            if (shouldRender) {
                // Render the pixel with its grayscale value
                const grayValue = pixelValue;
                ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                
                if (pixelStyleType === 'circle') {
                    ctx.beginPath();
                    ctx.arc(x + pixelSize/2, y + pixelSize/2, pixelSize/2, 0, 2 * Math.PI);
                    ctx.fill();
                } else if (pixelStyleType === 'square') {
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                } else { // rounded
                    const radius = pixelSize * 0.2;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(x, y, pixelSize, pixelSize, radius);
                    } else {
                        // Fallback for browsers without roundRect
                        ctx.rect(x, y, pixelSize, pixelSize);
                    }
                    ctx.fill();
                }
            }
        }
    }
    
    return canvas;
}

function downloadImage() {
    const scale = parseInt(imageScale.value) || 4;
    const format = imageFormat.value;
    const quality = parseInt(imageQualityValue.value) / 100;
    const bg = imageBg.value;
    const customColor = customBgColor.value;
    const style = pixelStyle.value;
    const threshold = parseInt(opacityThreshold.value) || 0;
    
    const canvas = createExportCanvas(scale, bg, customColor, style, threshold);
    
    let mimeType = 'image/png';
    let filename = 'glyph-matrix';
    
    if (format === 'jpg') {
        mimeType = 'image/jpeg';
        filename += '.jpg';
    } else if (format === 'webp') {
        mimeType = 'image/webp';
        filename += '.webp';
    } else if (format === 'png') {
        filename += '.png';
    } else if (format === 'svg') {
        downloadSVG();
        return;
    } else if (format === 'ico') {
        downloadICO();
        return;
    }
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showFeedback(`${format.toUpperCase()} image downloaded!`, 'success');
    }, mimeType, quality);
}

function downloadSVG() {
    const scale = parseInt(imageScale.value) || 4;
    const bg = imageBg.value;
    const customColor = customBgColor.value;
    const style = pixelStyle.value;
    const threshold = parseInt(opacityThreshold.value) || 0;
    
    const pixelSize = 10 * scale;
    const gapSize = 2 * scale;
    const totalSize = gridSize * (pixelSize + gapSize) - gapSize;
    
    let svg = `<svg width="${totalSize}" height="${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add background if not transparent
    if (bg === 'black') {
        svg += `<rect width="100%" height="100%" fill="#000"/>`;
    } else if (bg === 'white') {
        svg += `<rect width="100%" height="100%" fill="#fff"/>`;
    } else if (bg === 'custom') {
        svg += `<rect width="100%" height="100%" fill="${customColor}"/>`;
    }
    
    // Add pixels
    const currentFrame = frames[currentFrameIndex];
    const pixelData = currentFrame ? currentFrame.pixels : pixelOpacities;
    
    for (let row = 0; row < gridSize; row++) {
        const rowWidth = shapePattern[row] || 0;
        const startCol = Math.floor((gridSize - rowWidth) / 2);
        const endCol = startCol + rowWidth - 1;
        
        for (let col = startCol; col <= endCol; col++) {
            const pixelId = `${row}-${col}`;
            const opacity = pixelData.get(pixelId);
            
            // Convert opacity (0-255) to grayscale color (255 = white, 0 = black)
            // Default to 0 if pixel doesn't exist in the map
            const pixelValue = opacity || 0;
            
            // Check if grayscale value meets threshold for rendering
            const shouldRender = pixelValue >= threshold;
            
            if (shouldRender) {
                const grayValue = Math.round(pixelValue);
                const grayColor = `rgb(${grayValue},${grayValue},${grayValue})`;
                
                const x = col * (pixelSize + gapSize);
                const y = row * (pixelSize + gapSize);
                
                if (style === 'circle') {
                    svg += `<circle cx="${x + pixelSize/2}" cy="${y + pixelSize/2}" r="${pixelSize/2}" fill="${grayColor}"/>`;
                } else if (style === 'square') {
                    svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${grayColor}"/>`;
                } else { // rounded
                    const radius = pixelSize * 0.2;
                    svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" rx="${radius}" fill="${grayColor}"/>`;
                }
            }
        }
    }
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glyph-matrix.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFeedback('SVG image downloaded!', 'success');
}

async function downloadICO() {
    // ICO format requires multiple sizes - create a simple single-size ICO
    const canvas = createExportCanvas(2, imageBg.value, customBgColor.value, pixelStyle.value, parseInt(opacityThreshold.value) || 0);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glyph-matrix.ico';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showFeedback('ICO file downloaded! (Note: Basic format)', 'success');
    }, 'image/png');
}

async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showFeedback('Copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showFeedback('Copied to clipboard!', 'success');
        } catch (err) {
            showFeedback('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

function downloadDataFile() {
    const format = dataFormat.value;
    const content = dataOutput.value;
    let filename = 'glyph-matrix-data';
    let mimeType = 'text/plain';
    
    if (format === 'json') {
        filename += '.json';
        mimeType = 'application/json';
    } else if (format === 'array') {
        filename += '.js';
        mimeType = 'text/javascript';
    } else {
        filename += '.txt';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFeedback(`${format.toUpperCase()} file downloaded!`, 'success');
}

// Social media sharing functions
async function shareToTwitter() {
    const canvas = createExportCanvas(4, 'transparent', '#000000', 'rounded', parseInt(opacityThreshold.value) || 0);
    
    canvas.toBlob((blob) => {
        // For Twitter, we'll create a data URL and copy it
        const reader = new FileReader();
        reader.onload = function() {
            const text = encodeURIComponent('Check out my Glyph Matrix creation! Made with Glyph Matrix Editor');
            const url = `https://twitter.com/intent/tweet?text=${text}`;
            window.open(url, '_blank');
            showFeedback('Twitter opened! Upload your image manually.', 'success');
        };
        reader.readAsDataURL(blob);
    }, 'image/png');
}

async function shareToFacebook() {
    const text = encodeURIComponent('Check out my Glyph Matrix creation!');
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`;
    window.open(url, '_blank');
    showFeedback('Facebook opened! Upload your image manually.', 'success');
}

async function shareWithNativeAPI() {
    if (!navigator.share) {
        showFeedback('Native sharing not supported on this device', 'error');
        return;
    }
    
    const canvas = createExportCanvas(4, 'transparent', '#000000', 'rounded', parseInt(opacityThreshold.value) || 0);
    
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'glyph-matrix.png', { type: 'image/png' });
        
        try {
            await navigator.share({
                title: 'Glyph Matrix Creation',
                text: 'Check out my pixel art creation!',
                files: [file]
            });
            showFeedback('Shared successfully!', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                showFeedback('Sharing failed', 'error');
            }
        }
    }, 'image/png');
}

async function copyImageAsLink() {
    const canvas = createExportCanvas(4, 'transparent', '#000000', 'rounded', parseInt(opacityThreshold.value) || 0);
    
    canvas.toBlob(async (blob) => {
        try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            showFeedback('Image copied to clipboard!', 'success');
        } catch (err) {
            // Fallback: create data URL
            const reader = new FileReader();
            reader.onload = function() {
                copyTextToClipboard(reader.result);
            };
            reader.readAsDataURL(blob);
        }
    }, 'image/png');
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();
    
    initializeGrid();
    initializeAnimation();
    createImageCanvas();
    initCollapsibleControls();
    initFramesScrolling();
    initHeaderClose();
    
    // Initialize emoji functionality
    populateEmojiGrid('smileys');
    handleCategoryChange();
    handleEmojiSearch();

    // Setup slider pairs
    setupSliderPair(opacitySlider, opacityValue, updateOpacity, defaultValues.opacity);
    setupSliderPair(brightnessSlider, brightnessValue, updateBrightness, defaultValues.brightness);
    setupSliderPair(contrastSlider, contrastValue, updateContrast, defaultValues.contrast);
    setupSliderPair(fontSizeSlider, fontSizeValue, updateFontSize, defaultValues.fontSize);
    setupSliderPair(emojiSizeSlider, emojiSizeValue, updateEmojiSize, defaultValues.emojiSize);
    
    // Initialize export modal functionality
    initializeExportModal();
    
    updateOpacity(); // Initialize opacity preview
    updateHistoryButtons(); // Initialize history buttons
});

// Initialize export modal event listeners
function initializeExportModal() {
    // Tab switching
    exportTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchExportTab(tabName);
        });
    });
    
    // Image export controls
    imageFormat.addEventListener('change', () => {
        updateQualityVisibility();
        updateExportPreview();
    });
    
    imageScale.addEventListener('change', updateExportPreview);
    imageBg.addEventListener('change', () => {
        updateCustomColorVisibility();
        updateExportPreview();
    });
    customBgColor.addEventListener('change', () => {
        // Auto-switch to "Custom" if color doesn't match predefined options
        const colorValue = customBgColor.value.toLowerCase();
        
        if (colorValue !== '#000000' && colorValue !== '#ffffff' && colorValue !== '#808080') {
            imageBg.value = 'custom';
        }
        
        updateExportPreview();
    });
    pixelStyle.addEventListener('change', updateExportPreview);
    
    // Brightness threshold slider sync
    setupSliderPair(opacityThreshold, opacityThresholdValue, updateExportPreview, 0);
    
    // Quality slider sync
    setupSliderPair(imageQuality, imageQualityValue, updateExportPreview, 90);
    
    // Download buttons
    downloadImageBtn.addEventListener('click', downloadImage);
    downloadAnimationBtn.addEventListener('click', () => {
        const format = animationFormat.value;
        if (format === 'gif') {
            exportAsGif();
        } else if (format === 'webm') {
            exportAsWebM();
        }
    });
    
    // Data export
    dataFormat.addEventListener('change', updateDataOutput);
    copyDataBtn.addEventListener('click', () => {
        copyTextToClipboard(dataOutput.value);
    });
    downloadDataBtn.addEventListener('click', downloadDataFile);
    
    // Social sharing
    shareTwitter.addEventListener('click', shareToTwitter);
    shareFacebook.addEventListener('click', shareToFacebook);
    shareNative.addEventListener('click', shareWithNativeAPI);
    copyImageLink.addEventListener('click', copyImageAsLink);
    
    // Preview play/pause button
    if (previewPlayPauseBtn) {
        previewPlayPauseBtn.addEventListener('click', toggleAnimationPreview);
    }
    
    // Close modal when clicking outside
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            closeExportModalHandler();
        }
    });
}


function updateCustomColorVisibility() {
    const bg = imageBg.value;
    
    // Always show the color input
    customBgColor.style.display = 'inline-block';
    
    // Update color value based on selected background
    switch(bg) {
        case 'transparent':
            customBgColor.value = '#808080'; // Gray to represent transparency
            break;
        case 'black':
            customBgColor.value = '#000000';
            break;
        case 'white':
            customBgColor.value = '#ffffff';
            break;
        case 'custom':
            // Keep current custom color value
            break;
    }
}

function updateQualityVisibility() {
    const format = imageFormat.value;
    
    // Only show quality control for formats that support it (JPEG and WebP)
    if (format === 'jpg' || format === 'webp') {
        qualityGroup.style.display = 'block';
    } else {
        qualityGroup.style.display = 'none';
    }
}