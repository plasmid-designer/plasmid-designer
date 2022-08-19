#[derive(serde::Serialize, ts_rs::TS)]
#[ts(export)]
pub struct SequenceItem {
    pub codon: Vec<char>,
    pub anticodon: Vec<char>,
    pub peptide: Option<char>,
    pub start_index: usize,
}
