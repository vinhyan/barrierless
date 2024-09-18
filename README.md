## What is Barrierless

Barrierless is a command-line tool designed to break down language barriers by providing seamless translations from one language to another. Powered by GROQCloud, this tool allows users to quickly translate text files into their desired target language, making communication across different languages effortless.

![barrierless-demo](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5hcGswOHJ0d3oxMzUycWQ1M3JmcWs0aDU4cHo3cTc3ZXJyenB2cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lzAaDxEol2rhrSm3nS/giphy.gif)

## Features

- Auto-detects languages.
- Multiple Language Support: Translate text between a wide range of languages.
- GROQCloud Integration: Utilizes GROQCloud's high-performance translation API.
- Easy to Use: Simple command-line interface for quick translations.
- Customizable: Easily extendable for additional language features or API support.

## How to use

### Installation

1. Clone the repository and navigate to the project directory:

```
git clone git@github.com:vinhyan/barrierless.git
```

2. Navigate to the project directory:

```
cd barrierless
```

3. Install the required dependencies:

```
npm install
```

4. Create a `.env` file to store Groq API Key  
   _Note: refer to `.env.example` for instruction on how to obtain and store Groq API Key_

5. Omit this step if `npm install -g` was used in step 3. Otherwise, run:

```
npm link
```

### Running the Tool

```
bl-bot <input files> [-l <target language>]
```

_Note: If no target language specified, it is default to English_

#### Arguments

- `<input files>`: Input filenames need to be translated (required)

#### Options

- `-v, --version`: Barrierless Bot version
- `-l, --language <lang>`: Target language for translation (default: "English")
- `-h, --help`: Display help for command
- `-o, --output`: Output filename(s)
- `-m, --model`: AI provider model (default: "llama3-8b-8192")

## Examples

1. Translate a text file in Chinese to English:

**CLI:**

```
bl-bot examples/cn-file.txt
```

**Output:**

```
*** Translating "examples/cn-file.txt"... ***
In this fast-paced world, learning new skills is the key to staying competitive. Whether it's programming, language learning, or other professional skills, continuous learning can help us make continuous progress. Effort and perseverance will bring rich rewards. Success is not achieved overnight, but rather through continuous accumulation and effort, making our dreams a reality.
*** Done! ***
```

2. Translate a text file in English to Cantonese:

**CLI:**

```
bl-bot examples/en-file.txt -l cantonese
```

**Output:**

```
*** Translating "examples/en-file.txt"... ***
每日係新機會學會新嘢。細步可以帶來大變化。繼續嘗試，你會見到時間的進步。
*** Done! ***
```

3. Translate 2 text files in Chinese and English to Vietnamese, and save to output files:

**CLI:**

```
bl-bot examples/* -l vietnamese -o cn-vi en-vi
```

**Output:**

```
*** cn-vi is translated and saved to "cn-vi.txt"... ***
*** en-vi is translated and saved to "en-vi.txt"... ***
*** Done! ***
```
