use std::collections::VecDeque;

use plasmid::{traits::TryFromLetter, uni::IupacNucleotide};

use crate::{
    history::{EditorSnapshot, EditorSnapshotHistory},
    shared::DisplayCodon,
};

pub enum CursorMovement {
    To(usize),
    By(isize),
    Start,
    End,
    CodonStart,
    CodonEnd,
}

pub enum SelectionMovement {
    Set { start: usize, end: usize },
    ExpandBy(isize),
    Reset,
    All,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Selection {
    pub start: usize,
    pub end: usize,
}

impl Selection {
    pub fn new(a: usize, b: usize, sequence_len: usize) -> Self {
        let start = a.min(b).min(sequence_len).max(0);
        let end = a.max(b).min(sequence_len).max(0);
        Self { start, end }
    }
}

pub struct Editor {
    pub sequence_dirty: bool,
    pub cursor_pos: usize,
    pub sequence: VecDeque<IupacNucleotide>,
    pub codons: Vec<DisplayCodon>,
    pub selection: Option<Selection>,
    pub history: EditorSnapshotHistory,
}

impl Default for Editor {
    fn default() -> Self {
        let mut editor = Self {
            sequence_dirty: false,
            cursor_pos: 0,
            sequence: VecDeque::new(),
            codons: Vec::new(),
            selection: None,
            history: EditorSnapshotHistory::default(),
        };
        editor.history.push(editor.snapshot());
        editor
    }
}

// #region Private API

impl Editor {
    fn snapshot(&self) -> EditorSnapshot {
        EditorSnapshot {
            cursor_pos: self.cursor_pos,
            selection: self.selection.clone(),
            sequence: Vec::from_iter(self.sequence.iter().cloned()),
        }
    }

    fn apply_snapshot(&mut self, snapshot: EditorSnapshot) {
        self.cursor_pos = snapshot.cursor_pos;
        self.selection = snapshot.selection.clone();
        let new_sequence = VecDeque::from_iter(snapshot.sequence.iter().cloned());
        let became_dirty = self.sequence != new_sequence;
        self.sequence = new_sequence;
        self.sequence_dirty = became_dirty;
    }

    #[inline]
    fn inner_insert_nucleotide(&mut self, nucleotide: IupacNucleotide) {
        match self.cursor_pos {
            0 => self.sequence.push_front(nucleotide),
            i if i == self.sequence.len() => self.sequence.push_back(nucleotide),
            i => self.sequence.insert(i, nucleotide),
        }
        self.inner_move_cursor(CursorMovement::By(1), true);
    }

    fn inner_insert_multiple_nucleotides(&mut self, nucleotides: &[IupacNucleotide]) {
        let mut vec = self.sequence.iter().cloned().collect::<Vec<_>>();
        vec.splice(
            self.cursor_pos..self.cursor_pos,
            nucleotides.iter().cloned(),
        );
        self.sequence = VecDeque::from(vec);
        self.inner_move_cursor(CursorMovement::By(nucleotides.len() as isize), true);
    }

    fn inner_move_cursor(&mut self, movement: CursorMovement, reset_selection: bool) {
        match movement {
            CursorMovement::To(index) => {
                if index <= self.sequence.len() {
                    self.cursor_pos = index;
                }
            }
            CursorMovement::By(distance) => {
                if distance.is_negative() {
                    self.cursor_pos = self.cursor_pos.saturating_sub(distance.abs() as usize);
                } else {
                    self.cursor_pos = self
                        .cursor_pos
                        .saturating_add(distance as usize)
                        .min(self.sequence.len());
                }
            }
            CursorMovement::Start => {
                self.cursor_pos = 0;
            }
            CursorMovement::End => {
                self.cursor_pos = self.sequence.len();
            }
            CursorMovement::CodonStart => {
                let distance = if self.cursor_pos % 3 == 0 {
                    3
                } else {
                    self.cursor_pos % 3
                };
                self.cursor_pos = self.cursor_pos.saturating_sub(distance);
            }
            CursorMovement::CodonEnd => {
                self.cursor_pos = self.cursor_pos.saturating_add(3 - self.cursor_pos % 3);
            }
        }

        if reset_selection {
            self.inner_reset_selection();
        }
    }

    fn inner_move_selection(&mut self, movement: SelectionMovement) {
        match movement {
            SelectionMovement::Reset => {
                self.selection = None;
            }
            SelectionMovement::Set { start, end } => {
                self.selection = match start.cmp(&end) {
                    std::cmp::Ordering::Less | std::cmp::Ordering::Greater => {
                        Some(Selection::new(start, end, self.sequence.len()))
                    }
                    std::cmp::Ordering::Equal => None,
                };
                self.inner_move_cursor(CursorMovement::To(end), false);
            }
            SelectionMovement::All => {
                self.selection = Some(Selection::new(0, self.sequence.len(), self.sequence.len()));
            }
            SelectionMovement::ExpandBy(distance) => {
                let abs_distance = distance.abs() as usize;
                match &self.selection {
                    Some(selection) => {
                        if distance.is_negative() {
                            if self.cursor_pos == selection.end {
                                let end = selection.end.saturating_sub(abs_distance);
                                self.selection =
                                    Some(Selection::new(selection.start, end, self.sequence.len()));
                                self.inner_move_cursor(CursorMovement::To(end), false);
                            } else if self.cursor_pos == selection.start {
                                let start = selection.start.saturating_sub(abs_distance);
                                self.selection =
                                    Some(Selection::new(start, selection.end, self.sequence.len()));
                                self.inner_move_cursor(CursorMovement::To(start), false);
                            }
                        } else {
                            if self.cursor_pos == selection.end {
                                let end = selection.end.saturating_add(abs_distance);
                                self.selection =
                                    Some(Selection::new(selection.start, end, self.sequence.len()));
                                self.inner_move_cursor(CursorMovement::To(end), false);
                            } else if self.cursor_pos == selection.start {
                                let start = selection.start.saturating_add(abs_distance);
                                self.selection =
                                    Some(Selection::new(start, selection.end, self.sequence.len()));
                                self.inner_move_cursor(CursorMovement::To(start), false);
                            }
                        }
                    }
                    None => {
                        if distance.is_negative() {
                            let start = self
                                .cursor_pos
                                .saturating_sub(abs_distance)
                                .min(self.sequence.len())
                                .max(0);
                            self.selection =
                                Some(Selection::new(start, self.cursor_pos, self.sequence.len()));
                            self.inner_move_cursor(CursorMovement::To(start), false);
                        } else {
                            let end = self
                                .cursor_pos
                                .saturating_add(abs_distance)
                                .min(self.sequence.len())
                                .max(0);
                            self.selection =
                                Some(Selection::new(self.cursor_pos, end, self.sequence.len()));
                            self.inner_move_cursor(CursorMovement::To(end), false);
                        }
                    }
                };
            }
        }
    }

    fn inner_reset_selection(&mut self) {
        self.selection = None;
    }

    fn inner_delete_selection_content(&mut self) {
        if let Some(selection) = &self.selection {
            self.sequence.drain(selection.start..selection.end);
            self.cursor_pos = selection.start.min(self.sequence.len()).max(0);
            self.sequence_dirty = true;
            self.inner_reset_selection();
        }
    }
}

// #endregion

// #region Public API

impl Editor {
    pub fn reset(&mut self) {
        self.sequence.clear();
        self.codons.clear();
        self.cursor_pos = 0;
        self.selection = None;
        self.sequence_dirty = false;
        self.history.clear();
        self.history.push(self.snapshot());
    }

    pub fn insert(&mut self, letter: char) {
        self.inner_delete_selection_content();

        if let Ok(nucleotide) = IupacNucleotide::try_from_letter(letter) {
            self.inner_insert_nucleotide(nucleotide);
            self.sequence_dirty = true;
        }

        self.history.push(self.snapshot());
    }

    pub fn insert_all(&mut self, text: String) {
        self.inner_delete_selection_content();

        if let Ok(nucleotides) = text
            .chars()
            .map(|c| IupacNucleotide::try_from_letter(c))
            .collect::<Result<Vec<_>, _>>()
        {
            self.inner_insert_multiple_nucleotides(&nucleotides);
            self.sequence_dirty = true;
        }

        self.history.push(self.snapshot());
    }

    pub fn delete(&mut self) {
        if self.selection.is_some() {
            self.inner_delete_selection_content();
            self.history.push(self.snapshot());
            return;
        }

        match self.cursor_pos {
            0 => (),
            1 => _ = self.sequence.pop_front(),
            i if i == self.sequence.len() => _ = self.sequence.pop_back(),
            i => _ = self.sequence.remove(i - 1),
        }

        if self.cursor_pos != 0 {
            self.sequence_dirty = true;
        }

        self.inner_move_cursor(CursorMovement::By(-1), true);
        self.history.push(self.snapshot());
    }

    pub fn delete_next(&mut self) {
        self.inner_delete_selection_content();

        match self.cursor_pos {
            0 => _ = self.sequence.pop_front(),
            i if i == self.sequence.len() - 1 => _ = self.sequence.pop_back(),
            i if i == self.sequence.len() => (),
            i => _ = self.sequence.remove(i),
        }
        self.sequence_dirty = true;

        self.history.push(self.snapshot());
    }

    pub fn move_cursor(&mut self, movement: CursorMovement) {
        self.inner_move_cursor(movement, true);

        // self.history.push(self.snapshot());
    }

    pub fn move_selection(&mut self, movement: SelectionMovement) {
        self.inner_move_selection(movement);

        // self.history.push(self.snapshot());
    }

    // TODO: This could be heavily optimized by keeping track of "dirty" coding regions
    // and recoding only the changed areas into display codons.
    pub fn update(&mut self) {
        self.codons = {
            let mut display_codons = Vec::new();
            let mut chunk = Vec::with_capacity(3);
            for nucleotide in self.sequence.iter().cloned() {
                chunk.push(nucleotide);
                if chunk.len() == 3 {
                    display_codons.push(DisplayCodon::new(&chunk));
                    chunk.clear();
                }
            }
            if !chunk.is_empty() {
                display_codons.push(DisplayCodon::new(&chunk));
            }
            display_codons
        };
        self.sequence_dirty = false;
    }

    pub fn get_selected_sequence(&self) -> String {
        use plasmid::traits::ToLetter;

        match &self.selection {
            Some(selection) => self
                .sequence
                .range(selection.start..selection.end)
                .map(|nuc| nuc.to_letter())
                .collect(),
            None => String::default(),
        }
    }

    pub fn undo(&mut self) {
        if let Some(snapshot) = self.history.get_undo_snapshot() {
            self.apply_snapshot(snapshot);
        }
    }

    pub fn redo(&mut self) {
        if let Some(snapshot) = self.history.get_redo_snapshot() {
            self.apply_snapshot(snapshot);
        }
    }
}

// #endregion

#[cfg(test)]
mod tests {
    use crate::history::EditorSnapshot;

    use super::{Editor, SelectionMovement};

    #[test]
    fn test_insert() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert('A');
        assert_eq!(state.sequence, [A]);
    }

    #[test]
    fn test_insert_with_selection() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert('A');
        state.insert('C');
        state.insert('G');
        state.move_selection(SelectionMovement::Set { start: 1, end: 2 });
        state.insert('T');
        assert_eq!(state.sequence, [A, T, G])
    }

    #[test]
    fn test_insert_all() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());
        assert_eq!(state.sequence, [A, C, G, T]);
    }

    #[test]
    fn test_insert_all_with_selection() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert_all("ACCCT".to_string());
        state.move_selection(SelectionMovement::Set { start: 1, end: 5 });
        state.insert_all("TG".to_string());
        assert_eq!(state.sequence, [A, T, G]);

        let mut state = Editor::default();
        state.insert_all("ACCCT".to_string());
        state.move_selection(SelectionMovement::Set { start: 0, end: 5 });
        state.insert_all("TG".to_string());
        assert_eq!(state.sequence, [T, G]);
    }

    #[test]
    fn test_delete() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());
        state.delete();
        assert_eq!(state.sequence, [A, C, G]);
        state.delete();
        assert_eq!(state.sequence, [A, C]);
    }

    #[test]
    fn test_delete_with_selection() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());
        state.move_selection(SelectionMovement::Set { start: 1, end: 3 });
        state.delete();
        assert_eq!(state.sequence, [A, T]);
    }

    #[test]
    fn test_delete_next() {
        use plasmid::prelude::IupacNucleotide::*;

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());
        state.delete_next();
        assert_eq!(state.sequence, [A, C, G, T]);
        state.cursor_pos = 0;
        state.delete_next();
        assert_eq!(state.sequence, [C, G, T]);
        state.delete_next();
        assert_eq!(state.sequence, [G, T]);
    }

    #[test]
    fn test_move_cursor() {
        use super::CursorMovement;

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());

        state.move_cursor(CursorMovement::To(4));
        assert_eq!(state.cursor_pos, 4);

        state.move_cursor(CursorMovement::To(0));
        assert_eq!(state.cursor_pos, 0);

        state.move_cursor(CursorMovement::By(1));
        assert_eq!(state.cursor_pos, 1);

        state.move_cursor(CursorMovement::By(2));
        assert_eq!(state.cursor_pos, 3);

        state.move_cursor(CursorMovement::By(-1));
        assert_eq!(state.cursor_pos, 2);

        state.move_cursor(CursorMovement::CodonStart);
        assert_eq!(state.cursor_pos, 0);

        state.move_cursor(CursorMovement::CodonEnd);
        assert_eq!(state.cursor_pos, 3);

        state.move_cursor(CursorMovement::Start);
        assert_eq!(state.cursor_pos, 0);

        state.move_cursor(CursorMovement::End);
        assert_eq!(state.cursor_pos, 4);
    }

    #[test]
    fn test_undo_redo() {
        use super::IupacNucleotide::{A, C, G, T};

        let mut state = Editor::default();
        state.insert_all("ACGT".to_string());

        assert_eq!(
            state.history.peek_undo_snapshot(),
            Some(&EditorSnapshot::default())
        );

        state.undo();
        assert!(state.sequence.is_empty());
        assert_eq!(state.cursor_pos, 0);
        assert_eq!(state.selection, None);

        state.redo();
        assert_eq!(state.sequence, [A, C, G, T]);
        assert_eq!(state.cursor_pos, 4);
        assert_eq!(state.selection, None);
    }
}
