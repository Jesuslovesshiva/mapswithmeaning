import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk

def extract_locations_from_content(content):
    # Tokenize the content into sentences
    sentences = sent_tokenize(content)
    # Initialize a list to store extracted locations
    locations = []
    # Iterate through each sentence
    for sentence in sentences:
        # Tokenize words in the sentence
        words = word_tokenize(sentence)
        # Part-of-speech tagging to identify named entities
        tagged_words = pos_tag(words)
        # Perform named entity recognition
        named_entities = ne_chunk(tagged_words)
        # Extract locations from named entities
        for entity in named_entities:
            if isinstance(entity, nltk.tree.Tree) and entity.label() == 'GPE':
                # If the entity is a geopolitical entity (GPE), add it to the list of locations
                locations.append(' '.join([word for word, tag in entity.leaves()]))
    return locations

# Example usage
content = "Hernan Cortez sailed from Cuba to Mexico in 1519."
locations = extract_locations_from_content(content)
print(locations)  # Output: ['Cuba', 'Mexico']
