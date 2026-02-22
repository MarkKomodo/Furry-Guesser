import json
import re
import sys

def clean_text(text):
    # Removes numbers, dots, dashes, and stars from the start
    return re.sub(r'^[\d\.\-\*\s]+', '', text).strip()

def get_indent(line):
    # Counts leading spaces/tabs
    return len(line) - len(line.lstrip())

def parse_to_tree(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = [l for l in f.readlines() if l.strip()]
    except FileNotFoundError:
        print(f"❌ Error: {filename} not found.")
        return None

    if not lines:
        return None

    stack = []
    root = None

    for line in lines:
        indent = get_indent(line)
        text = clean_text(line)
        new_node = {"data": text, "yes": None, "no": None}

        if not stack:
            root = new_node
            stack.append((indent, new_node))
            continue

        # Navigate the stack to find the parent
        while stack and stack[-1][0] > indent:
            stack.pop()

        if not stack:
            continue

        last_indent, last_node = stack[-1]

        if indent > last_indent:
            # CHILD (YES)
            last_node["yes"] = new_node
        else:
            # SIBLING (NO)
            # We need to find the node at the same level to attach the "NO" to
            last_node["no"] = new_node
            stack.pop()

        stack.append((indent, new_node))

    return root

# Main execution
tree_data = parse_to_tree('questions.txt')

if tree_data:
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(tree_data, f, indent=4)
    print("✅ Success! data.json updated.")
else:
    print("❌ Error: Tree data was empty. Check questions.txt format.")
    sys.exit(1) # Force the GitHub Action to fail so you know something is wrong
