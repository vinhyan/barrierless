# Barrierless

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

### Set Up

Please refer to `CONTRIBUTING.md`

### Running the Tool

```sh
bl-bot <input files> [-l <target language>]
```

#### Note

_If no target language specified, it is default to English._

#### Arguments

- `<input files>`: Input filenames need to be translated (required)

#### Options

- `-v, --version`: Barrierless version
- `-l, --language <lang>`: Target language for translation (default: "English")
- `-h, --help`: Display help for command
- `-o, --output`: Output translated content to output file(s)
- `-p, --provider`: AI provider (currently supporting "Groq" and "Gemini". Default: "Groq")
- `-m, --model`: AI provider model (default: Groq="llama3-8b-8192" or Gemini="gemini-1.5-flash")

## Examples

Translate a text file in Chinese (to English):

**CLI:**

```sh
bl-bot examples/cn-file.txt
```

**Output:**

```sh
 ____                  _           _
| __ )  __ _ _ __ _ __(_) ___ _ __| | ___  ___ ___
|  _ \ / _` | '__| '__| |/ _ \ '__| |/ _ \/ __/ __|
| |_) | (_| | |  | |  | |  __/ |  | |  __/\__ \__ \
|____/ \__,_|_|  |_|  |_|\___|_|  |_|\___||___/___/

Provider: Groq
📂 Reading file(s)...
   1/1: cn-file.txt
🔄 Translating file(s) to English...
✅ Results:
*** cn-file_en.txt ***
In this fast-paced world, learning new skills is crucial to staying competitive. Whether it's programming, language learning, or other professional skills, continuous learning helps us constantly improve. Effort and perseverance will bring rich rewards. Success is not achieved overnight, but rather through continuous accumulation and hard work to realize our dreams.

====== Done ======
```

Translate a text file in English to French:

**CLI:**

```sh
bl-bot examples/en-file.txt -l french
```

**Output:**

```sh
 ____                  _           _
| __ )  __ _ _ __ _ __(_) ___ _ __| | ___  ___ ___
|  _ \ / _` | '__| '__| |/ _ \ '__| |/ _ \/ __/ __|
| |_) | (_| | |  | |  | |  __/ |  | |  __/\__ \__ \
|____/ \__,_|_|  |_|  |_|\___|_|  |_|\___||___/___/

Provider: Groq
📂 Reading file(s)...
   1/1: en-file.txt
🔄 Translating file(s) to French...
✅ Results:
*** en-file_fr.txt ***
Chaque jour est une nouvelle chance d'apprendre quelque chose de nouveau. De petits pas peuvent mener à de grands changements. Continuez d'essayer, et vous verrez des progrès avec le temps.

====== Done ======
```

Translate 2 text files in Chinese and English to Vietnamese, and save to output files:

**CLI:**

```sh
bl-bot examples/* -l vietnamese -o
```

**Output:**

```sh
 ____                  _           _
| __ )  __ _ _ __ _ __(_) ___ _ __| | ___  ___ ___
|  _ \ / _` | '__| '__| |/ _ \ '__| |/ _ \/ __/ __|
| |_) | (_| | |  | |  | |  __/ |  | |  __/\__ \__ \
|____/ \__,_|_|  |_|  |_|\___|_|  |_|\___||___/___/

Provider: Groq
📂 Reading file(s)...
   1/2: cn-file.txt
   2/2: en-file.txt
🔄 Translating file(s) to Vietnamese...
📝 Outputting translated file(s)...
📥 All translated files have been saved to the "/translated_files" directory.
====== Done ======
```

Translate a text file in English and Chinese to Spanish, using GeminiAI provider:

**CLI:**

```sh
bl-bot examples/* -l spanish -p gemini
```

**Output:**

```sh
 ____                  _           _
| __ )  __ _ _ __ _ __(_) ___ _ __| | ___  ___ ___
|  _ \ / _` | '__| '__| |/ _ \ '__| |/ _ \/ __/ __|
| |_) | (_| | |  | |  | |  __/ |  | |  __/\__ \__ \
|____/ \__,_|_|  |_|  |_|\___|_|  |_|\___||___/___/

Provider: Gemini
📂 Reading file(s)...
   1/2: cn-file.txt
   2/2: en-file.txt
🔄 Translating file(s) to Spanish...
✅ Results:
*** cn-file_es.txt ***
En este mundo acelerado, aprender nuevas habilidades es fundamental para mantenerse competitivo. Ya sea programación, aprendizaje de idiomas u otras habilidades profesionales, el aprendizaje continuo nos ayuda a progresar constantemente. El esfuerzo y la perseverancia traerán ricas recompensas. El éxito no se logra de la noche a la mañana, sino que es un sueño que se materializa a través de la acumulación y el esfuerzo constante.

*** en-file_es.txt ***
Cada día es una nueva oportunidad para aprender algo nuevo. Los pequeños pasos pueden llevar a grandes cambios. Sigue intentando, y verás progreso con el tiempo.

====== Done ======
```
