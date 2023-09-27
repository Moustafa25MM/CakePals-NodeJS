export const bakingTimeFunc = (bakingTimeStr: any) => {
  let bakingTimes: number;

  if (typeof bakingTimeStr === 'string') {
    const match = bakingTimeStr.match(
      /(\d+)\s*(m|minute|minutes|h|hour|hours)\b/i
    );
    if (match) {
      const quantity = Number(match[1]);
      const unit = match[2].toLowerCase();
      if (unit === 'm' || unit === 'minutes') {
        bakingTimes = quantity >= 60 ? quantity / 60 : quantity / 60.0;
      } else if (unit === ' ') {
        throw new Error(
          'Invalid baking time format. Use h, hours, m, or minutes.'
        );
      } else {
        bakingTimes = quantity;
      }
    } else {
      throw new Error(
        'Invalid baking time format. Use h, hours, m, or minutes.'
      );
    }
  } else {
    throw new Error('Baking time not provided or not a string.');
  }
  return bakingTimes;
};
