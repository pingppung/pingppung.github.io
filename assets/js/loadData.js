import projectsData from "./projectsData.js";
import skillData from "./skillData.js";
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll("header nav ul li");
  navItems.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionText = this.textContent.toLowerCase().trim();

      const section = document.querySelector("section#" + sectionText);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }

      navItems.forEach(function (navItem) {
        navItem.classList.remove("select");
      });

      this.classList.add("select");
    });
  });

  // const projects = document.querySelectorAll("#portfolio .projects ul li");
  // projects.forEach((project) => {
  //   project.addEventListener("click", function () {
  //     const projectName = this.getAttribute("data-project");
  //     portfolioData.loadData(projectName);
  //   });
  // });

  skillData.loadData(); //스킬 불러오기
  //const defaultProject = projects[0].getAttribute("data-project"); // 기본 프로젝트 설정
  projectsData.loadData();
});
