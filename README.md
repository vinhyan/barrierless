## What is Barrierless

Barrierless is a command-line tool designed to break down language barriers by providing seamless translations from one language to another. Powered by GROQCloud, this tool allows users to quickly translate text into their desired target language, making communication across different languages effortless.

## Features

- Auto-detects languages.
- Multiple Language Support: Translate text between a wide range of languages.
- GROQCloud Integration: Utilizes GROQCloud's high-performance translation API.
- Easy to Use: Simple command-line interface for quick translations.
- Customizable: Easily extendable for additional language features or API support.

## How to use

### Installation

- Clone the repository and navigate to the project directory:

```
git clone git@github.com:vinhyan/barrierless.git
```

- Navigate to the project directory:

```
cd barrierless
```

- Install the required dependencies:

```
npm install
```

### Running the Tool

```
barrierless <text> [-l <target language>]
```

_Note: If no target language specified, it is default to English_

#### Options

- `-v, --version`: Barrierless Bot version
- `-l, --language <lang>`: Target language for translation (default: "English")
- `-h, --help`: Display help for command

## Examples

1. Chinese to Spanish

**CLI:**

```
barrierless-bot 你好 -l spanish
```

**Output:**

```
Translating 你好...
The translation of "你好" (nǐ hǎo) to Spanish is "Hola".
```

2. French to English

**CLI:**

```
barrierless-bot bonjour
```

**Output:**

```
Translating bonjour...
Bonjour translates to "Good day" or "Hello" in English.
```
