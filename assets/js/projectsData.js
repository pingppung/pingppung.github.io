const projectsData = {
  loadData: function (projectName) {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => {
        const project = data.find((item) => item.subject == projectName);
        this.createProject(project);
      })
      .catch((error) =>
        console.error(
          "포트폴리오 데이터를 불러오는 중 오류가 발생했습니다.",
          error
        )
      );
  },

  createProject: function (project) {
    const projectSection = document.querySelector("#projects .pj");

    const subject = projectSection.querySelector(".subject");
    subject.textContent = project.subject;

    const content = projectSection.querySelector(".content");
    content.textContent = project.content;

    const skills = projectSection.querySelector(".skills");
    skills.textContent = "스킬: " + project.skills.join(", ");

    const role = projectSection.querySelector(".role");
    role.innerHTML = "<strong>맡은 역할:</strong>";
    project.role.forEach((roleItem) => {
      const roleParagraph = document.createElement("p");
      roleParagraph.textContent = roleItem;
      role.appendChild(roleParagraph);
    });

    const gitHubOpen = projectSection.querySelector(".gitHubOpen");
    gitHubOpen.href = project.git;

    const youtubeOpen = projectSection.querySelector(".youtubeOpen");
    youtubeOpen.href = project.youtube;

    const img = projectSection.querySelector(".project-img");
    img.style.backgroundImage = `url('../assets/images/${project.img}')`;
  },
};

export default projectsData;
