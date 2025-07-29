document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.querySelector(".show-profile");
  const appointmentsBtn = document.querySelector(".check-appointment");
  const profileSection = document.querySelector(".doctorProfile");
  const appointmentsSection = document.querySelector(".appointments");

  if (profileBtn && appointmentsBtn && profileSection && appointmentsSection) {
    profileBtn.addEventListener("click", () => {
      profileSection.removeAttribute("hidden");
      appointmentsSection.setAttribute("hidden", true);
      profileBtn.classList.add("active-menu");
      appointmentsBtn.classList.remove("active-menu");
    });

    appointmentsBtn.addEventListener("click", () => {
      appointmentsSection.removeAttribute("hidden");
      profileSection.setAttribute("hidden", true);
      appointmentsBtn.classList.add("active-menu");
      profileBtn.classList.remove("active-menu");
    });
  }
});
