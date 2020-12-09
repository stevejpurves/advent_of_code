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

type Processor = Record<OpCode, (pc: number, acc: Accumulator, value: number) => number>;

type Accumulator = { value: number };

const processor: Processor = {
  [OpCode.acc]: (pc, acc, value) => {
    acc.value += value;
    return pc + 1;
  },
  [OpCode.jmp]: (pc, acc, value) => (pc + value),
  [OpCode.nop]: (pc, acc, value) => (pc + 1),
}

// implementation
function load(filepath: string): string {
  return fs.readFileSync(filepath, 'utf8');
}

function compile(code: string): Program {
  return code.split("\n")
    .map((line) => line.split(' '))
    // casting - could check opcode for compile time errors :)
    .map(([opcode, value]) => ({ opcode, value: parseInt(value)} as Instruction))
}

let ACCUMULATOR: Accumulator = { value: 0 };

function run(processor:Processor, program: Program) {
  const end = program.length - 1;
  const counts: ExecCounts = Array(program.length).fill(0);
  let pc = 0; // program counter :D
  let steps = 0;
  while (pc < end) {
    const { opcode, value } = program[pc];
    if (counts[pc] > 1) break;
    try {
      pc = processor[opcode](pc, ACCUMULATOR, value)
      counts[pc] += 1;
      steps += 1;
    } catch (err) {
      console.log(err)
      throw err;
    }
  }
  console.log(`executed ${steps} steps`);
}

// run
console.log('Starting...')
run(processor, compile(load('./src/source.txt')));
console.log(`Last Accumulator Value: ${ACCUMULATOR.value}`)
console.log('end')
