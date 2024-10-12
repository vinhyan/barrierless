import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name, version, description } = require('../../package.json');
import { Command } from 'commander';

export default function argParser() {
  // Command-line tool setup with commander
  const program = new Command();
  program
    .name(`${name}`)
    .description(`${description}`)
    .version(`${name}: ${version}`, '-v, --version', 'Barrierless Bot version');

  // Define the `query` command to execute a GROQ query
  program
    .description('Translates file(s) using GROQCloud')
    .argument('<files...>', 'File(s) to translate')
    .option('-l, --language <lang>', 'Target language for translation')
    .option('-o, --output', 'Save the output to file(s)')
    .option(
      '-p, --provider <provider>',
      'AI provider: enter "Groq" or "Gemini". Default is Groq'
    )
    .option('-m, --model <model>', 'AI provider model');

  // Parse the command-line arguments
  program.parse(process.argv);

  const options = program.opts();
  const args = program.args;

  return { options, args };
}
