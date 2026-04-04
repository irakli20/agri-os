import sys

def find_unclosed_divs(filepath):
    stack = []
    with open(filepath, 'r') as f:
        for i, line in enumerate(f, 1):
            # Very naive search for <div and </div>
            # This won't handle comments or strings perfectly but usually good enough for JSX
            pos = 0
            while True:
                open_pos = line.find('<div', pos)
                close_pos = line.find('</div>', pos)
                
                if open_pos == -1 and close_pos == -1:
                    break
                
                if open_pos != -1 and (close_pos == -1 or open_pos < close_pos):
                    # Check if it's a real div tag (not <div-something)
                    # Check if it's self-closing <div />
                    next_char_idx = open_pos + 4
                    if next_char_idx < len(line) and line[next_char_idx] in [' ', '>', '\n', '\t']:
                        # Check for self-closing
                        closing_bracket = line.find('>', open_pos)
                        if closing_bracket != -1 and line[closing_bracket-1] == '/':
                             # Self-closing, ignore
                             pos = closing_bracket + 1
                             continue
                        stack.append(i)
                        pos = open_pos + 4
                    else:
                        pos = open_pos + 4
                else:
                    if stack:
                        stack.pop()
                    else:
                        print(f"Error: </div> at line {i} has no opening <div")
                    pos = close_pos + 6
                    
    print(f"Unclosed <div tags started at lines: {stack}")

if __name__ == "__main__":
    find_unclosed_divs(sys.argv[1])
