import formatHighlight from 'json-format-highlight';

export function injectObjectRawProps<T>(o: T, props: (keyof T)[]): void {
  for (const prop of props) {
    if (Object.prototype.hasOwnProperty.call(o, prop)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = JSON.stringify((o as any)[`${String(prop)}`], undefined, 2)
        .replaceAll('\n', '<br/>')
        .replaceAll(' ', '&nbsp;');
      const colors = {
        keyColor: '#8FC9E7',
        numberColor: '#A1B796',
        stringColor: '#C58B73',
        trueColor: '#4B84B3',
        falseColor: '#4B84B3',
        nullColor: '#4B84B3',
      };
      const formattedRaw = formatHighlight(raw, colors);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o as any)[`${String(prop)}`].raw = formattedRaw;
    }
  }
}
