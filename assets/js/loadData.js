import projectsData from "./projectsData.js";
import skillData from "./skillData.js";
document.addEventListener("DOMContentLoaded", function () {
  skillData.loadData(); //스킬 불러오기
  projectsData.loadData();

  const navItems = document.querySelectorAll("header nav ul li");

  //상단 바를 이용해서 이동하는 경우
  navItems.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionText = this.textContent.toLowerCase().trim();
      scrollToSection(sectionText);
    });
  });

  //스크롤로 해당 세션 지나가는 경우
  const sections = document.querySelectorAll("section");
  const sectionOffsets = [];
  sections.forEach((section) => {
    sectionOffsets.push(section.offsetTop);
  });
  window.addEventListener("scroll", handleScroll);

  function handleScroll() {
    const scrollPosition = window.scrollY + 300;
    let activeSectionIndex = -1;
    for (let i = 0; i < sectionOffsets.length; i++) {
      if (scrollPosition >= sectionOffsets[i]) {
        activeSectionIndex = i;
      } else {
        break; // 스크롤 위치가 섹션의 위쪽에 있을 때 반복문 종료
      }
    }
    if (activeSectionIndex === -1) {
      activeSectionIndex = 0; // 스크롤 위치가 첫 번째 섹션의 위에 있을 때
    }
    navItems.forEach((link) => {
      link.classList.remove("select");
    });
    navItems[activeSectionIndex].classList.add("select");
  }

  function scrollToSection(sectionText) {
    const section = document.querySelector("section#" + sectionText);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    // 버튼에 active 클래스 추가
    navItems.forEach((navItem) => {
      navItem.classList.remove("select");
    });
    const clickedNavItem = Array.from(navItems).find((navItem) => {
      return navItem.textContent.trim().toLowerCase() === sectionText;
    });
    if (clickedNavItem) {
      clickedNavItem.classList.add("select");
    }
  }
});
