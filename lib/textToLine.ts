export function textToLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .flatMap((line) => (line ? [line] : [""]));
}
