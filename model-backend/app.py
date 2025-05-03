import os
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.pipelines import TextGenerationPipeline
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys

CSV_DIR = "extracted_tables"  
MODEL_NAME = "meta-llama/Llama-3.2-1B"  

def combine_csv_tables(csv_dir, max_files=1):
    combined_text = ""
    count = 0
    for filename in os.listdir(csv_dir):
        if filename.endswith(".csv"):
            if count >= max_files:
                break
            path = os.path.join(csv_dir, filename)
            try:
                df = pd.read_csv(path, on_bad_lines='skip') 
                combined_text += f"\nTable from {filename}:\n"
                combined_text += df.to_string(index=False)
                combined_text += "\n\n"
                count += 1
            except Exception as e:
                print(f"Skipping {filename} due to error: {e}")
    return combined_text

def load_llama3_pipeline():
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME,token=os.getenv("HF_TOKEN"))
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        token=os.getenv("HF_TOKEN"),
        torch_dtype=torch.float16,
        device_map="auto"
    )
    return TextGenerationPipeline(model=model, tokenizer=tokenizer, max_new_tokens=512)


def ask_llama3_about_tables(llm_pipeline, table_text, user_query):
    prompt = f"""You are a helpful assistant. Below is data extracted from tables:

{table_text}

Answer the following question based on the above data:
Question: {user_query}
Answer:"""
    print("Prompt sent to model:\n", prompt)
    result = llm_pipeline(prompt)[0]["generated_text"]
    return result[len(prompt):].strip()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins" : "*"}})

llm = load_llama3_pipeline()

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_query = data.get('query')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    
    table_text = combine_csv_tables(CSV_DIR, max_files=1)
    answer = ask_llama3_about_tables(llm, table_text, user_query)

    return jsonify({"answer": answer}), 200

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    print(f"Server starting on port {port}...")
    app.run(host="0.0.0.0", port=port)
    print("Server exiting.")