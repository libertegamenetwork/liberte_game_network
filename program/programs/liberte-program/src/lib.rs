use anchor_lang::prelude::*;
use anchor_spl::token::{
    self, InitializeAccount, Mint, SetAuthority, Token, TokenAccount, Transfer,
};
use std::convert::TryInto;
use crate::errors::LibreteError::InvalidAuthority;
declare_id!("H5JnjsAu4yYNnY3fHxTTA2ySnYqqf2uAWK2QHJKPBMho");

mod account;
mod constant;
mod context;
mod errors;
mod event;

use crate::context::*;
use crate::errors::*;
use crate::event::*;

#[program]
pub mod liberte_program {
    use super::*;

    //Initialize creates the Settings PDA to track Node Counter
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let settings = &mut ctx.accounts.settings;
        settings.all_node = 0;
        settings.active_node = 0;
        settings.authority = ctx.accounts.authority.key();
        settings.reward_mint = ctx.accounts.mint.key();
        settings.whitelist = [0; 32];
        settings.blacklist = [0; 32];
        settings.reserved = [0; 32];
        settings.bump = *ctx.bumps.get("settings").unwrap();
        Ok(())
    }

    //Create Node PDA
    pub fn register_node(ctx: Context<RegisterNode>, ip_addr: String,listen_port :u16,signature :String) -> Result<()> {
        let node = &mut ctx.accounts.node;
        let now = ctx.accounts.clock.unix_timestamp as u64;
        node.listen_ip = ip_addr.clone();
        node.listen_port = listen_port.clone();
        node.active = true;
        node.authority = ctx.accounts.authority.key();
        node.init_stamp = now;
        emit!(NewNodeEvent{
            signer:ctx.accounts.authority.key(),
            ip:ip_addr,
            port:listen_port
        });
        Ok(())

    }

    pub fn close_node(ctx: Context<CloseNode>, signature :String) -> Result<()> {
        let node = &mut ctx.accounts.node;
        let setting = &mut ctx.accounts.settings;
        let now = ctx.accounts.clock.unix_timestamp as u64;
        require_keys_eq!(node.authority, ctx.accounts.authority.key());
        setting.active_node = setting.active_node.checked_sub(1).unwrap();
        emit!(CloseNodeEvent{
            signer:ctx.accounts.authority.key(),
            ip:node.listen_ip.clone(),
            port:node.listen_port.clone(),
            timestamp:now
        });
        Ok(())
    }

    pub fn claim_node(ctx: Context<ClaimNode>) -> Result<()> {
        let setting = &mut ctx.accounts.settings;
        let claim = &mut ctx.accounts.claim;
        let node_index= get_random_u64(setting.all_node);
        claim.authority = ctx.accounts.authority.key();
        claim.init_stamp = ctx.accounts.clock.unix_timestamp as u64;
        claim.index = node_index;
        claim.bump = *ctx.bumps.get("claim").unwrap();
        setting.active_node = setting.active_node.checked_add(1).unwrap();
        /// TODO Verify CNFT Merkel
        emit!(ClaimNodeEvent{
            index:node_index,
            timestamp:ctx.accounts.clock.unix_timestamp as u64
        });
        Ok(())
    }
}
pub fn get_random_u64(max: u64) -> u64 {
    let clock = Clock::get().unwrap();
    let slice = &anchor_lang::solana_program::keccak::hash(&clock.slot.to_be_bytes()).to_bytes()[0..8];
    let num: u64 = u64::from_be_bytes(slice.try_into().unwrap());
    let target = num/(u64::MAX/max);
    return target;
}
/*
1. Allows nodes to register/deregister themselves by creating PDAs that point to their IP addresses (also allows updating their IP addresses)
3. Node Request Ix that checks ownership of a distribution NFT and then picks a node to assign
2. Escrow features for holding tokens (can just be SOL tokens instead of $LGN tokens) and debiting them by servers
4. Loot Deposit from Node to be minted by Player
5. Module Mint Authority Registration
*/
