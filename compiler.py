import json
import re

def parse_obsidian_to_tree(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()

    def get_indent(line):
        return len(line) - len(line.lstrip())

    def build_tree(index, indent):
        if index >= len(lines):
            return None, index

        line = lines[index].strip()
        # Clean up numbers/bullets: "1.2. Is it a dog?" -> "Is it a dog?"
        clean_text = re.sub(r'^[\d\.\-\*\s]+', '', line)
        
        node = {"data": clean_text, "yes": None, "no": None}
        next_idx = index + 1

        # Check if next line is a CHILD (deeper indent)
        if next_idx < len(lines) and get_indent(lines[next_idx]) > indent:
            node["yes"], next_idx = build_tree(next_idx, get_indent(lines[next_idx]))

        # Check if next line is a SIBLING (same indent)
        if next_idx < len(lines) and get_indent(lines[next_idx]) == indent:
            node["no"], next_idx = build_tree(next_idx, indent)

        return node, next_idx

    tree, _ = build_tree(0, get_indent(lines[0]))
    return tree

# Generate the JSON file
tree_data = parse_obsidian_to_tree('questions.txt')
with open('data.json', 'w') as f:
    json.dump(tree_data, f, indent=4)

print("✅ Success! data.json has been created.")
