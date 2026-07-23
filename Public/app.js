const signInForm = document.getElementById("signin-form");
const signUpForm = document.getElementById("signup-form");

if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = signInForm.username.value.trim();
    const password = signInForm.password.value;

    const body = {
      username,
      password,
    };

    try {
      const response = await fetch(
        "https://backend-features.onrender.com/api/signIn",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();
      if (response.ok) {
        window.location.href = "profile.html";
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  });
}

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = signUpForm.username.value.trim();
    const password = signUpForm.password.value;

    const body = {
      username,
      password,
    };

    try {
      const response = await fetch(
        "https://backend-features.onrender.com/api/signUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  });
}

async function loadProfile() {
  const response = await fetch(
    "https://backend-features.onrender.com/api/profile",
    {
      credentials: "include",
    },
  );
  const user = await response.json();
  document.getElementById("username").textContent = user.userProfile.username;
  document.getElementById("gender").textContent = user.userProfile.gender;
  document.getElementById("profession").textContent =
    user.userProfile.profession;
}

if (document.querySelector(".profile-card")) {
  loadProfile();
}
