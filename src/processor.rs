use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{ 
    account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, msg, nonce::state::Data, program::invoke, program_error::ProgramError, pubkey::{self, Pubkey}, system_instruction::{self, SystemInstruction}, system_program
    };
use crate::{error::RNGProgramError::InvalidInstruction, instruction::RNGProgramInstruction, state::{KesfedenKisi, YeniGezegen}, };
pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
      ) -> ProgramResult {
        let instruction: RNGProgramInstruction = RNGProgramInstruction::unpack(instruction_data)?;
    
    
        match instruction { 
          RNGProgramInstruction::NewGezegen{data} => {
            Self::kesfedilengezegenkaydi(program_id,accounts,data)
          }

          RNGProgramInstruction::NewKasif {data }=> { 
            Self::kasifkisikaydi(program_id,accounts,data)
          }
          RNGProgramInstruction::OnayIslemi=> { 
            Self::gezegenOnay(program_id,accounts)
          }
          RNGProgramInstruction::EklemeIslemi=> { 
            Self::onaylandiysaekle(program_id,accounts)
          }
        }
      }


      pub fn kasifkisikaydi(
        program_id: &Pubkey, // kontratın çalışıtğı programın kimliği
        accounts: &[AccountInfo], // fonks çalışması için gerekli olan hesap bilgileri
        kesfedenkisininbilgileri: KesfedenKisi,
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let kasifkullanicihesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // kasifin kullanıcı hesap bilgileri

        let kasifcuzdanhesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // kasifin cuzdan hesap bilgileri
        
        if kasifkullanicihesap.owner != program_id{
          panic!()
        }

        if !kasifcuzdanhesap.is_signer { // imzalayan değilse hata alır
          panic!()
        }
        
        let kesfedenkisibilgileri = KesfedenKisi {
          name:"Edanur".to_string(),
          age:20,
          kesfedilengezegensayisi:0, // ilk kez kaydedildiği için 0
          // kasifcüzdanhesap hesabının public key'ini alıp byte arraye dönüştürür 
          // Ve sonucu kesfedenadrese atar. Veriyi depolamak ve ağ üzerinde taşımak için bu işlemi yaparız
          kesfedenadres:kasifcuzdanhesap.key.to_bytes()
     
       };

        kesfedenkisibilgileri.serialize(&mut &mut kasifkullanicihesap.data.borrow_mut()[..])?;
  
        Ok(())
      }


      pub fn kesfedilengezegenkaydi(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        kesfedilengezegeninbilgileri:YeniGezegen, // Yeni keşfedilen gezegenin bilgilerini içeren bir yapı
      ) -> ProgramResult {

        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let kasifkullanicihesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // kasif kullanıcı hesabı

        let kasifcuzdanhesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // kasif cuzdan hesabı

        let kesfedilengezegenhesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // yeni keşfedilen gezegenin kaydedileceği cüzdan hesabı

        msg!("kesfedilengezegenkaydi");

        if kasifkullanicihesap.owner != program_id{
          panic!()
        }
        msg!("1");

      
        if !kasifcuzdanhesap.is_signer { // imzalayan değilse hata alır
          panic!()
        }
        msg!("2");

        if kesfedilengezegeninbilgileri.kesfedenadres != kasifcuzdanhesap.key.to_bytes() {
          panic!()
        }
        msg!("3");

        let adrescek = Pubkey::new_from_array(kesfedilengezegeninbilgileri.kesfedenadres); // Pubkey::new_from_array fonks ile dönüşüm sağlarız

        if &adrescek != kasifcuzdanhesap.key {
          panic!()}
      
          kesfedilengezegeninbilgileri.serialize(&mut &mut kesfedilengezegenhesap.data.borrow_mut()[..])?; // her kaydedilen gezegen için bir account oluşturcaz
          msg!("4");


        Ok(())
      }
      

      pub fn gezegenOnay(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
      ) -> ProgramResult {

        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let otorite: &AccountInfo<'_> = next_account_info(accounts_iter)?; // otorite hesabı

        let kesfedilengezegenhesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // yeni keşfedilen gezegenin kaydedileceği cüzdan hesabı

        let otoriteadresi = Pubkey::from_str("6qwbmBVB3eTKmEEymuUGmoqDrmMe4FmbeDuarhc3X3UK").unwrap(); // gömülü olarak programa verdik
       
       if &otoriteadresi != otorite.key { // otorite sen misin
        panic!()
       }
       if !otorite.is_signer { // boolean döndürür
        panic!()
       }

       // 52? bytelık byte array ulaşırız try_from_slice
       let mut gezegeninbilgisi = YeniGezegen::try_from_slice(&kesfedilengezegenhesap.data.borrow())?; 
       
      gezegeninbilgisi.onaylandi = 1;
      
      gezegeninbilgisi.serialize(&mut &mut kesfedilengezegenhesap.data.borrow_mut()[..])?;


     
       Ok(())
      }

      pub fn onaylandiysaekle(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let kasifkullanicihesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // kasifin kullanıcı hesap bilgileri

        let kesfedilengezegenhesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; // yeni keşfedilen gezegenin kaydedileceği cüzdan hesabı

        if kesfedilengezegenhesap.owner != program_id {
          panic!()
        }

        let mut gezegeninbilgisi = YeniGezegen::try_from_slice(&kesfedilengezegenhesap.data.borrow())?; 

        if gezegeninbilgisi.onaylandi != 1 {
          panic!()
        }

        gezegeninbilgisi.onaylandi = 2;

        let mut kullanicibilgisi = KesfedenKisi::try_from_slice(&kasifkullanicihesap.data.borrow())?; 

        kullanicibilgisi.kesfedilengezegensayisi += 1;



        kullanicibilgisi.serialize(&mut &mut kasifkullanicihesap.data.borrow_mut()[..])?; 
        gezegeninbilgisi.serialize(&mut &mut kesfedilengezegenhesap.data.borrow_mut()[..])?; 


        Ok(())
      }
}