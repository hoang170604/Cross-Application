import os
import ftfy

def process_directory(path):
    fixed_count = 0
    for root, dirs, files in os.walk(path):
        if 'node_modules' in root or '.expo' in root:
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.md')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    fixed_content = ftfy.fix_text(content)
                    
                    if fixed_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(fixed_content)
                        # Avoid print failing on weird console encodings
                        print(f"Fixed: {filepath}".encode('ascii', 'replace').decode('ascii'))
                        fixed_count += 1
                except Exception as e:
                    pass
    return fixed_count

if __name__ == "__main__":
    frontend_dir = r"d:\02_Workspace\do-an-dnt\Cross-Application\frontend\src"
    frontend_app_dir = r"d:\02_Workspace\do-an-dnt\Cross-Application\frontend\app"
    print("Fixing src with ftfy...")
    c1 = process_directory(frontend_dir)
    print("Fixing app with ftfy...")
    c2 = process_directory(frontend_app_dir)
    print(f"Total files fixed: {c1 + c2}")
