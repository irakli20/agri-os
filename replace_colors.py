import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply semantic color mappings
    new_content = re.sub(r'emerald-[1-9]00', 'primary', content)
    new_content = re.sub(r'cyan-[1-9]00', 'secondary', new_content)
    new_content = re.sub(r'slate-800', 'muted', new_content)
    new_content = re.sub(r'slate-900', 'card', new_content)
    new_content = re.sub(r'slate-[89]50', 'background', new_content)
    
    # Specific edge cases that were left over
    new_content = re.sub(r'text-primary/80', 'text-primary/90', new_content)

    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith(('.tsx', '.ts')) and not 'node_modules' in root and not '.next' in root:
            process_file(os.path.join(root, file))
