var guestNumber = 0;

function increment() {
  guestNumber++;
  document.getElementById("updateGuestInfo").innerHTML = guestNumber;
}

function decrement() {
  if (guestNumber > 0) {
    guestNumber--;
    document.getElementById("updateGuestInfo").innerHTML = guestNumber;
  }
}

function guestupdate() {
  var guest = document.getElementById("updateGuestInfo").innerText;
  document.getElementById("showguest").innerHTML = guest;
}
