import { readFileSync } from 'fs';
import { Scanner, createScanner } from './src/scanner';

const cliArgs = process.argv.slice(2);

console.log('cliArgs: ', cliArgs);

if (cliArgs.length === 0) {
  runPrompt();
} else if (cliArgs.length === 1) {
  console.log('fileName: ', cliArgs[0]);
  const file: string = readFileSync(cliArgs[0], 'utf8');
  console.log('file: ', file);
  if (file !== null) {
    const scanner: Scanner = createScanner(file);
    const tokens = scanner.scan();

    tokens.forEach((token) => {
      console.log('token: ', token);
    });
  }
}

function runPrompt(): void {
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const chunk: string = <string>process.stdin.read();
    if (chunk !== null) {
      const scanner: Scanner = createScanner(chunk);
      const tokens = scanner.scan();

      tokens.forEach((token) => {
        console.log('token: ', token);
      });
    }

    process.stdout.write('> ');
  });

  process.stdin.on('end', () => {
    process.stdout.write('end');
  });
}
