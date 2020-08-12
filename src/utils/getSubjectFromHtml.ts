import cheerio from 'cheerio';

export default (htmlString: string): string | undefined => {
  const $ = cheerio.load(htmlString);
  const subject = $('subject').text();
  if (subject.length > 0) {
    return subject;
  }
  return undefined;
}
