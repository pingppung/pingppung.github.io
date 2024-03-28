const projectsData = {
  loadData: function () {
    fetch("/data/projects.json")
      .then((response) => response.json())
      .then((data) => {
        //const project = data.find((item) => item.subject == projectName);
        this.createProject(data);
      })
      .catch((error) =>
        console.error(
          "포트폴리오 데이터를 불러오는 중 오류가 발생했습니다.",
          error
        )
      );
  },

  createProject: function (data) {
    const projectSection = document.querySelector(".projects-list");
    data.forEach((project) => {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");

      const conenttDiv = document.createElement("div");
      conenttDiv.classList.add("project-content");

      const subject = document.createElement("h3"); //주제 타이틀
      subject.classList.add("subject");
      subject.textContent = project.subject;

      const content = document.createElement("div");
      content.classList.add("content");
      content.textContent = project.content;

      const skills = document.createElement("div");
      skills.classList.add("skills");
      skills.textContent = "스킬: " + project.skills.join(", ");

      const role = document.createElement("div");
      role.classList.add("role");
      role.innerHTML = "<strong>맡은 역할:</strong>";
      project.role.forEach((roleItem) => {
        const roleParagraph = document.createElement("p");
        roleParagraph.textContent = roleItem;
        role.appendChild(roleParagraph);
      });

      const gitHubOpen = document.createElement("a");
      gitHubOpen.classList.add("gitHubOpen");
      gitHubOpen.href = project.git;

      const youtubeOpen = document.createElement("a");
      youtubeOpen.classList.add("youtubeOpen");
      youtubeOpen.href = project.youtube;

      conenttDiv.appendChild(subject);
      conenttDiv.appendChild(content);
      conenttDiv.appendChild(skills);
      conenttDiv.appendChild(role);
      conenttDiv.appendChild(gitHubOpen);
      conenttDiv.appendChild(youtubeOpen);

      const imgDiv = document.createElement("div");
      imgDiv.classList.add("project-img");

      projectDiv.appendChild(conenttDiv);
      projectDiv.appendChild(imgDiv);

      projectSection.appendChild(projectDiv);
    });
  },
};

export default projectsData;
