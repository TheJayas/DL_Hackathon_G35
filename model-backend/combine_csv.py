import os
import pandas as pd
from mode_init import load_llama3_pipeline  


llm = load_llama3_pipeline()

CSV_DIR = "./extracted_tables"
output_dir = "./grouped_csvs"

os.makedirs(output_dir, exist_ok=True)

def ask_structure(file_path):
    # Try reading the raw first few lines of the CSV directly
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = [next(f) for _ in range(5)]
            preview = ''.join(lines)
    except Exception as e:
        print(f"❌ Could not read preview from {file_path}: {e}")
        return 'Y'  # Safe fallback

    prompt = f"""
You are a data processing assistant. The following is a preview of a CSV file (first few lines):

{preview}

Question: Does this CSV include a header row defining its field Name/columns and not any data?
Answer with exactly one character strictly:
- 'Yes' if it has a header row (field names / Columns present) like: Name,Age,Department,Salary
- 'No' if it lacks a header row and all rows are data.
ONLY respond with 'Yes' or 'No'.
"""

    response = llm(prompt, max_new_tokens=4, do_sample=False)[0]['generated_text'].strip()
    print(f"LLM raw response: {response}")
    return response[0].upper()



def combine(input_dir=CSV_DIR, output_dir=output_dir):
    groups = []  # list of (base_columns, dataframe)

    for filename in sorted(os.listdir(input_dir)):
        if not filename.endswith('.csv'):
            continue
        path = os.path.join(input_dir, filename)

        # Skip empty files
        if os.path.getsize(path) == 0:
            print(f"⚠️ Skipping empty file: {filename}")
            continue

        print(f"→ Processing {filename}")

        try:

            flag = ask_structure(path)
            print(f"  LLM says: {flag}")
            print(f"  LLM says: {'HEADER' if flag == 'Y' else 'NO HEADER'}")

            if flag == '0':
                # Read normally, drop any unnamed index columns
                df = pd.read_csv(path, on_bad_lines='skip')
                if df.empty:
                    print(f"⚠️ Skipping empty dataframe from file: {filename}")
                    continue
                df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
                base_cols = list(df.columns)
                groups.append((base_cols, df))

            else:  # flag == '1'
                df = pd.read_csv(path, header=None, on_bad_lines='skip')
                if df.empty:
                    print(f"⚠️ Skipping empty dataframe from file: {filename}")
                    continue

                if not groups:
                    # No previous header to inherit — assign default
                    default_columns = [f"Column{i+1}" for i in range(df.shape[1])]
                    df.columns = default_columns
                    groups.append((default_columns, df))
                    print("⚠️ No previous group — created new group with default headers.")
                else:
                    base_cols, last_df = groups[-1]
                    df.columns = base_cols
                    groups[-1] = (base_cols, pd.concat([last_df, df], ignore_index=True))

        except pd.errors.EmptyDataError:
            print(f"❌ pandas EmptyDataError — skipping file: {filename}")
        except Exception as e:
            print(f"❌ Unexpected error while processing {filename}: {e}")

    # Write out each group
    for idx, (cols, df) in enumerate(groups, start=1):
        out_path = os.path.join(output_dir, f"combined_group_{idx}.csv")
        df.to_csv(out_path, index=False)
        print(f"✅ Group {idx}: {len(df)} rows → {out_path}")
