### Planet Uygulaması

Bu proje, kullanıcıların gezegenler keşfetmesini ve bu gezegenlerle ilgili bilgileri Solana blockchain üzerinde saklamasını sağlayan bir akıllı kontrattır. Kullanıcılar, gezegen keşfetme ve gezegen bilgilerini blok zincirine yazma gibi işlemleri yapabilirler. Bu uygulama Solana ağı üzerinde Rust dili ile geliştirilmiştir ve gezegen bilgilerini güvenli bir şekilde saklamayı amaçlar.

### Proje Özellikleri
- *Kişi Oluşturma:* Kullanıcıların blockchain üzerinde bir kişi hesabı oluşturmasını sağlar.
- *Gezegen Oluşturma:* Kullanıcılar, blockchain üzerinde bir gezegen oluşturabilir ve bilgilerini saklayabilir.
- *Gezegen Bilgisi Okuma:* Kullanıcılar, blockchain üzerinde saklanan gezegen bilgilerini okuyabilir.
- *Yetki Yazma:* Otorite, gezegen verilerini onaylayabilir ve yetki verebilir.
- *Onaylı Verileri Ekleme:* Onaylanan veriler blockchain'e eklenir ve saklanır.

### Kullanılan Fonksiyonlar

#### *1. Kişi Oluşturma (olusturkisi)*
Bu fonksiyon, blockchain üzerinde bir kişi hesabı oluşturur ve ilgili kişi bilgilerini (isim, yaş, keşfedilen gezegen sayısı, keşfeden adres) blockchain'e yazar.
const olusturkisi = async () => {
  // Kişi nesnesi oluşturuluyor
  const kisi = new Kisi();
  kisi.name = "Edanur";
  kisi.age = 22;
  kisi.kesfedilengezegensayisi = 1;
  kisi.kesfedenadres = new Uint8Array([/* Adres verisi */]);
  
  // Kişi bilgileri blockchain'e yazılıyor
  const yenikisi = SystemProgram.createAccount({ /* Detaylar */ });
  // İşlem blockchain'e gönderiliyor
  connection.sendTransaction(tx);
}


#### *2. Gezegen Oluşturma (olusturgezegen)*
Bu fonksiyon, blockchain üzerinde yeni bir gezegen oluşturur ve gezegen bilgilerini (isim, yaş, uzaklık, yaşanabilirlik) blockchain'e kaydeder.
const olusturgezegen = async () => {
  // Gezegen nesnesi oluşturuluyor
  const gezegen = new Gezegen();
  gezegen.name = "solGezegen";
  gezegen.age = 200;
  gezegen.uzaklik = 123;
  gezegen.yasanabilirlik = 1;
  
  // Gezegen bilgileri blockchain'e yazılıyor
  const gezegeninyenihesabi = SystemProgram.createAccount({ /* Detaylar */ });
  connection.sendTransaction(tx);
}


#### *3. Gezegen Bilgisi Okuma (readData)*
Bu fonksiyon, blockchain'de saklanan bir gezegenin bilgilerini okur ve bu bilgileri kullanıcıya sunar.
typescript
const readData = async () => {
  // Gezegenin public key'i ile hesap bilgisi alınıyor
  const hesapBilgisii = await connection.getAccountInfo(topgGezegenSayisi);
  
  // Gezegen verileri deseralize edilip kullanıcıya sunuluyor
  const accountdataa = deserialize(GezegenSchema, Gezegen, hesapBilgisii!.data);
}


#### *4. Yetki Yazma (otoriteyazdir)*
Bu fonksiyon, keşfedilen gezegenlere yetki verilmesini sağlar.
typescript
const otoriteyazdir = async () => {
  const ix = new TransactionInstruction({
    // Yetki yazma işlemi blockchain'e gönderiliyor
    keys: [/* Anahtarlar */],
    data: Buffer.from([2]),
  });
  connection.sendTransaction(tx);
}


#### *5. Onaylı Verileri Ekleme (onaylaniysabirekle)*
Bu fonksiyon, onaylanan gezegen verilerini blockchain'e ekler.
typescript
const onaylaniysabirekle = async () => {
  const ix = new TransactionInstruction({
    // Onaylı veriler blockchain'e yazılıyor
    keys: [/* Anahtarlar */],
    data: Buffer.from([3]),
  });
  connection.sendTransaction(tx);
}
