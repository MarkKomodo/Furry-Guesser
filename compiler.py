import json
import re

def clean_text(text):
    # Removes numbers, dots, dashes, and stars from the start
    return re.sub(r'^[\d\.\-\*\s]+', '', text).strip()

def get_indent(line):
    # Counts leading spaces/tabs
    return len(line) - len(line.lstrip())

def parse_to_tree(filename):
    with open(filename, 'r') as f:
        # Filter out empty lines
        lines = [l for l in f.readlines() if l.strip()]

    if not lines:
        return None

    # Stack to keep track of nodes at different indentation levels
    stack = []
    root = None

    for line in lines:
        indent = get_indent(line)
        text = clean_text(line)
        new_node = {"data": text, "yes": None, "no": None}

        # If the stack is empty, this is our root
        if not stack:
            root = new_node
            stack.append((indent, new_node))
            continue

        # Find the parent or sibling
        # Pop from stack until we find a node with less or equal indent
        while stack and stack[-1][0] > indent:
            stack.pop()

        if not stack:
            # This shouldn't happen with proper indentation
            continue

        last_indent, last_node = stack[-1]

        if indent > last_indent:
            # This is a CHILD (The "YES" path)
            last_node["yes"] = new_node
        else:
            # This is a SIBLING (The "NO" path)
            # Find the actual last node at this level to attach to
            last_node["no"] = new_node
            stack.pop() # Remove the old sibling to make room for the new one

        stack.append((indent, new_node))

    return root

# Main execution
try:
    tree_data = parse_to_tree('questions.txt')
    with open('data.json', 'w') as f:
        json.dump(tree_data, f, indent=4)
    print("✅ Success! data.json created with an iterative loop.")
except Exception as e:
    print(f"❌ Error: {e}")
