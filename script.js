// Global variables
const shapePattern = [7,11,15,17,19,21,21,23,23,25,25,25,25,25,25,25,23,23,21,21,19,17,15,11,7];
const gridSize = 25;
let pixels = [];
let pixelOpacities = new Map();
let brushMode = true;
let isDrawing = false;
let drawingState = null;
let totalActivePixels = 0;
let uploadedImage = null;
let imageCanvas = null;
let imageContext = null;
let brushOpacity = 255;

// History management
let history = [];
let historyIndex = -1;
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
const binaryOutput = document.getElementById('binaryOutput');
const activeCount = document.getElementById('activeCount');
const totalPixelsCount = document.getElementById('totalPixels');
const emojiGrid = document.getElementById('emojiGrid');
const emojiSearch = document.getElementById('emojiSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const selectedEmojiDisplay = document.querySelector('.selected-emoji-display');
const downloadBtn = document.getElementById('downloadBtn');

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
const fontWeight = document.getElementById('fontWeight');
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

// History management functions
function saveToHistory() {
    // Remove any future history if we're not at the end
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    // Add current state to history
    const currentState = new Map(pixelOpacities);
    history.push(currentState);
    
    // Limit history size
    if (history.length > maxHistorySize) {
        history.shift();
    } else {
        historyIndex++;
    }
    
    updateHistoryButtons();
}

function loadFromHistory(index) {
    if (index >= 0 && index < history.length) {
        pixelOpacities = new Map(history[index]);
        historyIndex = index;
        updateDisplay();
        updateHistoryButtons();
    }
}

function undo() {
    if (historyIndex > 0) {
        loadFromHistory(historyIndex - 1);
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        loadFromHistory(historyIndex + 1);
    }
}

function updateHistoryButtons() {
    if (undoBtn) {
        undoBtn.disabled = historyIndex <= 0;
        undoBtn.style.opacity = historyIndex <= 0 ? '0.5' : '1';
    }
    if (redoBtn) {
        redoBtn.disabled = historyIndex >= history.length - 1;
        redoBtn.style.opacity = historyIndex >= history.length - 1 ? '0.5' : '1';
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
    
    // Initialize history with empty state
    history = [];
    historyIndex = -1;
    saveToHistory();
    
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
    if (!isDrawing) return;
    
    e.preventDefault();
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
    brushMode = !brushMode;
    
    if (brushMode) {
        brushToggle.classList.add('active');
    } else {
        brushToggle.classList.remove('active');
    }
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
    pixelOpacities.clear();
    saveToHistory();
    updateDisplay();
}

function reverse() {
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
    const binary = generateBinaryOutput();
    binaryOutput.textContent = binary;
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
    }, 3000);
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
    
    const fontSize = parseInt(fontSizeSlider.value);
    const fontWeightValue = fontWeight.value;
    
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 25;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 25, 25);
    
    // Set font
    ctx.font = `${fontWeightValue} ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text
    ctx.fillText(text, 12.5, 12.5);
    
    // Process the canvas as an image (will be inverted)
    processCanvasAsImage(canvas);
    hideTextModal();
}

function generateEmojiPixelArt() {
    if (!selectedEmoji) return;
    
    const fontSize = parseInt(emojiSizeSlider.value);
    
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 25;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas to black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 25, 25);
    
    // Set font for emoji
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw emoji - adjusted vertical position to center better
    ctx.fillText(selectedEmoji, 12.5, 13.5);
    
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
                
                // Always use grayscale logic
                const opacity = Math.round(brightness);
                if (opacity > 0) {
                    pixelOpacities.set(pixelId, opacity);
                }
            }
        }
    }

    saveToHistory();
    updateDisplay();
    
    // DON'T hide import controls - keep them visible for editing
    // DON'T clear uploadedImage - keep it for re-applying with different settings
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
    
    // Update selected emoji
    selectedEmoji = emoji;
    selectedEmojiDisplay.textContent = emoji;
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
    createImageCanvas();
    initCollapsibleControls();
    
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