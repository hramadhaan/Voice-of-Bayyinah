class SubKategori {
  constructor(
    id,
    judul,
    penulis,
    kategoriId,
    pdfSatu,
    fileNameSatu,
    pdfDua,
    fileNameDua,
    pdfTiga,
    fileNameTiga,
    fullPdf,
    fileNameFull,
    hashtag,
    timestamp,
  ) {
    this.id = id;
    this.judul = judul;
    this.penulis = penulis;
    this.kategoriId = kategoriId;
    this.pdfSatu = pdfSatu;
    this.fileNameSatu = fileNameSatu;
    this.pdfDua = pdfDua;
    this.fileNameDua = fileNameDua;
    this.pdfTiga = pdfTiga;
    this.fileNameTiga = fileNameTiga;
    this.fullPdf = fullPdf;
    this.fileNameFull = fileNameFull;
    this.hashtag = hashtag;
    this.timestamp = timestamp;
  }
}

export default SubKategori;
