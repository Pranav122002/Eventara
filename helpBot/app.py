from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertForQuestionAnswering, MarianMTModel, MarianTokenizer
from flask import Flask, request, jsonify
from transformers import AutoModelForTableQuestionAnswering, AutoTokenizer, pipeline
import pandas as pd




app = Flask(__name__)
CORS(app)

data = pd.read_csv(r"D:\Documents\Luap\Career\Projects\kimchi_Agnethon\kimchiCoders\helpBot\Agnel-hack-data.csv")

model_identifier = 'google/tapas-large-finetuned-sqa'

tapas_model = AutoModelForTableQuestionAnswering.from_pretrained(model_identifier)
tapas_tokenizer = AutoTokenizer.from_pretrained(model_identifier)
@app.route('/qa', methods=['POST'])
def question_answering():
    nlp = pipeline('table-question-answering', model=tapas_model, tokenizer=tapas_tokenizer)
    query = request.json.get('query')
    print(query)
    result = nlp({'table': data, 'query': query})
    answer = result['cells']

    return jsonify({'answer': answer})


if __name__ == '__main__':
     app.run(port=8000) 