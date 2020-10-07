class Artikel {
  constructor(
    id,
    judul,
    penulis,
    kategoriId,
    partOne,
    partTwo,
    partThree,
    hashtag,
    timeStamp,
  ) {
    this.id = id;
    this.judul = judul;
    this.penulis = penulis;
    this.kategoriId = kategoriId;
    this.partOne = partOne;
    this.partTwo = partTwo;
    this.partThree = partThree;
    this.hashtag = hashtag;
    this.timeStamp = timeStamp;
  }
}

export default Artikel;
