## What is Barrierless

Barrierless is a command-line tool designed to break down language barriers by providing seamless translations from one language to another. Powered by GROQCloud, this tool allows users to quickly translate text files into their desired target language, making communication across different languages effortless.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vdp44fsu4iljnv42fxa9.gif)

## Features

- Auto-detects languages.
- Multiple Language Support: Translate text between a wide range of languages.
- Now supporting [GROQCloud](https://console.groq.com/docs/) and [GeminiAI](https://ai.google.dev/gemini-api/docs)
- Easy to Use: Simple command-line interface for quick translations.
- Customizable: Easily extendable for additional language features or API support.

## How to use

### Installation

1. Clone the repository and navigate to the project directory:

```sh
git clone git@github.com:vinhyan/barrierless.git
```

2. Navigate to the project directory:

```sh
cd barrierless
```

3. Install the required dependencies:

```sh
npm install
```

4. Create a `.env` file to store Groq API Key  
   _Note: refer to `.env.example` for instruction on how to obtain and store Groq API Key_

5. Omit this step if `npm install -g` was used in step 3. Otherwise, run:

```sh
npm link
```

### Running the Tool

```sh
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
- `-p, --provider`: AI provider (currently supporting "Groq" and "Gemini". Default: "Groq")
- `-m, --model`: AI provider model (default: Groq="llama3-8b-8192" or Gemini="gemini-1.5-flash")

## Examples

1. Translate a text file in Chinese to English:

**CLI:**

```sh
bl-bot examples/cn-file.txt
```

**Output:**

```
Provider: Groq
*** Translating "examples/cn-file.txt"... ***
In this fast-paced world, learning new skills is the key to staying competitive. Whether it's programming, language learning, or other professional skills, continuous learning can help us make continuous progress. Effort and perseverance will bring rich rewards. Success is not achieved overnight, but rather through continuous accumulation and effort, making our dreams a reality.
*** Done! ***
```

2. Translate a text file in English to Cantonese:

**CLI:**

```sh
bl-bot examples/en-file.txt -l cantonese
```

**Output:**

```
Provider: Groq
*** Translating "examples/en-file.txt"... ***
每日係新機會學會新嘢。細步可以帶來大變化。繼續嘗試，你會見到時間的進步。
*** Done! ***
```

3. Translate 2 text files in Chinese and English to Vietnamese, and save to output files:

**CLI:**

```sh
bl-bot examples/* -l vietnamese -o cn-vi en-vi
```

**Output:**

```
Provider: Groq
*** cn-vi is translated and saved to "cn-vi.txt"... ***
*** en-vi is translated and saved to "en-vi.txt"... ***
*** Done! ***
```

4. Translate a text file in English and Chinese to Spanish, using GeminiAI provider:

**CLI:**

```sh
bl-bot examples/* -l spanish -p gemini
```

**Output:**

```
Provider: Gemini
*** Translating "examples/cn-file.txt"... ***
En este mundo acelerado, aprender nuevas habilidades es clave para mantenerse competitivo. Ya sea programación, aprendizaje de idiomas u otras habilidades profesionales, el aprendizaje continuo nos ayuda a mejorar constantemente. El esfuerzo y la perseverancia traen recompensas abundantes. El éxito no se logra de la noche a la mañana, sino que es un sueño que se materializa a través de la acumulación constante y el esfuerzo.

*** Translating "examples/en-file.txt"... ***
Cada día es una nueva oportunidad para aprender algo nuevo. Los pequeños pasos pueden llevar a grandes cambios. Sigue intentándolo, y verás progreso con el tiempo.

*** Done! ***
```
