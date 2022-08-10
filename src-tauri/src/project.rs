use std::path::{Path, PathBuf};

use plasmid::{
    prelude::{FastaIupacFile, Import},
    traits::{ToLetter, TryFromLetter},
    uni::IupacNucleotide,
};
use uuid::Uuid;

use crate::editor::Editor;

pub enum ProjectFile {
    Fasta(FastaIupacFile),
}

impl ProjectFile {
    pub fn sequence(&self) -> String {
        match self {
            Self::Fasta(file) => file.sequence.iter().map(|c| c.to_letter()).collect(),
        }
    }

    pub fn set_sequence(&mut self, sequence: String) {
        match self {
            Self::Fasta(file) => {
                file.sequence = sequence
                    .chars()
                    .filter_map(|c| IupacNucleotide::try_from_letter(c).ok())
                    .collect();
            }
        }
    }

    pub fn set_sequence_iupac(&mut self, sequence: &[IupacNucleotide]) {
        match self {
            Self::Fasta(file) => {
                file.sequence = Vec::from_iter(sequence.into_iter().map(|n| n.clone()));
            }
        }
    }
}

pub enum ProjectType {
    File,
    Scratchpad,
}

pub struct Project {
    pub uuid: Uuid,
    pub editor: Editor,
    pub name: Option<String>,
    path: Option<PathBuf>,
    file: Option<ProjectFile>,
    project_type: ProjectType,
}

impl Project {
    pub fn new<P>(path: P) -> Self
    where
        P: AsRef<Path>,
    {
        let file = Self::load_file_contents(path.as_ref());
        let editor = {
            let mut editor = Editor::default();
            if let Some(seq) = file.as_ref().map(|f| f.sequence()) {
                editor.insert_all(seq);
            }
            editor
        };
        Self {
            uuid: Uuid::new_v4(),
            project_type: ProjectType::File,
            name: path
                .as_ref()
                .components()
                .last()
                .map(|s| s.as_os_str().to_string_lossy().to_string()),
            path: Some(path.as_ref().to_path_buf()),
            file,
            editor,
        }
    }

    pub fn new_scratchpad() -> Self {
        Self {
            uuid: Uuid::new_v4(),
            project_type: ProjectType::Scratchpad,
            name: None,
            path: None,
            file: None,
            editor: Editor::default(),
        }
    }

    pub fn save(&mut self) {
        if let Some(file) = self.file.as_mut() {
            file.set_sequence_iupac(&self.editor.sequence.iter().cloned().collect::<Vec<_>>()[..]);
        }
    }

    fn load_file_contents<P>(path: P) -> Option<ProjectFile>
    where
        P: AsRef<Path>,
    {
        let extension = path
            .as_ref()
            .extension()
            .map(|ext| ext.to_string_lossy().to_string());
        if let Some(extension) = extension {
            match extension.as_ref() {
                "fas" | "fasta" => {
                    if let Ok(file) = plasmid::prelude::FastaIupacFile::import_from_path(path) {
                        Some(ProjectFile::Fasta(file))
                    } else {
                        None
                    }
                }
                _ => None,
            }
        } else {
            None
        }
    }
}
