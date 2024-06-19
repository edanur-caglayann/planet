use crate::{error::RNGProgramError::InvalidInstruction, state::{KesfedenKisi, YeniGezegen}, };
use borsh::BorshDeserialize;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug, PartialEq)]
pub enum RNGProgramInstruction { 
NewGezegen{data:YeniGezegen},
NewKasif{data:KesfedenKisi},
OnayIslemi,
EklemeIslemi,

}

impl RNGProgramInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
      msg!("Program call");
  
      let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
      {msg!("{}", rest.len());
       msg!("{}", tag);
    }
       
      Ok(match tag {
        0=> Self::NewGezegen{
          data:YeniGezegen::try_from_slice(&rest)?
        },
        1 => Self::NewKasif{
          data:KesfedenKisi::try_from_slice(&rest)?
        },
        2 => Self::OnayIslemi,
        3 => Self::EklemeIslemi,
  
  
        _ => return Err(InvalidInstruction.into()),
      })
    }
  }
  
  