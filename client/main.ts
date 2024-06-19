import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,

} from "@solana/web3.js";

// Solana blockchain'inde hesap oluşturma ver veri okuma

import { deserialize, serialize } from "borsh";

import { Gezegen, GezegenSchema, Kisi, KisiSchema } from "./models";




//const connection= new Connection("https://api.testnet.solana.com","confirmed");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
//const connection= new Connection("https://api.mainnet-beta.solana.com","confirmed");
//const connection= new Connection("http://localhost:8899","confirmed");


//otorite
const privkey1 = // Özel anahtar
  [1, 237, 196, 4, 118, 44, 233, 63, 47, 247, 54, 170, 101, 220, 161, 144, 174, 46, 168, 3, 7, 119, 105, 38, 153, 42, 126, 172, 129, 173, 203, 105, 86, 212, 12, 148, 83, 69, 131, 66, 241, 114, 241, 196, 249, 57, 156, 114, 129, 134, 62, 144, 75, 117, 40, 189, 116, 3, 100, 66, 224, 105, 93, 168]


// Özel anahtarı kullanarak bir bir anahtar oluşturur
const payer = Keypair.fromSecretKey(Uint8Array.from(privkey1));

const planet_program_id = new PublicKey("Fn6W6W4K4pU1W7knerMNjCFrvJgqFhZqrmUtJY85c4v8")

const otoriteadresi = new PublicKey("6qwbmBVB3eTKmEEymuUGmoqDrmMe4FmbeDuarhc3X3UK");



const olusturkisi = async () => {

  const kisi = new Kisi();

  kisi.name = "Edanur",
    kisi.age = 22,
    kisi.kesfedilengezegensayisi = 1,
    kisi.kesfedenadres = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);


  console.log("Kesfeden isim => " + kisi.name);
  console.log("Kesfeden yas => " + kisi.age);
  console.log("Kesfedilen gezegen sayısı => " + kisi.kesfedilengezegensayisi);
  console.log("Kesfeden kisi adres => " + kisi.kesfedenadres);

  const encodedd = serialize(KisiSchema, kisi);


  const concatt = Uint8Array.of(1, ...encodedd);


   const yeniKisihesabi = Keypair.generate()

  // yenikisi fonksiyonu ile solana blok zincirindeki bir kişiye ait bilgileri içeren bir hesap oluşturuyoruz
  const yenikisi = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: yeniKisihesabi.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.1,
    space: encodedd.length,
    programId: planet_program_id

  })


  console.log("Kesfeden kisinin hesabı => " + yeniKisihesabi.publicKey.toString())


  const ix2 = new TransactionInstruction({ // programı çağırmak için
    keys: [
      { isSigner: false, isWritable: true, pubkey: yeniKisihesabi.publicKey },
      { isSigner: true, isWritable: true, pubkey: payer.publicKey },
    ],

    data: Buffer.from(concatt),

    programId: planet_program_id
  })

  const message = new TransactionMessage({
    instructions: [yenikisi, ix2],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer, yeniKisihesabi]);


  connection.sendTransaction(tx);

}

const kisiBilgisiOku = async () => {
  // Bu adres, okunacak hesabın Solana'daki public key'ini temsil eder.
  const kisiadi = new PublicKey("AzZZH9DTMEgCe5ssCFX2DaVZUs3ddwusn5XHHrEoWYyg") // kesfeden kisinin hesabı

  const hesapBilgisi1 = await connection.getAccountInfo(kisiadi) // public key alır

  const data1 = deserialize(KisiSchema, Kisi, hesapBilgisi1?.data!);

  console.log(data1.name)
  console.log(data1.age)
  console.log(data1.kesfedilengezegensayisi)
  console.log(data1.kesfedenadres)

}

const olusturgezegen = async () => {
// Yeni bir gezegen oluşturup bilgilerini blockchaine yazalım
  const gezegen = new Gezegen();
  const KesfedilenGezegenHesabi = Keypair.generate()

  gezegen.name = "solGezegen";
  gezegen.age = 200;
  gezegen.uzaklik = 123;
  gezegen.yasanabilirlik = 1;
  gezegen.kesfedenadres = new Uint8Array(payer.publicKey.toBytes());

  console.log("Gezegen isim => " + gezegen.name);
  console.log("Gezegen yas => " + gezegen.age);
  console.log("Gezegen uzaklık => " + gezegen.uzaklik);
  console.log("Gezegen yasanabilir mi? => " + gezegen.yasanabilirlik);


  const encoded3 = serialize(GezegenSchema, gezegen);

  const concat3 = Uint8Array.of(0, ...encoded3);



  const gezegeninyenihesabi = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: KesfedilenGezegenHesabi.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
    space: encoded3.length,
    programId: planet_program_id

  })

  console.log("gezegen public key ->" + KesfedilenGezegenHesabi.publicKey.toString())
  const kisiadi = new PublicKey("AzZZH9DTMEgCe5ssCFX2DaVZUs3ddwusn5XHHrEoWYyg")


  const ix2 = new TransactionInstruction({ // programı çağırmak için
    keys: [
      { isSigner: false, isWritable: true, pubkey: kisiadi },
      { isSigner: true, isWritable: true, pubkey: payer.publicKey },
      { isSigner: false, isWritable: true, pubkey: KesfedilenGezegenHesabi.publicKey },
    ],

    data: Buffer.from(concat3),

    programId: planet_program_id
  })

  const message = new TransactionMessage({
    instructions: [gezegeninyenihesabi,ix2],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  const tx = new VersionedTransaction(message);
  tx.sign([payer,KesfedilenGezegenHesabi]);

  //İşlem, Solana blockchain'e gönderilir.
  connection.sendTransaction(tx);

  const accountdataa = deserialize(GezegenSchema, Gezegen, Buffer.from(encoded3));


} 

const readData = async () => {
// Bir hesaptan gezegenin verilerini okuyalım

  // Bu adres, okunacak hesabın Solana'daki public key'ini temsil eder.
  const topgGezegenSayisi = new PublicKey("7WpF1xwpQY6YBmzb9xci23Rc6jMKq5FrsSN2aM1XTxUd")

  const hesapBilgisii = await connection.getAccountInfo(topgGezegenSayisi) 

  console.log(hesapBilgisii?.data.length)
  const accountdataa = deserialize(GezegenSchema, Gezegen, hesapBilgisii!.data);

  console.log("Name => " + accountdataa.name);
  console.log("Age => " + accountdataa.age);
  console.log("Uzaklık => " + accountdataa.uzaklik);
  console.log("Yasanabilir mi? => " + accountdataa.yasanabilirlik);
  console.log("Kesfeden kisi => " + accountdataa.kesfedenadres.toString());
  console.log("Onaylandı mı? => " + accountdataa.onaylandi);

}

const otoriteyazdir  = async () => {
  const KesfedilenGezegenHesabi = new PublicKey("7WpF1xwpQY6YBmzb9xci23Rc6jMKq5FrsSN2aM1XTxUd");

  const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: true, isWritable: true, pubkey: otoriteadresi},
      { isSigner: false, isWritable: true, pubkey: KesfedilenGezegenHesabi},
    ],

    data: Buffer.from([2]),
    programId: planet_program_id
  })
  

  const message = new TransactionMessage({
    instructions: [ix],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer]);


  connection.sendTransaction(tx);
}

const onaylaniysabirekle = async () => {
  const kisiadi = new PublicKey("AzZZH9DTMEgCe5ssCFX2DaVZUs3ddwusn5XHHrEoWYyg") //keşefenkişi hesap
  const KesfedilenGezegenHesabi = new PublicKey("7WpF1xwpQY6YBmzb9xci23Rc6jMKq5FrsSN2aM1XTxUd");
  
  const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: false, isWritable: true, pubkey: kisiadi}, // keşfeden kişi hesap
      { isSigner: false, isWritable: true, pubkey: KesfedilenGezegenHesabi }, // keşfedilen gezegen hesap
    ],

    data: Buffer.from([3]),
    programId: planet_program_id
  })
  

  const message = new TransactionMessage({
    instructions: [ix],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer,]);
 
   connection.sendTransaction(tx);
}

//olusturkisi()
// kisiBilgisiOku()
// olusturgezegen()
// readData()
// otoriteyazdir()
// onaylaniysabirekle()


// buffer.from([fonks. num]) instructionda tanımladığımız numara çağır
