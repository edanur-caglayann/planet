use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]

pub struct YeniGezegen{
    pub name:String, 
    pub age: u8, 
    pub uzaklik:u32, 
    pub yasanabilirlik:u8, // 0-1 olabilir. En küçük veri tipi u8 olduğundan
    pub kesfedenadres:[u8;32],// Gezegeni keşfeden kişinin cüzdan adresi. 32 bytelık array
    pub onaylandi:u8,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct KesfedenKisi{
    pub name:String, 
    pub age: u8,
    pub kesfedilengezegensayisi:u16,
    pub kesfedenadres:[u8;32]
}

