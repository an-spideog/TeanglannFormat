import requests
import string
import re
import json
from bs4 import BeautifulSoup as bs
import bs4
alphabet = list(string.ascii_lowercase)
start_URL = "https://www.teanglann.ie/en/fgb/"

word_list = []
dictionary = {}
alphabet = ['a'] ## DEBUG

for letter in alphabet:
    list_url = start_URL + "_" + letter
    raw = requests.get(list_url)
    soup = bs(raw.text, "html.parser")
    span_list = soup.find_all('span', class_='abcItem')
    for i in span_list:
        word_list.append(i.a.text)
        print(i.a.text)

word_list = ['cur'] ## DEBUG

fgb_key = {
    'm.': 'noun masculine',
    'f.': 'noun feminine',
    'v.t.': 'verb transitive',
    'v.i.': 'verb intransitive',
    'adv.': 'adverb',
    'v.t. & i.': 'verb transitive intransitive',
    'a1. ': 'adjective 1st',
    'a2. ': 'adjective 2nd',
    'a3. ': 'adjective 3rd',
    'a.': 'adjective',
    'pron.': 'pronoun',
    'interr. pron.': 'interrogative pronoun'

}

for word in word_list:
    page_URL = start_URL + word
    raw = requests.get(page_URL)
    soup = bs(raw.text, "html.parser")
    try:
        entry_list = soup.find('div', class_="dir obverse exacts").find_all('div', class_="fgb entry")
    except:
        continue
    for entry in entry_list:
        if "=" not in entry.text:
            new_word = {
                "source": "FGB",
                "definitions": [],
                "variants": [],
                "type": "",
                "examples": []
            }
            title = entry.find('span', class_='fgb title').text

            # Find VN Definition
            if (g_list := entry.find_all('span', class_='fgb g')) is not None: 
                for g in g_list: # change to find_all, currently selecting gender marker
                    if g.text == "vn. of  ":
                        new_word['definitions'].append("Verbal noun of " + g.next_sibling.text)
            # Find Definitions
            if entry.find('span', class_='fgb trans'): 
                for definition in entry.find_all('span', class_='fgb trans'):
                    definition_text = definition.text
                    if isinstance(definition.previous_sibling.previous_sibling, bs4.element.Tag):
                        if " ".join(definition.previous_sibling.previous_sibling['class']) == 'fgb o':
                            definition_text = "(" + definition.previous_sibling.previous_sibling.text + ") " + definition.text
                    new_word["definitions"].append(definition_text)
                    
                    # Find Examples for Each Definition
                    next_example = definition.next_sibling
                    # print(type(next_example))
                    local_examples = []
                    next_round = ""
                    while True:
                        if isinstance(next_example, bs4.element.Tag):
                            if " ".join(next_example['class']) == 'fgb example':

                                local_examples.append(next_round + next_example.text)
                                next_round = ""
                                # print(next_example.text)
                                next_example = next_example.next_sibling
                            elif " ".join(next_example['class']) == 'fgb trans':
                                break
                            elif " ".join(next_example['class']) == 'fgb clickable':
                                break
                            elif " ".join(next_example['class']) == 'fgb l' or " ".join(next_example['class']) == 'fgb o':
                                next_round = "(" + next_example.text + ")"
                                print(hello)
                            else:
                                break
                        else:
                            break
                    # print('break')
                    new_word['examples'].append(local_examples)


            if entry.find('span', class_='fgb g'): # Find Type
                type_ = entry.find_all('span', class_='fgb g')[0].text
                # print(type_ + '|')
                new_word['type'] = fgb_key.get(type_)

            if entry.find('span', class_='fgb example'): # Find Example
                examples = entry.find_all('span', class_='fgb example')
                for example in examples:
                    new_word['examples'].append(re.sub('~', title, example.text))

            number = 0
            while True:
                new_title = title + str(number)
                if not dictionary.get(new_title):
                    dictionary.update({new_title: new_word})
                    break
                number += 1
            # TODO: Add details like dictionary, form of word, examples etc to the entry
# print(dictionary)
json_dictionary = json.dumps(dictionary, indent=4)
with open("new_dictionary.json", "w") as f:
            f.write(json_dictionary)

