use std::collections::VecDeque;

use plasmid::uni::IupacNucleotide;

use crate::editor::Selection;

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct EditorSnapshot {
    pub cursor_pos: usize,
    pub selection: Option<Selection>,
    pub sequence: Vec<IupacNucleotide>,
}

#[derive(Debug, Default)]
pub struct EditorSnapshotHistory {
    pub snapshots: VecDeque<EditorSnapshot>,
    index: usize,
}

impl EditorSnapshotHistory {
    pub fn clear(&mut self) {
        self.snapshots.clear();
        self.index = 0;
    }

    pub fn push(&mut self, snapshot: EditorSnapshot) {
        if !self.snapshots.is_empty() && self.index < self.snapshots.len() - 1 {
            self.snapshots.truncate(self.index);
        }
        self.snapshots.push_back(snapshot);
        self.index = self.snapshots.len() - 1;
    }

    pub fn get_undo_snapshot(&mut self) -> Option<EditorSnapshot> {
        if self.index > 0 {
            self.index -= 1;
            Some(self.snapshots[self.index].clone())
        } else {
            None
        }
    }

    pub fn get_redo_snapshot(&mut self) -> Option<EditorSnapshot> {
        if self.index < self.snapshots.len() - 1 {
            self.index += 1;
            let result = Some(self.snapshots[self.index].clone());
            result
        } else {
            None
        }
    }

    #[cfg(test)]
    pub fn peek_undo_snapshot(&self) -> Option<&EditorSnapshot> {
        if self.index > 0 {
            Some(&self.snapshots[self.index - 1])
        } else {
            None
        }
    }

    #[cfg(test)]
    pub fn peek_redo_snapshot(&self) -> Option<&EditorSnapshot> {
        if self.index < self.snapshots.len() - 1 {
            Some(&self.snapshots[self.index + 1])
        } else {
            None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{EditorSnapshot, EditorSnapshotHistory};

    #[test]
    fn test_undo() {
        let mut history = EditorSnapshotHistory::default();

        history.push(EditorSnapshot::default());
        assert_eq!(history.index, 0);
        assert_eq!(history.peek_undo_snapshot(), None);

        history.push(EditorSnapshot::default());
        assert_eq!(history.index, 1);
        assert_eq!(
            history.peek_undo_snapshot(),
            Some(&EditorSnapshot {
                cursor_pos: 0,
                selection: None,
                sequence: vec![],
            })
        );

        history.get_undo_snapshot().unwrap();
        assert_eq!(history.index, 0);
        assert_eq!(history.get_undo_snapshot(), None);
    }

    #[test]
    fn test_redo() {
        let mut history = EditorSnapshotHistory::default();

        history.push(EditorSnapshot::default());
        history.push(EditorSnapshot::default());
        assert_eq!(history.index, 1);

        history.get_undo_snapshot().unwrap();
        assert_eq!(history.index, 0);
        assert_eq!(history.peek_redo_snapshot(), Some(&EditorSnapshot::default()));

        history.get_redo_snapshot().unwrap();
        assert_eq!(history.index, 1);
    }
}
