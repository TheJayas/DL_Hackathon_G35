import os
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.pipelines import TextGenerationPipeline
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from table_extraction import process_pdf
from extract_table import extract_csv
from cloudinary_util import upload_image
from combine_csv import combine
from mode_init import load_llama3_pipeline


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

@app.route('/processImage', methods=['POST'])
def process_image_route():
    if 'image' not in request.files:
        return 'No file part', 400
    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400
    save_path = os.path.join('uploads', file.filename)
    file.save(save_path)
    extract_csv(save_path)
    detected_table_url = upload_image('detected_table.jpg')
    cropped_table_url = upload_image('cropped_table.jpg')
    table_structure_url = upload_image('table_structure.jpg')
    with open('output.csv', 'r') as file:
        csv_content = file.read()
    return jsonify({"message": "Image processed successfully", "csv_contents": [csv_content], 
                    "detected_table_urls": [detected_table_url], 
                    "cropped_table_urls": [cropped_table_url], 
                    "table_structure_urls": [table_structure_url]}), 200

    
@app.route('/processPdf', methods=['POST'])
def process_pdf_route():
    # data = request.get_json()
    # pdf_path = data.get('pdf_path')
    if 'pdf' not in request.files:
        return 'No file part', 400
    file = request.files['pdf']
    if file.filename == '':
        return 'No selected file', 400
    pdf_path = os.path.join('uploads', file.filename)
    file.save(pdf_path)

    if not pdf_path or not os.path.exists(pdf_path):
        return jsonify({"error": "Invalid PDF path"}), 400

    page_num, num_table = process_pdf(pdf_path)
    total_tables = combine()
    detected_table_urls = []
    for i in range(page_num):
        detected_table_url = upload_image(f"detected_table_{i}.jpg")
        detected_table_urls.append(detected_table_url)
    cropped_table_urls = []
    table_structure_urls = []
    for i in range(num_table):
        cropped_table_url = upload_image(f"cropped_table_{i}.jpg")
        table_structure_url = upload_image(f"table_structure_{i}.jpg")
        cropped_table_urls.append(cropped_table_url)
        table_structure_urls.append(table_structure_url)
    csv_contents = []
    for i in range(total_tables):
        with open(f"combined_group_{i+1}.csv", 'r') as file:
            csv_content = file.read()
            csv_contents.append(csv_content)
    return jsonify({"message": "PDF processed successfully", "csv_contents": csv_contents, 
                    "detected_table_urls": detected_table_urls, 
                    "cropped_table_urls": cropped_table_urls, 
                    "table_structure_urls": table_structure_urls}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Server starting on port {port}...")
    app.run(host="0.0.0.0", port=port)
    print("Server exiting.")