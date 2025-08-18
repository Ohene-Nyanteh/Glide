  export function shortenText(text: string, maxLength: number) {
  if (!text){
    return;
  }
    const ellipsis = '...';

    // If text length is less than or equal to maxLength, return as is.
    if (text.length <= maxLength) {
      return text;
    }

    // Otherwise, take the first (maxLength - ellipsis length) characters and append ellipsis.
    const shortened = text.slice(0, maxLength - ellipsis.length) + ellipsis;
    return shortened;
  }
