// The structure of our knowledge tree
class Node {
    constructor(data, yes = null, no = null) {
        this.data = data; // The question OR the final guess
        this.yes = yes;   // Pointer to next node if answer is Yes
        this.no = no;    // Pointer to next node if answer is No
    }

    // A leaf node has no children (it's a guess, not a question)
    isLeaf() {
        return this.yes === null && this.no === null;
    }
}

// 1. YOUR STARTING QUESTION BANK
// You can expand this initial "Seed" tree with your data!
let root = new Node("Does your character have fur?", 
    new Node("Is it a canine?", 
        new Node("Wolf"), 
        new Node("Dutch Angel Dragon")
    ), 
    new Node("Does it have scales?", 
        new Node("Dragon"), 
        new Node("Protogen")
    )
);

let currentNode = root;
let parentNode = null;
let lastChoice = null; // Track if we went 'yes' or 'no' to get here

const questionEl = document.getElementById('question-text');
const gameUI = document.getElementById('game-ui');
const learningUI = document.getElementById('learning-ui');

// 2. CORE GAME LOGIC
function updateUI() {
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
            // Game lost - Trigger learning mode
            showLearningUI();
        }
    } else {
        // Move deeper into the tree
        parentNode = currentNode;
        lastChoice = isYes;
        currentNode = isYes ? currentNode.yes : currentNode.no;
        updateUI();
    }
}

// 3. THE LEARNING SYSTEM
function showLearningUI() {
    gameUI.classList.add('hidden');
    learningUI.classList.remove('hidden');
}

function submitNewKnowledge() {
    const newName = document.getElementById('new-character-name').value;
    const newQuest = document.getElementById('new-question').value;

    if (!newName || !newQuest) return alert("Please fill both fields!");

    // Math/Logic: Create a new branch
    // The old guess becomes the 'No' and the new character becomes the 'Yes'
    const oldGuess = currentNode.data;
    const newNode = new Node(newQuest, new Node(newName), new Node(oldGuess));

    // Attach this new branch back to the tree
    if (lastChoice === true) parentNode.yes = newNode;
    else parentNode.no = newNode;

    alert(`Thanks! I now know about ${newName}.`);
    initGame();
}

// 4. UTILITIES
function initGame() {
    currentNode = root;
    parentNode = null;
    gameUI.classList.remove('hidden');
    learningUI.classList.add('hidden');
    document.getElementById('action-buttons').classList.remove('hidden');
    document.getElementById('new-character-name').value = "";
    document.getElementById('new-question').value = "";
    updateUI();
}

// Export function to save your progress to a file
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(root));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "furry_tree_update.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Start the game on load
initGame();
