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

      const subject = document.createElement("div"); //주제 타이틀
      subject.classList.add("subject");
      subject.textContent = project.subject;

      projectDiv.appendChild(subject);

      const conenttDiv = document.createElement("div");
      conenttDiv.classList.add("project-content");

      const imgDiv = document.createElement("div");
      imgDiv.classList.add("project-img");
      const img = document.createElement("div");

      img.classList.add("img");
      img.style.backgroundImage = `url('../assets/images/${project.img}')`;
      img.style.backgroundSize = "contain";
      imgDiv.appendChild(img);

      conenttDiv.appendChild(imgDiv);

      const projectInfoDiv = document.createElement("div");
      projectInfoDiv.classList.add("project-info");

      const summary = document.createElement("div");
      summary.classList.add("content");
      summary.textContent = project.summary;

      const skills = document.createElement("div");
      skills.classList.add("skills");
      skills.textContent = project.skills.join(", ");

      const role = document.createElement("div");
      role.classList.add("role");
      project.role.forEach((roleItem) => {
        const roleParagraph = document.createElement("p");
        roleParagraph.textContent = "- " + roleItem;
        role.appendChild(roleParagraph);
      });

      const gitHubOpen = document.createElement("a");
      gitHubOpen.classList.add("gitHubOpen");
      gitHubOpen.href = project.git;

      const youtubeOpen = document.createElement("a");
      youtubeOpen.classList.add("youtubeOpen");
      youtubeOpen.href = project.youtube;

      projectInfoDiv.appendChild(summary);
      projectInfoDiv.appendChild(skills);
      projectInfoDiv.appendChild(role);
      projectInfoDiv.appendChild(gitHubOpen);
      projectInfoDiv.appendChild(youtubeOpen);

      conenttDiv.appendChild(projectInfoDiv);
      projectDiv.appendChild(conenttDiv);
      projectSection.appendChild(projectDiv);
    });
  },
};

export default projectsData;
