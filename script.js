// 1. THE ENGINE: The structure of our knowledge
class Node {
    constructor(data, yes = null, no = null) {
        this.data = data;
        this.yes = yes;
        this.no = no;
    }
    isLeaf() {
        return this.yes === null && this.no === null;
    }
}

// 2. THE DATA LOADER: This replaces the manual 'root = new Node...'
let root = null;
let currentNode = root;
let parentNode = null;
let lastChoice = null;

const questionEl = document.getElementById('question-text');
const gameUI = document.getElementById('game-ui');
const learningUI = document.getElementById('learning-ui');

async function loadGameData() {
    try {
        // We fetch the JSON created by your Python script
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Convert the flat JSON objects back into "Node" classes
        root = convertToNodes(data);
        initGame();
    } catch (err) {
        questionEl.innerText = "Error: Please run compiler.py to generate data.json first!";
        console.error("Failed to load question bank:", err);
    }
}

function convertToNodes(obj) {
    if (!obj) return null;
    return new Node(
        obj.data,
        convertToNodes(obj.yes),
        convertToNodes(obj.no)
    );
}

// 3. THE GAME LOGIC
function updateUI() {
    if (!currentNode) return;
    if (currentNode.isLeaf()) {
        questionEl.innerHTML = `Is your character a <strong>${currentNode.data}</strong>?`;
    } else {
        questionEl.innerText = currentNode.data;
    }
}

function handleInput(isYes) {
    if (currentNode.isLeaf()) {
        if (isYes) {
            questionEl.innerText = "✨ I got it! The fandom is small, but I am wise.";
            document.getElementById('action-buttons').classList.add('hidden');
        } else {
            showLearningUI();
        }
    } else {
        parentNode = currentNode;
        lastChoice = isYes;
        currentNode = isYes ? currentNode.yes : currentNode.no;
        updateUI();
    }
}

function showLearningUI() {
    gameUI.classList.add('hidden');
    learningUI.classList.remove('hidden');
}

function submitNewKnowledge() {
    const newName = document.getElementById('new-character-name').value;
    const newQuest = document.getElementById('new-question').value;

    if (!newName || !newQuest) return alert("Please fill both fields!");

    const oldGuess = currentNode.data;
    const newNode = new Node(newQuest, new Node(newName), new Node(oldGuess));

    if (lastChoice === true) parentNode.yes = newNode;
    else parentNode.no = newNode;

    alert(`Thanks! I now know about ${newName}.`);
    initGame();
}

function initGame() {
    currentNode = root;
    parentNode = null;
    gameUI.classList.remove('hidden');
    learningUI.classList.add('hidden');
    document.getElementById('action-buttons').classList.remove('hidden');
    updateUI();
}

// Start the loading process
loadGameData();
