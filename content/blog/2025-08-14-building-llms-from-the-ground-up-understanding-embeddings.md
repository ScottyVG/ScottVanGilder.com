---
title: "Building LLMs from the Ground Up: Understanding Embeddings"
excerpt: "Dive into the foundational concepts of Large Language Models by exploring how embeddings work. From converting text to vectors to understanding semantic relationships, learn the core building blocks that make modern AI language models possible."
date: "2025-08-14"
readTime: "8 minutes"
tags: ["Machine Learning", "AI", "LLM", "Embeddings", "Neural Networks", "Python"]
author: "Scott Van Gilder"

---

## The Foundation of Language Understanding

Large Language Models (LLMs) like GPT-4, Claude, and others have revolutionized how we interact with AI. But beneath their impressive conversational abilities lies a fundamental concept that makes it all possible: **embeddings**. Understanding embeddings is crucial to grasping how LLMs work, and it's the perfect starting point for anyone looking to build their own language model from scratch.

## What Are Embeddings?

At its core, an embedding is a way to represent words, sentences, or even entire documents as vectors of numbers. Think of it as translating human language into a mathematical form that computers can understand and manipulate.

```python
# A simple example - the word "king" might become:
king_embedding = [0.2, -0.1, 0.8, 0.3, -0.4, 0.7, ...]
```

But embeddings aren't just random numbers. They're carefully learned representations where similar words end up close together in this mathematical space, and relationships between words are preserved.

## Why Embeddings Matter

The magic of embeddings lies in their ability to capture semantic meaning. Words with similar meanings cluster together in the embedding space, and relationships between concepts are preserved as mathematical operations.

Consider these famous examples:
- `king - man + woman ≈ queen`
- `Paris - France + Italy ≈ Rome`

These relationships emerge naturally from the training process, allowing the model to understand that "king" relates to "man" in the same way "queen" relates to "woman."

## Building Your First Embedding Layer

Let's start with the basics. In PyTorch, creating an embedding layer is straightforward:

```python
import torch
import torch.nn as nn

# Create an embedding layer
vocab_size = 10000  # Size of our vocabulary
embedding_dim = 128  # Dimension of our embeddings

embedding_layer = nn.Embedding(vocab_size, embedding_dim)

# Convert a word (represented as an index) to an embedding
word_index = 42  # Index for a specific word in our vocabulary
word_embedding = embedding_layer(torch.tensor(word_index))

print(f"Embedding shape: {word_embedding.shape}")  # [128]
```

## From Words to Tokens

Before we can create embeddings, we need to convert text into tokens—discrete units that our model can process. This typically involves:

1. **Tokenization**: Breaking text into words or subwords
2. **Vocabulary creation**: Mapping each unique token to a number
3. **Encoding**: Converting text sequences to sequences of numbers

```python
# Simple tokenization example
text = "Building language models is fascinating"
tokens = text.lower().split()  # ['building', 'language', 'models', 'is', 'fascinating']

# Create a vocabulary
vocab = {word: idx for idx, word in enumerate(set(tokens))}
# {'building': 0, 'language': 1, 'models': 2, 'is': 3, 'fascinating': 4}

# Encode the text
encoded = [vocab[word] for word in tokens]
# [0, 1, 2, 3, 4]
```

## Training Embeddings: The Context Window

Embeddings learn their semantic properties through training on large amounts of text. The key insight is that words appearing in similar contexts tend to have similar meanings. This is where the concept of a **context window** comes in.

```python
def create_training_pairs(text, window_size=2):
    """Create (target, context) pairs for training embeddings."""
    pairs = []
    words = text.split()
    
    for i, target in enumerate(words):
        # Get context words within the window
        start = max(0, i - window_size)
        end = min(len(words), i + window_size + 1)
        
        for j in range(start, end):
            if i != j:  # Don't include the target word itself
                pairs.append((target, words[j]))
    
    return pairs

# Example usage
text = "the cat sat on the mat"
pairs = create_training_pairs(text, window_size=1)
# [('the', 'cat'), ('cat', 'the'), ('cat', 'sat'), ('sat', 'cat'), ...]
```

## Skip-gram vs CBOW: Two Training Approaches

There are two main approaches to training word embeddings:

### Skip-gram
Given a target word, predict the surrounding context words. This works well for infrequent words.

```python
class SkipGram(nn.Module):
    def __init__(self, vocab_size, embedding_dim):
        super().__init__()
        self.embeddings = nn.Embedding(vocab_size, embedding_dim)
        self.output_layer = nn.Linear(embedding_dim, vocab_size)
    
    def forward(self, target_word):
        # Get embedding for target word
        embedded = self.embeddings(target_word)
        # Predict context words
        output = self.output_layer(embedded)
        return output
```

### CBOW (Continuous Bag of Words)
Given context words, predict the target word. This works well for frequent words.

```python
class CBOW(nn.Module):
    def __init__(self, vocab_size, embedding_dim):
        super().__init__()
        self.embeddings = nn.Embedding(vocab_size, embedding_dim)
        self.output_layer = nn.Linear(embedding_dim, vocab_size)
    
    def forward(self, context_words):
        # Average the embeddings of context words
        embedded = self.embeddings(context_words)
        averaged = torch.mean(embedded, dim=0)
        # Predict target word
        output = self.output_layer(averaged)
        return output
```

## Modern Embeddings: Beyond Word2Vec

While Word2Vec introduced the fundamental concepts, modern LLMs use more sophisticated approaches:

### Positional Embeddings
Since transformers don't have inherent sequence awareness, positional embeddings encode where each word appears in the sentence.

```python
class PositionalEmbedding(nn.Module):
    def __init__(self, max_length, embedding_dim):
        super().__init__()
        self.pos_embedding = nn.Embedding(max_length, embedding_dim)
    
    def forward(self, positions):
        return self.pos_embedding(positions)

# Combine word and positional embeddings
word_emb = word_embedding_layer(tokens)
pos_emb = pos_embedding_layer(positions)
combined_emb = word_emb + pos_emb
```

### Contextualized Embeddings
Unlike static word embeddings, modern models create different embeddings for the same word based on context. The word "bank" has different meanings in "river bank" vs "savings bank," and contextualized embeddings capture this.

## Putting It All Together

Here's a simplified version of how embeddings fit into a basic language model:

```python
class SimpleLM(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim):
        super().__init__()
        self.embeddings = nn.Embedding(vocab_size, embedding_dim)
        self.rnn = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.output = nn.Linear(hidden_dim, vocab_size)
    
    def forward(self, input_ids):
        # Convert tokens to embeddings
        embedded = self.embeddings(input_ids)
        # Process through RNN
        lstm_out, _ = self.rnn(embedded)
        # Predict next tokens
        predictions = self.output(lstm_out)
        return predictions
```

## The Road Ahead

Understanding embeddings is just the beginning of your LLM journey. From here, you'll want to explore:

- **Attention mechanisms** and how they improve context understanding
- **Transformer architecture** and why it revolutionized NLP
- **Training techniques** like masked language modeling
- **Scaling laws** and how model size affects performance

## Key Takeaways

Embeddings are the bridge between human language and mathematical computation. They:

1. Convert discrete tokens into continuous vectors
2. Capture semantic relationships through training
3. Enable models to understand context and meaning
4. Form the foundation for all modern language models

The journey from simple word embeddings to sophisticated LLMs is fascinating, and understanding these fundamentals gives you the foundation to explore more advanced concepts. Whether you're building your own models or just trying to understand how AI works, embeddings are your starting point.

*Want to dive deeper? Try implementing a simple Word2Vec model from scratch—it's an excellent way to solidify these concepts and see how the math really works under the hood.*