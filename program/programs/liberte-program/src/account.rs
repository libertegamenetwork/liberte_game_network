use anchor_lang::prelude::*;

use crate::constant::*;

#[account]
pub struct Settings {
    pub authority: Pubkey,
    pub reward_mint: Pubkey,
    pub all_node: u64,
    pub active_node: u64,
    pub whitelist:[u8;32],
    pub blacklist:[u8;32],
    pub reserved: [u8;32],
    pub bump :u8
}

#[account]
pub struct Node {
    pub authority: Pubkey,
    pub init_stamp : u64,
    pub listen_ip: String,
    pub listen_port: u16,
    pub active: bool,
    pub bump: u8
}
#[account]
pub struct Claim {
    pub authority: Pubkey,
    pub init_stamp : u64,
    pub index : u64,
    pub bump: u8
}
