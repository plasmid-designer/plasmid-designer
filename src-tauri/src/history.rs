use std::collections::VecDeque;

use plasmid::{traits::ToLetter, uni::IupacNucleotide};

use crate::editor::Selection;

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct EditorSnapshot {
    pub cursor_pos: usize,
    pub selection: Option<Selection>,
    pub sequence: Vec<IupacNucleotide>,
}

impl std::fmt::Display for EditorSnapshot {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "EditorSnapshot(cursor_pos: {}, selection: {:?}, sequence: {:?})",
            self.cursor_pos,
            self.selection,
            self.sequence
                .iter()
                .map(|n| n.to_letter())
                .collect::<String>()
        )
    }
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
        // Truncate snapshots. Not sure whether this is a good idea or not..
        if self.snapshots.len() >= 2 && self.index < self.snapshots.len().saturating_sub(1) {
            self.snapshots.truncate(self.index + 1);
        }

        // Disallow pushing the same snapshot twice
        if let Some(last_snapshot) = self.snapshots.iter().last() {
            if &snapshot == last_snapshot {
                return;
            }
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
        use plasmid::uni::IupacNucleotide::*;

        let mut history = EditorSnapshotHistory::default();

        history.push(EditorSnapshot::default());
        assert_eq!(history.index, 0);
        assert_eq!(history.peek_undo_snapshot(), None);

        history.push(EditorSnapshot {
            cursor_pos: 3,
            selection: None,
            sequence: vec![A, T, G],
        });
        assert_eq!(history.index, 1);
        assert_eq!(
            history.peek_undo_snapshot(),
            Some(&EditorSnapshot::default())
        );

        history.get_undo_snapshot().unwrap();
        assert_eq!(history.index, 0);
        assert_eq!(history.get_undo_snapshot(), None);
    }

    #[test]
    fn test_redo() {
        use plasmid::uni::IupacNucleotide::*;

        let mut history = EditorSnapshotHistory::default();

        history.push(EditorSnapshot::default());
        history.push(EditorSnapshot {
            cursor_pos: 3,
            selection: None,
            sequence: vec![A, T, G],
        });
        assert_eq!(history.index, 1);

        history.get_undo_snapshot().unwrap();
        assert_eq!(history.index, 0);
        assert_eq!(
            history.peek_redo_snapshot(),
            Some(&EditorSnapshot {
                cursor_pos: 3,
                selection: None,
                sequence: vec![A, T, G],
            })
        );

        history.get_redo_snapshot().unwrap();
        assert_eq!(history.index, 1);
    }

    #[test]
    fn test_truncation() {
        use plasmid::uni::IupacNucleotide::*;

        let mut history = EditorSnapshotHistory::default();

        history.push(EditorSnapshot::default());
        history.push(EditorSnapshot {
            cursor_pos: 4,
            selection: None,
            sequence: vec![A, T, G, C],
        });
        history.push(EditorSnapshot {
            cursor_pos: 6,
            selection: None,
            sequence: vec![A, T, G, C, T, G],
        });
        history.get_undo_snapshot().unwrap();
        history.push(EditorSnapshot {
            cursor_pos: 6,
            selection: None,
            sequence: vec![A, T, G, T, A, G],
        });

        assert_eq!(history.snapshots.len(), 3);
        assert_eq!(history.snapshots[0], EditorSnapshot::default());
        assert_eq!(
            history.snapshots[1],
            EditorSnapshot {
                cursor_pos: 4,
                selection: None,
                sequence: vec![A, T, G, C],
            }
        );
        assert_eq!(
            history.snapshots[2],
            EditorSnapshot {
                cursor_pos: 6,
                selection: None,
                sequence: vec![A, T, G, T, A, G],
            }
        );
    }
}
