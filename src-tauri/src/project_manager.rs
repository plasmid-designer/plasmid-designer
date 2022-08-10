use std::path::Path;

use serde::Serialize;
use uuid::Uuid;

use crate::{editor::Editor, project::Project};

#[derive(Debug, Serialize)]
pub struct ProjectInfo {
    name: String,
    uuid: String,
}

impl From<&Project> for ProjectInfo {
    fn from(project: &Project) -> Self {
        Self {
            name: project.name.clone().unwrap_or_else(|| "Scratchpad".into()),
            uuid: project.uuid.to_string(),
        }
    }
}

#[derive(Default)]
pub struct ProjectManager {
    projects: Vec<Project>,
}

impl ProjectManager {
    pub fn load_file<P>(&mut self, path: P)
    where
        P: AsRef<Path>,
    {
        self.projects.push(Project::new(path));
    }

    pub fn load_scratchpad(&mut self) {
        self.projects.push(Project::new_scratchpad());
    }

    pub fn project_infos(&self) -> Vec<ProjectInfo> {
        self.projects.iter().map(|project| project.into()).collect()
    }

    pub fn get_mut_editor_for_id<S>(&mut self, uuid: S) -> Option<&mut Editor>
    where
        S: AsRef<str>,
    {
        self.projects
            .iter_mut()
            .find(|project| project.uuid.to_string() == uuid.as_ref())
            .map(|project| &mut project.editor)
    }
}
