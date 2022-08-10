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
    current_project_id: Option<Uuid>,
}

impl ProjectManager {
    pub fn load_file<P>(&mut self, path: P)
    where
        P: AsRef<Path>,
    {
        self.projects.push(Project::new(path));
    }

    pub fn set_current_project<S>(&mut self, uuid: S)
    where
        S: AsRef<str>,
    {
        self.current_project_id = self
            .projects
            .iter()
            .find(|project| project.uuid.to_string() == uuid.as_ref())
            .map(|project| project.uuid.clone());
    }

    pub fn current_project(&mut self) -> Option<&mut Project> {
        if let Some(uuid) = self.current_project_id {
            self.projects
                .iter_mut()
                .find(|project| project.uuid == uuid)
        } else {
            None
        }
    }

    pub fn current_editor(&mut self) -> Option<&mut Editor> {
        self.current_project().map(|project| &mut project.editor)
    }

    pub fn load_scratchpad(&mut self) {
        self.projects.push(Project::new_scratchpad());
    }

    pub fn project_infos(&self) -> Vec<ProjectInfo> {
        self.projects.iter().map(|project| project.into()).collect()
    }
}
