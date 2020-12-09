import fs from 'fs';

// types
enum OpCode {
  nop = 'nop',
  acc = 'acc',
  jmp = 'jmp'
}

interface Instruction {
  opcode: OpCode;
  value: number;
}

type Program = Instruction[];

type ExecCounts = number[];

function load(filepath: string): string {
  return fs.readFileSync(filepath, 'utf8');
}

function compile(code: string): Program {
  return code.split("\n")
    .map((line) => line.split(' '))
    // casting - could check opcode for compile time errors :)
    .map(([opcode, value]) => ({ opcode, value: parseInt(value)} as Instruction))
}

// implementation
let ACCUMULATOR = 0;

function run(program: Program) {
  const end = program.length - 1;
  const counts: ExecCounts = Array(program.length).fill(0);
  let pc = 0; // program counter :D
  let steps = 0;
  while (pc < end) {
    const { opcode, value } = program[pc];
    counts[pc] += 1;
    if (counts[pc] > 1) break;
    switch (opcode) {
      case OpCode.acc: {
        ACCUMULATOR += value;
        pc += 1;
        break;
      }
      case OpCode.jmp: {
        pc = pc + value;
        break;
      }
      case OpCode.nop: {
        pc += 1;
        break;
      }
      default: {
        throw Error(`Unknown operaton ${opcode}`)
      }
    }
    steps += 1;
  }
  console.log(`executed ${steps} steps`);
}

// run
console.log('Starting...')
run(compile(load('./src/source.txt')));
console.log(`Last Accumulator Value: ${ACCUMULATOR}`)
console.log('end')
