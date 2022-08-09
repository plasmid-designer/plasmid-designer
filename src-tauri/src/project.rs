use std::path::{Path, PathBuf};

use plasmid::{
    prelude::{FastaIupacFile, Import},
    traits::ToLetter,
};

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
}

pub struct Project {
    path: PathBuf,
    editor: Editor,
    file: Option<ProjectFile>,
}

impl Project {
    pub fn new<P>(path: P) -> Self
    where
        P: AsRef<Path>,
    {
        Self {
            path: path.as_ref().to_path_buf(),
            editor: Editor::default(),
            file: Self::load_file_contents(path),
        }
    }

    fn load_file_contents<P>(path: P) -> Option<ProjectFile>
    where
        P: AsRef<Path>,
    {
        let path = path
            .as_ref()
            .extension()
            .unwrap()
            .to_string_lossy()
            .to_string();
        match path.as_ref() {
            "fas" | "fasta" => {
                if let Ok(file) = plasmid::prelude::FastaIupacFile::import_from_path(path) {
                    Some(ProjectFile::Fasta(file))
                } else {
                    None
                }
            }
            _ => None,
        }
    }
}
