export class Gezegen { // Gezegen verilerini tutar
   
  name:string ="";
  age:number=0;
  uzaklik:number=0;
  yasanabilirlik:number=0;
  kesfedenadres: Uint8Array = new Uint8Array(32);
  onaylandi:number=0;

  constructor(fields: {

  name:string;
  age:number;
  uzaklik:number;
  yasanabilirlik:number;
  kesfedenadres: Uint8Array;
  onaylandi:number;
    
   } | undefined = undefined)
    {if (fields) {
      this.name=fields.name;
      this.age=fields.age;
      this.uzaklik=fields.uzaklik;
      this.yasanabilirlik=fields.yasanabilirlik;
      this.kesfedenadres=fields.kesfedenadres;
      this.onaylandi=fields.onaylandi;
    }
  }

}


export const GezegenSchema = new Map([
  [Gezegen,
    {
      kind: "struct",
      fields: [
        ["name","String"],
        ["age","u8"],
        ["uzaklik","u32"],
        ["yasanabilirlik","u8"],
        ["kesfedenadres",["u8",32]],
        ["onaylandi","u8"],
      ]
    }
  ]
])





  

  export class Kisi { // Kişi verilerini tutar
   
    name:string ="";
    age:number=0;
    kesfedilengezegensayisi:number=0;
    kesfedenadres: Uint8Array = new Uint8Array(32);
    
  
    constructor(fields: {
  
    name:string;
    age:number;
    kesfedilengezegensayisi:number;
    kesfedenadres: Uint8Array;
      
     } | undefined = undefined)
      {if (fields) {
        this.name=fields.name;
        this.age=fields.age;
        this.kesfedilengezegensayisi=fields.kesfedilengezegensayisi;
        this.kesfedenadres=fields.kesfedenadres;

      }
    }
  
  }

  
  export const KisiSchema = new Map([
    [Kisi,
      {
        kind: "struct",
        fields: [
          ["name","String"],
          ["age","u8"],
          ["kesfedilengezegensayisi","u16"],
          ["kesfedenadres",["u8",32]],
        ]
      }
    ]
  ])
