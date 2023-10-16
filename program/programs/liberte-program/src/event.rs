use anchor_lang::prelude::*;

#[event]
pub struct NewNodeEvent{
    pub signer:Pubkey,
    pub ip:String,
    pub port:u16,
}

#[event]
pub struct CloseNodeEvent{
    pub signer:Pubkey,
    pub ip:String,
    pub port:u16,
    pub timestamp:u64
}
#[event]
pub struct ClaimNodeEvent{
    pub index:u64,
    pub timestamp:u64
}