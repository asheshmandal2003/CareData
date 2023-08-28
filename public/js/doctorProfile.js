$(".check-appointment").on("click", showAppointments);
$(".show-profile").on("click", showProfile);

function showProfile() {
  $(".doctorProfile").removeAttr("hidden");
  $(".appointments").attr("hidden", true);
}

function showAppointments() {
  $(".doctorProfile").attr("hidden", true);
  $(".appointments").removeAttr("hidden");
}
