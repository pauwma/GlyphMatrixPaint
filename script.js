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
const copyBtn = document.getElementById('copyBtn');
const copyFeedback = document.getElementById('copyFeedback');
const activeCount = document.getElementById('activeCount');
const totalPixelsCount = document.getElementById('totalPixels');
const emojiGrid = document.getElementById('emojiGrid');
const emojiSearch = document.getElementById('emojiSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const selectedEmojiDisplay = document.querySelector('.selected-emoji-display');
const downloadBtn = document.getElementById('downloadBtn');
const exportGifBtn = document.getElementById('exportGifBtn');

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
const closeTextModal = document.getElementById('closeTextModal');
const closeEmojiModal = document.getElementById('closeEmojiModal');
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
let dragThreshold = 10; // pixels
let dragDelay = 150; // milliseconds

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
        
        showFeedback(`Frame ${draggedFrameIndex + 1} moved to position ${targetFrameIndex + 1}`, 'success');
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
    
    // Don't prevent default here - let normal tap behavior work initially
}

function handleFrameTouchMove(e) {
    if (touchDraggedFrameIndex === null) return;
    
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosition.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Check if we should start dragging
    if (!isDraggingFrame && (distance > dragThreshold || currentTime - touchStartTime > dragDelay)) {
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
        
        showFeedback('Animation stopped', 'success');
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
        showBinaryFeedback('Raw data applied successfully!', 'success');
        
        // Hide binary import controls after applying
        binaryImportControls.style.display = 'none';
        binaryBtn.classList.remove('active');
        
        // Clear the input
        binaryInput.value = '';
        
    } catch (error) {
        showBinaryFeedback('Invalid raw data format', 'error');
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
        showFeedback('Raw data copied to clipboard!', 'success');
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
            showFeedback('Raw data copied to clipboard!', 'success');
        } catch (err) {
            showFeedback('Failed to copy raw data', 'error');
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
    textInput.focus();
}

function hideTextModal() {
    textModal.style.display = 'none';
    textInput.value = '';
}

function showEmojiModal() {
    emojiModal.style.display = 'flex';
}

function hideEmojiModal() {
    emojiModal.style.display = 'none';
    // DON'T reset emoji selection and category - keep user's current state
    // This preserves the selected emoji and category for next time
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

// Header toggle functionality
function initHeaderToggle() {
    const headerToggle = document.getElementById('headerToggle');
    const header = document.querySelector('.header');
    
    headerToggle.addEventListener('click', () => {
        header.classList.toggle('collapsed');
        
        // Update the feather icon after the toggle
        setTimeout(() => {
            feather.replace();
        }, 50);
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
copyBtn.addEventListener('click', copyToClipboard);
binaryBtn.addEventListener('click', toggleBinaryImport);
downloadBtn.addEventListener('click', downloadAsImage);
exportGifBtn.addEventListener('click', exportAsGif);

// Animation event listeners
newFrameBtn.addEventListener('click', createNewFrame);
duplicateFrameBtn.addEventListener('click', duplicateCurrentFrame);
deleteFrameBtn.addEventListener('click', deleteCurrentFrame);
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

// History event listeners
if (undoBtn) undoBtn.addEventListener('click', undo);
if (redoBtn) redoBtn.addEventListener('click', redo);

// Binary input event listener
if (applyBinaryBtn) applyBinaryBtn.addEventListener('click', applyBinaryData);

// Modal event listeners
closeTextModal.addEventListener('click', hideTextModal);
closeEmojiModal.addEventListener('click', hideEmojiModal);
generateTextBtn.addEventListener('click', generateTextPixelArt);
generateEmojiBtn.addEventListener('click', generateEmojiPixelArt);

// Close modals when clicking outside
textModal.addEventListener('click', (e) => {
    if (e.target === textModal) hideTextModal();
});

emojiModal.addEventListener('click', (e) => {
    if (e.target === emojiModal) hideEmojiModal();
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideTextModal();
        hideEmojiModal();
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();
    
    initializeGrid();
    initializeAnimation();
    createImageCanvas();
    initCollapsibleControls();
    initFramesScrolling();
    initHeaderToggle();
    
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
    
    updateOpacity(); // Initialize opacity preview
    updateHistoryButtons(); // Initialize history buttons
});