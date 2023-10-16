use anchor_lang::{
    prelude::*,
    accounts::{
        cpi_account::CpiAccount,
        program_account::ProgramAccount
    },
    solana_program::{
        address_lookup_table_account::AddressLookupTableAccount,
        sysvar::instructions::{ID as IX_ID},
        program::invoke_signed
    }
};
use anchor_spl::token::{
    self, InitializeAccount, Mint, SetAuthority, Token, TokenAccount, Transfer,
};
use crate::account::*;
use crate::constant::*;
use crate::errors::LibreteError::InvalidAuthority;
use std::mem::size_of;
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
      init,
      seeds=[PREFIX_SETTINGS],
      bump,
      payer=authority,
      space=8+size_of::<Settings>()
    )]
    pub settings: Account<'info, Settings>,
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(signature: String)]
pub struct RegisterNode<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds=[PREFIX_SETTINGS], bump)]
    pub settings: Account<'info, Settings>,
    #[account(
      init,
      seeds=[PREFIX_NODE, signature.as_bytes()],
      bump,
      payer=authority,
      space=8+size_of::<Node>()
    )]
    pub node: Account<'info, Node>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(signature: String)]
pub struct CloseNode<'info> {
    #[account(mut,
    constraint = authority.key() == node.authority @InvalidAuthority
    )]
    pub authority: Signer<'info>,
    #[account(mut, seeds=[PREFIX_SETTINGS], bump)]
    pub settings: Account<'info, Settings>,
    #[account(
    mut,
    seeds=[PREFIX_NODE, signature.as_bytes()],
    bump,
    close=authority,
    )]
    pub node: Account<'info, Node>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,

}

#[derive(Accounts)]
#[instruction(signature: String)]
pub struct ClaimNode<'info>  {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds=[PREFIX_SETTINGS], bump)]
    pub settings: Account<'info, Settings>,
    #[account(
    init,
    seeds=[PREFIX_CLAIM, authority.key().as_ref()],
    bump,
    payer=authority,
    space=8+size_of::<Claim>()
    )]
    pub claim: Account<'info, Claim>,
    #[account(
    constraint = settings.reward_mint == mint.key() @InvalidAuthority
    )]
    pub mint: Account<'info, Mint>,
    /// CHECKS: will cross check on IX
    pub merkle_account: AccountInfo<'info>,
    #[account(
    constraint = token_ata.owner == authority.key() @InvalidAuthority,
    constraint = token_ata.mint == mint.key() @InvalidAuthority,
    )]
    pub token_ata : Account<'info,TokenAccount>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}
