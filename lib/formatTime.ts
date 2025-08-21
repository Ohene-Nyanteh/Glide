export function formatTime(time: number): string {
  if (time < 60) {
    return `0:${time < 10 ? `0${time}` : time}`.slice(0, 4);
  } else {
    //calculate minutes
    const number_of_minutes = Math.floor(time / 60);
    const number_of_seconds = time % 60;
    return `${number_of_minutes}:${number_of_seconds < 10 ? `0${number_of_seconds}` : number_of_seconds}`.slice(
      0,
      4
    );
  }
}
