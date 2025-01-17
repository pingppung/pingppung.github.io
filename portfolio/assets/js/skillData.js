const skillData = {
  loadData: function () {
    fetch("/data/skill.json")
      .then((response) => response.json())
      .then((data) => {
        this.displaySkills(data);
      })
      .catch((error) =>
        console.error("스킬 데이터를 불러오는 중 오류가 발생했습니다.", error)
      );
  },

  displaySkills: function (data) {
    const skillsSection = document.querySelector("#skills");

    const frontendList = skillsSection.querySelector(".frontend");
    const frontendSkills = data.find((item) =>
      item.hasOwnProperty("frontend")
    ).frontend;
    frontendSkills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      frontendList.appendChild(li);
    });

    const backendList = skillsSection.querySelector(".backend");
    const backendSkills = data.find((item) =>
      item.hasOwnProperty("backend")
    ).backend;
    backendSkills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      backendList.appendChild(li);
    });

    const devopsList = skillsSection.querySelector(".devops");
    const devopsSkills = data.find((item) =>
      item.hasOwnProperty("devops")
    ).devops;
    devopsSkills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      devopsList.appendChild(li);
    });
  },
};

export default skillData;
