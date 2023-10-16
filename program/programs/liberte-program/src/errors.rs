use anchor_lang::prelude::*;

#[error_code]
pub enum LibreteError {
    #[msg("Authority mismatch")]
    InvalidAuthority,
}