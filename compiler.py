import json

def build_starter_tree(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        # Get all non-empty lines
        lines = [line.strip() for line in f.readlines() if line.strip()]

    if not lines:
        return {"data": "A Mystery Creature", "yes": None, "no": None}

    # If there's no indentation, we start with the very first character/species
    # The game will expand from this single point as people play.
    root = {
        "data": lines[0], 
        "yes": None, 
        "no": None
    }
    return root

# Main execution
starter_tree = build_starter_tree('questions.txt')

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(starter_tree, f, indent=4)

print("✅ Starter data.json created! The game will now learn from the players.")
